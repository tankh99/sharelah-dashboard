"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, type TransactionForm } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/form/form-text-input';
import { FormSelect } from '@/components/form/form-select';
import { FormDatePicker } from '@/components/form/form-date-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '../ui/form';

interface TransactionFormProps {
  initialData?: Partial<TransactionForm>;
  onSubmit: (data: TransactionForm) => void;
  isLoading?: boolean;
  users?: Array<{ id: string; name: string }>;
  stalls?: Array<{ id: string; name: string }>;
}

export const TransactionFormComponent = ({ 
  initialData, 
  onSubmit, 
  isLoading = false,
  users = [],
  stalls = []
}: TransactionFormProps) => {
  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      user: null,
      stall: null,
      amount: 0,
      borrowDate: null,
      returnDate: null,
      ...initialData,
    },
  });

  const handleSubmit = (data: TransactionForm) => {
    onSubmit(data);
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const stallOptions = stalls.map(stall => ({
    value: stall.id,
    label: stall.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Information</CardTitle>
        <CardDescription>Enter the transaction details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              form={form}
              name="user"
              label="User"
              options={userOptions}
              optionLabelKey="label"
              optionValueKey="value"
              placeholder="Select a user"
            />
            
            <FormSelect
              form={form}
              name="stall"
              label="Stall"
              options={stallOptions}
              optionLabelKey="label"
              optionValueKey="value"
              placeholder="Select a stall"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormTextInput
              form={form}
              name="amount"
              label="Amount"
              placeholder="Enter amount"
              type="number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDatePicker
              form={form}
              name="borrowDate"
              label="Borrow Date"
            />
            
            <FormDatePicker
              form={form}
              name="returnDate"
              label="Return Date"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
        </Form>
      </CardContent>
    </Card>
  );
};
