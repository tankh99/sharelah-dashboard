"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promoCodeSchema, type PromoCodeForm } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/form/form-text-input';
import { FormSelect } from '@/components/form/form-select';
import { FormDatePicker } from '@/components/form/form-date-picker';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '../ui/form';
import { PromoCodeType } from '@/lib/enums';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface PromoCodeFormProps {
  initialData?: Partial<PromoCodeForm>;
  onSubmit: (data: PromoCodeForm) => void;
  isLoading?: boolean;
}

export const PromoCodeFormComponent = ({ initialData, onSubmit, isLoading = false }: PromoCodeFormProps) => {
  const form = useForm<PromoCodeForm>({
    resolver: zodResolver(promoCodeSchema) as any,
    defaultValues: {
      code: '',
      type: PromoCodeType.SIGNUP_DISCOUNT,
      value: 0,
      maxUses: 100,
      isActive: true,
      minPurchase: 0,
      ...initialData,
      expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt) : (initialData?.expiresAt === null ? null : new Date()),
    },
  });

  const [neverExpires, setNeverExpires] = useState(form.getValues('expiresAt') === null);

  const handleNeverExpiresChange = (checked: boolean) => {
    setNeverExpires(checked);
    if (checked) {
      form.setValue('expiresAt', null);
    } else {
      form.setValue('expiresAt', new Date());
    }
  };

  const handleSubmit = (data: PromoCodeForm) => {
    onSubmit(data);
  };

  const typeOptions = Object.values(PromoCodeType).map((type) => ({
    value: type,
    label: type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promo Code Information</CardTitle>
        <CardDescription>Enter the promo code details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextInput
                form={form}
                name="code"
                label="Code"
                placeholder="e.g., FREESIGNUP"
              />
              
              <FormSelect
                form={form}
                name="type"
                label="Type"
                options={typeOptions}
                optionLabelKey="label"
                optionValueKey="value"
              />

              <FormTextInput
                form={form}
                name="value"
                label="Value"
                type="number"
                placeholder="e.g., 10"
              />

              <FormTextInput
                form={form}
                name="maxUses"
                label="Max Uses"
                type="number"
                placeholder="e.g., 100"
              />
              
              <FormDatePicker
                form={form}
                name="expiresAt"
                label="Expires At"
                calendarProps={{
                  disabled: neverExpires
                }}
              />

              <div className="flex items-center space-x-2 self-end pb-1">
                <Checkbox
                  id="neverExpires"
                  checked={neverExpires}
                  onCheckedChange={handleNeverExpiresChange}
                />
                <Label htmlFor="neverExpires">Never expires</Label>
              </div>
              
              <FormTextInput
                form={form}
                name="minPurchase"
                label="Minimum Purchase"
                type="number"
                placeholder="e.g., 0"
              />
              
              <FormCheckbox
                form={form}
                name="isActive"
                label="Is Active"
              />
              
            </div>

    
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Promo Code'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 