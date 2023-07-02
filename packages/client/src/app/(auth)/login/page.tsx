'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { UserLoginDto } from '@huebot/common';

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

const formSchema: z.ZodType<UserLoginDto> = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail is required' })
    .email('Invalid email'),
  password: z.string().nonempty({ message: 'password is required' }),
});

interface FormState {
  loading: boolean;
  error: string;
}

const Page: React.FunctionComponent = () => {
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
    },
  });

  const onSubmit = async (input: z.infer<typeof formSchema>) => {
    setFormState({ error: '', loading: true });

    const response = await fetch('/api/v1/users/login', {
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

    router.push('/');
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={formState.loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={formState.loading}>
          {formState.loading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
        {formState.error && <FormMessage>{formState.error}</FormMessage>}
      </form>
    </Form>
  );
};

export default Page;
