import { NextResponse } from 'next/server';
import { updateDeliveryStatus } from '@/features/deliveries/repository';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const updatedDelivery = await updateDeliveryStatus({
      delivery_id: body.delivery_id,
      status: body.status,
      changed_by: body.changed_by,
      note: body.note,
    });

    return NextResponse.json(updatedDelivery, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
