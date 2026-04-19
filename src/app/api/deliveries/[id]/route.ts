import { NextResponse } from 'next/server';
import { getDeliveryById } from '@/features/deliveries/repository';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const delivery = await getDeliveryById(id);

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(delivery, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
