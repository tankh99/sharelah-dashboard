"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserForm } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/form/form-text-input';
import { FormSelect } from '@/components/form/form-select';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '../ui/form';

interface UserFormProps {
  initialData?: Partial<UserForm>;
  onSubmit: (data: UserForm) => void;
  isLoading?: boolean;
}

export const UserFormComponent = ({ initialData, onSubmit, isLoading = false }: UserFormProps) => {
  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: '',
      yearOfBirth: new Date().getFullYear(),
      gender: 'male',
      phoneNumber: '',
      email: '',
      ...initialData,
    },
  });

  const handleSubmit = (data: UserForm) => {
    console.log(data)
    onSubmit(data);
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Enter the user details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextInput
                form={form}
                name="name"
                label="Full Name"
                placeholder="Enter full name"
              />
              
              <FormTextInput
                form={form}
                name="yearOfBirth"
                label="Year of Birth"
                type="number"
                placeholder="e.g., 1990"
              />
              
              <FormSelect
                form={form}
                name="gender"
                label="Gender"
                options={genderOptions}
                optionLabelKey="label"
                optionValueKey="value"
              />
              
              <FormTextInput
                form={form}
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
              />
              
              <FormTextInput
                form={form}
                name="email"
                label="Email"
                placeholder="Enter email address"
                type="email"
              />
              
            </div>

    
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save User'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
