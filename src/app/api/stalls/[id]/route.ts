import { NextRequest, NextResponse } from 'next/server';
import { stallSchema } from '@/lib/validations';

// GET /api/stalls/[id] - Get a specific stall
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // TODO: Replace with actual API call to backend
    // const response = await fetch(`${process.env.BACKEND_URL}/stalls/${id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     return NextResponse.json(
    //       { error: 'Stall not found' },
    //       { status: 404 }
    //     );
    //   }
    //   throw new Error('Failed to fetch stall');
    // }
    
    // const stall = await response.json();
    
    // Mock response for now
    const stall = {
      id,
      name: 'Central Mall Stall',
      code: 'CM001',
      deviceName: 'Device-001',
      location: [1.3521, 103.8198], // [lat, lng]
      umbrellaCount: 50,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(stall);
  } catch (error) {
    console.error('Error fetching stall:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stall' },
      { status: 500 }
    );
  }
}

// PATCH /api/stalls/[id] - Update a specific stall
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = stallSchema.partial().parse(body);
    
    // TODO: Replace with actual API call to backend
    // const response = await fetch(`${process.env.BACKEND_URL}/stalls/${id}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`, // Add auth token
    //   },
    //   body: JSON.stringify(validatedData),
    // });
    
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     return NextResponse.json(
    //       { error: 'Stall not found' },
    //       { status: 404 }
    //     );
    //   }
    //   throw new Error('Failed to update stall');
    // }
    
    // const updatedStall = await response.json();
    
    // Mock response for now
    const updatedStall = {
      id,
      name: 'Central Mall Stall',
      code: 'CM001',
      deviceName: 'Device-001',
      location: [1.3521, 103.8198], // [lat, lng]
      umbrellaCount: 50,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...validatedData,
    };

    return NextResponse.json(updatedStall);
  } catch (error) {
    if (error instanceof Error && error.message.includes('ZodError')) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    console.error('Error updating stall:', error);
    return NextResponse.json(
      { error: 'Failed to update stall' },
      { status: 500 }
    );
  }
}

// DELETE /api/stalls/[id] - Delete a specific stall
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // TODO: Replace with actual API call to backend
    // const response = await fetch(`${process.env.BACKEND_URL}/stalls/${id}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`, // Add auth token
    //   },
    // });
    
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     return NextResponse.json(
    //       { error: 'Stall not found' },
    //       { status: 404 }
    //     );
    //   }
    //   throw new Error('Failed to delete stall');
    // }
    
    // const result = await response.json();
    
    // Mock response for now
    const result = { message: 'Stall deleted successfully' };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting stall:', error);
    return NextResponse.json(
      { error: 'Failed to delete stall' },
      { status: 500 }
    );
  }
}
