import { NextRequest, NextResponse } from 'next/server';
import { stallSchema } from '@/lib/validations';

// GET /api/stalls - Get all stalls
export async function GET() {
  try {
    // TODO: Replace with actual API call to backend
    // const response = await fetch(`${process.env.BACKEND_URL}/stalls`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to fetch stalls');
    // }
    
    // const stalls = await response.json();
    
    // Mock response for now
    const stalls = [
      {
        id: '1',
        name: 'Central Mall Stall',
        code: 'CM001',
        deviceName: 'Device-001',
        location: [1.3521, 103.8198], // [lat, lng]
        umbrellaCount: 50,
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Orchard Road Kiosk',
        code: 'OR002',
        deviceName: 'Device-002',
        location: [1.3048, 103.8318], // [lat, lng]
        umbrellaCount: 30,
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json(stalls);
  } catch (error) {
    console.error('Error fetching stalls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stalls' },
      { status: 500 }
    );
  }
}

// POST /api/stalls - Create a new stall
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = stallSchema.parse(body);
    
    // TODO: Replace with actual API call to backend
    // const response = await fetch(`${process.env.BACKEND_URL}/stalls`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`, // Add auth token
    //   },
    //   body: JSON.stringify(validatedData),
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to create stall');
    // }
    
    // const newStall = await response.json();
    
    // Mock response for now
    const newStall = {
      id: Date.now().toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newStall, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('ZodError')) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    console.error('Error creating stall:', error);
    return NextResponse.json(
      { error: 'Failed to create stall' },
      { status: 500 }
    );
  }
}
