"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stallSchema, type StallForm } from '@/lib/validations';
import { StallStatus } from '@/lib/enums';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/form/form-text-input';
import { FormSelect } from '@/components/form/form-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Form } from '../ui/form';

interface StallFormProps {
  initialData?: Partial<StallForm>;
  onSubmit: (data: StallForm) => void;
  isLoading?: boolean;
}

export const StallFormComponent = ({ initialData, onSubmit, isLoading = false }: StallFormProps) => {
  const [coordinates, setCoordinates] = useState({
    lat: initialData?.location?.lat || 0,
    lng: initialData?.location?.lng || 0,
  });

  const form = useForm<StallForm>({
    resolver: zodResolver(stallSchema),
    defaultValues: {
      name: '',
      code: '',
      deviceName: '',
      location: { lat: 0, lng: 0 },
      umbrellaCount: 0,
      status: StallStatus.DRAFT,
      ...initialData,
    },
  });

  const handleSubmit = (data: StallForm) => {
    // Update the form data with current coordinates
    const formData = {
      ...data,
      location: coordinates,
    };
    onSubmit(formData);
  };

  const statusOptions = Object.values(StallStatus).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stall Information</CardTitle>
        <CardDescription>Enter the stall details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormTextInput
              form={form}
              name="name"
              label="Stall Name"
              placeholder="Enter stall name"
            />
            
            <FormTextInput
              form={form}
              name="code"
              label="Stall Code"
              placeholder="Enter stall code"
            />
            
            <FormTextInput
              form={form}
              name="deviceName"
              label="Device Name"
              placeholder="Enter device name"
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
              name="umbrellaCount"
              label="Umbrella Count"
              placeholder="Enter umbrella count"
              type="number"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Location Coordinates</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={coordinates.lat}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Latitude"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={coordinates.lng}
                  onChange={(e) => setCoordinates(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Longitude"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Enter coordinates manually or integrate with Google Maps API for location picker
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Stall'}
            </Button>
          </div>
        </form>
        </Form>
      </CardContent>
    </Card>
  );
};
