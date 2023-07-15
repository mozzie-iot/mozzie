'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { RoleEntity, UserEntity, UserUpdateDto } from '@huebot/common';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface FormProps extends UserUpdateDto {
  email: string;
}

const formSchema: z.ZodType<FormProps> = z.object({
  email: z.string(),
  role: z.string().nonempty({ message: 'Role must selected' }),
});

interface Props {
  user: UserEntity;
  roles: RoleEntity[];
}

interface FormState {
  loading: boolean;
  error: string;
}

const UserProfileForm: React.FunctionComponent<Props> = ({ user, roles }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
      role: user.is_admin ? 'admin' : user.role.nickname,
    },
  });

  const onSubmit = async (input: z.infer<typeof formSchema>) => {
    setFormState({ error: '', loading: true });

    const response = await fetch(`/api/v1/users/update/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const json = await response.json();

    if (json.statusCode === 400) {
      setFormState({ error: json.message, loading: false });
      return;
    }

    queryClient.setQueryData(['user', { id: user.id }], json);

    setFormState({ error: '', loading: false });

    toast({
      title: 'Success',
      description: 'User profile updated',
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  type="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">
                    Administrator - full access
                  </SelectItem>
                  {roles
                    .sort((a, b) => (a.sort > b.sort ? 1 : -1))
                    .map((role) => (
                      <SelectItem key={role.id} value={role.nickname}>
                        {role.nickname} - {role.description}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-8 relative"
            disabled={formState.loading || !form.formState.isDirty}
          >
            {formState.loading && (
              <Icons.spinner className="h-4 w-4 animate-spin absolute left-2.5" />
            )}
            Update
          </Button>
        </div>
        {formState.error && <FormMessage>{formState.error}</FormMessage>}
      </form>
    </Form>
  );
};

export default UserProfileForm;
