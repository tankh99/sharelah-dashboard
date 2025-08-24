"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserForm } from '@/lib/validations';
import { UserRole, UserGender, UserStatus } from '@/lib/enums';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/form/form-text-input';
import { FormSelect } from '@/components/form/form-select';
import { FormDatePicker } from '@/components/form/form-date-picker';
import { FormCheckboxes } from '@/components/form/form-checkboxes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '../ui/form';

interface UserFormProps {
  initialData?: Partial<UserForm>;
  onSubmit: (data: UserForm) => void;
  isLoading?: boolean;
}

export const UserFormComponent = ({ initialData, onSubmit, isLoading = false }: UserFormProps) => {
  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      dateOfBirth: '',
      gender: UserGender.MALE,
      phoneNumber: '',
      email: '',
      password: '',
      verifyPassword: '',
      roles: [UserRole.USER],
      deviceId: '',
      facebookId: '',
      status: UserStatus.ACTIVE,
      properties: [],
      ...initialData,
    },
  });

  const handleSubmit = (data: UserForm) => {
    onSubmit(data);
  };

  const roleOptions = Object.values(UserRole).map(role => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1),
  }));

  const genderOptions = Object.values(UserGender).map(gender => ({
    value: gender,
    label: gender.charAt(0).toUpperCase() + gender.slice(1),
  }));

  const statusOptions = Object.values(UserStatus).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Enter the user details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextInput
                form={form}
                name="name"
                label="Full Name"
                placeholder="Enter full name"
              />
              
              <FormDatePicker
                form={form}
                name="dateOfBirth"
                label="Date of Birth"
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
              
              <FormSelect
                form={form}
                name="status"
                label="Status"
                options={statusOptions}
                optionLabelKey="label"
                optionValueKey="value"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextInput
                form={form}
                name="password"
                label="Password"
                placeholder="Enter password"
                type="password"
              />
              
              <FormTextInput
                form={form}
                name="verifyPassword"
                label="Verify Password"
                placeholder="Confirm password"
                type="password"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextInput
                form={form}
                name="deviceId"
                label="Device ID"
                placeholder="Enter device ID (optional)"
              />
              
              <FormTextInput
                form={form}
                name="facebookId"
                label="Facebook ID"
                placeholder="Enter Facebook ID (optional)"
              />
            </div>

            <FormCheckboxes
              form={form}
              name="roles"
              label="Roles"
              options={roleOptions}
              optionLabelKey="label"
              optionValueKey="value"
            />

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
