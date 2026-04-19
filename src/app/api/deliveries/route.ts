import { NextResponse } from 'next/server';
import {
  listDeliveries,
  createDelivery,
} from '@/features/deliveries/repository';

export async function GET() {
  try {
    const deliveries = await listDeliveries();

    return NextResponse.json(deliveries, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const delivery = await createDelivery({
      tracking_number: body.tracking_number,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      city: body.city,
      address_line1: body.address_line1,
      address_line2: body.address_line2,
      notes: body.notes,
      status: body.status,
      assigned_courier_id: body.assigned_courier_id,
      created_by: body.created_by,
    });

    return NextResponse.json(delivery, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
