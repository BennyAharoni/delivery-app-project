import {
  createDelivery,
  listDeliveries,
  listDeliveryStatusHistory,
} from '@/features/deliveries/repository';
import { getFirstProfile } from '@/features/profiles/repository';
import { DeliveryStatusHistory } from '@/features/deliveries/repository';

export default async function Home() {
  const profile = await getFirstProfile();
  const deliveries = await listDeliveries();

  let createdDelivery = null;

  if (profile && deliveries.length === 0) {
    createdDelivery = await createDelivery({
      tracking_number: 'TRK-1002',
      customer_name: 'David Cohen',
      customer_phone: '0501234567',
      city: 'Petah Tikva',
      address_line1: 'HaRav Kook 10',
      address_line2: 'Apt 4',
      notes: 'Call before arrival',
      status: 'pending',
      created_by: profile.id,
    });
  }

  const updatedDeliveries = await listDeliveries();

  let history: DeliveryStatusHistory[] = [];

  if (updatedDeliveries.length > 0) {
    history = await listDeliveryStatusHistory(updatedDeliveries[0].id);
  }

  return (
    <main>
      <h1>Delivery App</h1>

      <h2>Created Delivery</h2>
      <pre>{JSON.stringify(createdDelivery, null, 2)}</pre>

      <h2>All Deliveries</h2>
      <pre>{JSON.stringify(updatedDeliveries, null, 2)}</pre>

      <h2>Delivery Status History</h2>
      <pre>{JSON.stringify(history, null, 2)}</pre>
    </main>
  );
}
