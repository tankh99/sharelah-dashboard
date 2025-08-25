"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/form/form-text-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '../ui/form';
import { useRouter } from 'next/navigation';

export const LoginFormComponent = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      // Handle unexpected errors
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Dashboard Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormTextInput
                form={form}
                name="email"
                label="Email address"
                placeholder="Enter your email"
                type="email"
              />

              <FormTextInput
                form={form}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                inputProps={{
                  autoComplete: "current-password",
                  type: "password"
                }}
              />

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

