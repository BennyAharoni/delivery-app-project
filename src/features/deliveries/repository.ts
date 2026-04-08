import { createSupabaseServerClient } from '@/lib/supabase/server';

export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export type Delivery = {
  id: string;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  city: string;
  address_line1: string;
  address_line2: string | null;
  notes: string | null;
  status: DeliveryStatus;
  assigned_courier_id: string | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
};

export type CreateDeliveryInput = {
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  city: string;
  address_line1: string;
  address_line2?: string;
  notes?: string;
  status: DeliveryStatus;
  assigned_courier_id?: string;
  created_by: string;
};

export type DeliveryStatusHistory = {
  id: string;
  delivery_id: string;
  status: DeliveryStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string | null;
};

export async function createDeliveryStatusHistory(input: {
  delivery_id: string;
  status: DeliveryStatus;
  changed_by?: string;
  note?: string;
}): Promise<DeliveryStatusHistory> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('delivery_status_history')
    .insert({
      delivery_id: input.delivery_id,
      status: input.status,
      changed_by: input.changed_by ?? null,
      note: input.note ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create delivery status history: ${error.message}`,
    );
  }

  return data as DeliveryStatusHistory;
}

export async function listDeliveries(): Promise<Delivery[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list deliveries: ${error.message}`);
  }

  return (data ?? []) as Delivery[];
}

export async function createDelivery(
  input: CreateDeliveryInput,
): Promise<Delivery> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('deliveries')
    .insert({
      tracking_number: input.tracking_number,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      city: input.city,
      address_line1: input.address_line1,
      address_line2: input.address_line2 ?? null,
      notes: input.notes ?? null,
      status: input.status,
      assigned_courier_id: input.assigned_courier_id ?? null,
      created_by: input.created_by,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create delivery: ${error.message}`);
  }

  const delivery = data as Delivery;

  await createDeliveryStatusHistory({
    delivery_id: delivery.id,
    status: delivery.status,
    changed_by: input.created_by,
    note: 'Delivery created',
  });

  return delivery;
}

export async function getDeliveryById(id: string): Promise<Delivery | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // אם לא נמצא — נחזיר null
    if (error.code === 'PGRST116') {
      return null;
    }

    throw new Error(`Failed to get delivery: ${error.message}`);
  }

  return data as Delivery;
}

export async function listDeliveryStatusHistory(
  deliveryId: string,
): Promise<DeliveryStatusHistory[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('delivery_status_history')
    .select('*')
    .eq('delivery_id', deliveryId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to list delivery status history: ${error.message}`);
  }

  return (data ?? []) as DeliveryStatusHistory[];
}
