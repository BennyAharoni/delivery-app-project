import Link from 'next/link';
import {
  getDeliveryById,
  listDeliveryStatusHistory,
  formatStatus,
} from '@/features/deliveries/repository';

type DeliveryDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DeliveryDetailsPage(
  props: DeliveryDetailsPageProps,
) {
  const params = await props.params;
  const delivery = await getDeliveryById(params.id);

  if (!delivery) {
    return (
      <main style={{ padding: '24px' }}>
        <h1>Delivery not found</h1>
        <Link href='/'>Back to deliveries</Link>
      </main>
    );
  }

  const history = await listDeliveryStatusHistory(delivery.id);

  return (
    <main style={{ padding: '24px' }}>
      <h1>Delivery Details</h1>

      <p>
        <Link href='/'>← Back to deliveries</Link>
      </p>

      <section style={{ marginTop: '24px' }}>
        <h2>Delivery Info</h2>
        <table
          style={{
            borderCollapse: 'collapse',
            marginTop: '12px',
            minWidth: '500px',
          }}
        >
          <tbody>
            <tr>
              <td style={labelStyle}>Tracking Number</td>
              <td style={valueStyle}>{delivery.tracking_number}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Customer Name</td>
              <td style={valueStyle}>{delivery.customer_name}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Customer Phone</td>
              <td style={valueStyle}>{delivery.customer_phone}</td>
            </tr>
            <tr>
              <td style={labelStyle}>City</td>
              <td style={valueStyle}>{delivery.city}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Address Line 1</td>
              <td style={valueStyle}>{delivery.address_line1}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Address Line 2</td>
              <td style={valueStyle}>{delivery.address_line2 ?? '-'}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Notes</td>
              <td style={valueStyle}>{delivery.notes ?? '-'}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Status</td>
              <td style={valueStyle}>{formatStatus(delivery.status)}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Created At</td>
              <td style={valueStyle}>{delivery.created_at ?? '-'}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Updated At</td>
              <td style={valueStyle}>{delivery.updated_at ?? '-'}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: '32px' }}>
        <h2>Status History</h2>

        {history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '12px',
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Note</th>
                <th style={headerStyle}>Changed By</th>
                <th style={headerStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td style={valueStyle}>{formatStatus(item.status)}</td>
                  <td style={valueStyle}>{item.note ?? '-'}</td>
                  <td style={valueStyle}>{item.changed_by ?? '-'}</td>
                  <td style={valueStyle}>{item.created_at ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
  width: '180px',
};

const valueStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
};

const headerStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f5f5f5',
};
