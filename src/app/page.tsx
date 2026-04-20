import Link from 'next/link';
import { listDeliveries, formatStatus } from '@/features/deliveries/repository';

export default async function Home() {
  const deliveries = await listDeliveries();

  return (
    <main style={{ padding: '24px' }}>
      <h1>Delivery App</h1>
      <h2>All Deliveries</h2>

      {deliveries.length === 0 ? (
        <p>No deliveries found.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '16px',
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>Tracking</th>
              <th style={cellStyle}>Customer</th>
              <th style={cellStyle}>City</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Details</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td style={cellStyle}>{delivery.tracking_number}</td>
                <td style={cellStyle}>{delivery.customer_name}</td>
                <td style={cellStyle}>{delivery.city}</td>
                <td style={cellStyle}>{formatStatus(delivery.status)}</td>
                <td style={cellStyle}>
                  <Link href={`/deliveries/${delivery.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const cellStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
};
