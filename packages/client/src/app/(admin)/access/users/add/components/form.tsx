'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { RoleEntity, UserCreateDto } from '@huebot/common';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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

const formSchema: z.ZodType<UserCreateDto> = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail is required' })
    .email('Invalid email'),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
  role: z.string().nonempty({ message: 'Role must selected' }),
});

interface Props {
  roles: RoleEntity[];
}

interface FormState {
  loading: boolean;
  error: string;
}

const AddUserForm: React.FunctionComponent<Props> = ({ roles }) => {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: '',
    },
  });

  const onSubmit = async (input: z.infer<typeof formSchema>) => {
    setFormState({ error: '', loading: true });

    const response = await fetch('/api/v1/users/create', {
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

    queryClient.setQueryData(['users'], json);

    router.push('/access/users');
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
                  disabled={formState.loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temporary Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={formState.loading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The user will be prompted to reset upon initial sign in
              </FormDescription>
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
            disabled={formState.loading}
          >
            {formState.loading && (
              <Icons.spinner className="h-4 w-4 animate-spin absolute left-2.5" />
            )}
            Submit
          </Button>
        </div>
        {formState.error && <FormMessage>{formState.error}</FormMessage>}
      </form>
    </Form>
  );
};

export default AddUserForm;
