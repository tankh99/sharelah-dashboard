"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stallSchema, type StallForm } from '@/lib/validations';
import { StallStatus } from '@/lib/enums';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/form/form-text-input';
import { FormSelect } from '@/components/form/form-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useCallback, useEffect } from 'react';
import { Form } from '../ui/form';
import GoogleMapReact from 'google-map-react';

interface StallFormProps {
  initialData?: Partial<StallForm>;
  onSubmit: (data: StallForm) => void;
  isLoading?: boolean;
}

// Default center (Singapore coordinates)
const DEFAULT_CENTER = { lat: 1.3521, lng: 103.8198 };
const DEFAULT_ZOOM = 13;

// Marker component for the map
const MapMarker = ({ lat: _lat, lng: _lng }: { lat: number; lng: number }) => (
  <div 
    className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
    style={{ left: 0, top: 0 }} // This ensures the marker is positioned correctly
  >
    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
);

export const StallFormComponent = ({ initialData, onSubmit, isLoading = false }: StallFormProps) => {
  const [coordinates, setCoordinates] = useState([
    initialData?.location?.[0] || DEFAULT_CENTER.lat,
    initialData?.location?.[1] || DEFAULT_CENTER.lng,
  ]);
  const [mapCenter, setMapCenter] = useState({
    lat: initialData?.location?.[0] || DEFAULT_CENTER.lat,
    lng: initialData?.location?.[1] || DEFAULT_CENTER.lng,
  });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const form = useForm<StallForm>({
    resolver: zodResolver(stallSchema) as any,
    defaultValues: {
      name: '',
      code: '',
      deviceName: '',
      location: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], // [lat, lng]
      umbrellaCount: 0,
      status: StallStatus.DRAFT,
      ...initialData,
    },
  });

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = [latitude, longitude];
          setCoordinates(newCoords);
          setMapCenter({ lat: latitude, lng: longitude });
          setZoom(15); // Zoom in closer for current location
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Unable to get your current location. Please select manually on the map.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocation is not supported by this browser. Please select manually on the map.');
    }
  }, []);

  // Handle map click to set coordinates
  const handleMapClick = useCallback(({ lat, lng }: { lat: number; lng: number }) => {
    setCoordinates([lat, lng]);
    setMapCenter({ lat, lng });
  }, []);

  // Handle map change (zoom, center)
  const handleMapChange = useCallback(({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) => {
    setMapCenter(center);
    setZoom(zoom);
  }, []);

  // Update form when coordinates change
  useEffect(() => {
    form.setValue('location', coordinates);
  }, [coordinates, form]);

  // Auto-get current location for new stalls
  useEffect(() => {
    // Only auto-get location if this is a new stall (no initialData or no location)
    if (!initialData?.location || (initialData.location[0] === 0 && initialData.location[1] === 0)) {
      getCurrentLocation();
    }
  }, [getCurrentLocation, initialData?.location]); // Include dependencies

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
        <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
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
              inputProps={{
                type: "number"
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Location Coordinates</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="text-xs"
              >
                {isGettingLocation ? 'Getting Location...' : '📍 Get Current Location'}
              </Button>
            </div>
            
            {/* Google Map */}
            <div className="w-full h-80 border border-gray-300 rounded-md overflow-hidden">
              <GoogleMapReact
                // bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' }}
                defaultCenter={DEFAULT_CENTER}
                center={mapCenter}
                defaultZoom={DEFAULT_ZOOM}
                zoom={zoom}
                onClick={handleMapClick}
                onChange={handleMapChange}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: false,
                }}
              >
                <MapMarker lat={coordinates[0]} lng={coordinates[1]} />
              </GoogleMapReact>
            </div>

            {/* Coordinate inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={coordinates[0]}
                  onChange={(e) => setCoordinates(prev => [parseFloat(e.target.value) || 0, prev[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Latitude"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={coordinates[1]}
                  onChange={(e) => setCoordinates(prev => [prev[0], parseFloat(e.target.value) || 0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Longitude"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Click on the map to set coordinates or use the &quot;Get Current Location&quot; button. 
              You can also manually enter coordinates below.
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
