import { NextResponse } from 'next/server';
import { listDeliveryStatusHistory } from '@/features/deliveries/repository';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const history = await listDeliveryStatusHistory(id);

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
