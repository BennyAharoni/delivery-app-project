import {
  DeliveryStatusHistory,
  listDeliveries,
  listDeliveryStatusHistory,
  updateDeliveryStatus,
} from '@/features/deliveries/repository';
import { getFirstProfile } from '@/features/profiles/repository';

export default async function Home() {
  const profile = await getFirstProfile();
  const deliveries = await listDeliveries();

  let updatedDelivery = null;
  let history: DeliveryStatusHistory[] = [];
  let errorMessage: string | null = null;

  if (
    profile &&
    deliveries.length > 0 /*&& deliveries[0].status === 'assigned'*/
  ) {
    try {
      updatedDelivery = await updateDeliveryStatus({
        delivery_id: deliveries[0].id,
        status: 'delivered',
        changed_by: profile.id,
        note: 'Package picked up by courier',
      });
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
    }
  }

  const updatedDeliveries = await listDeliveries();

  if (updatedDeliveries.length > 0) {
    history = await listDeliveryStatusHistory(updatedDeliveries[0].id);
  }

  return (
    <main>
      <h1>Delivery App</h1>

      <h2>Error</h2>
      <pre>{JSON.stringify(errorMessage, null, 2)}</pre>

      <h2>Updated Delivery</h2>
      <pre>{JSON.stringify(updatedDelivery, null, 2)}</pre>

      <h2>All Deliveries</h2>
      <pre>{JSON.stringify(updatedDeliveries, null, 2)}</pre>

      <h2>Delivery Status History</h2>
      <pre>{JSON.stringify(history, null, 2)}</pre>
    </main>
  );
}
