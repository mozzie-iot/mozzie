'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  ResetPasswordDto,
  RoleEntity,
  UserEntity,
  UserUpdateDto,
} from '@huebot/common';

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
import { useToast } from '@/components/ui/use-toast';

interface FormProps extends ResetPasswordDto {
  password: string;
  confirm_password: string;
}

const formSchema: z.ZodType<FormProps> = z
  .object({
    password: z
      .string()
      .nonempty({ message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirm_password: z.string(),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'The passwords did not match',
      });
    }
  });

interface Props {
  user: UserEntity;
}

interface FormState {
  loading: boolean;
  error: string;
}

const ResetPasswordForm: React.FunctionComponent<Props> = ({ user }) => {
  const { toast } = useToast();

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (input: z.infer<typeof formSchema>) => {
    setFormState({ error: '', loading: true });

    const response = await fetch(`/api/v1/users/reset-password/${user.id}`, {
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

    setFormState({ error: '', loading: false });

    form.reset();

    toast({
      title: 'Success',
      description: 'User password updated',
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
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
            Reset
          </Button>
        </div>
        {formState.error && <FormMessage>{formState.error}</FormMessage>}
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
