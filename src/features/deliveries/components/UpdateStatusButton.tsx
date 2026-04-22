'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  allowedStatusTransitions,
  DeliveryStatus,
} from '@/features/deliveries/repository';

type Props = {
  deliveryId: string;
  currentStatus: DeliveryStatus;
  profileId: string;
};

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function UpdateStatusButton({
  deliveryId,
  currentStatus,
  profileId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStatuses = useMemo(
    () => allowedStatusTransitions[currentStatus] ?? [],
    [currentStatus],
  );

  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | ''>(
    nextStatuses[0] ?? '',
  );

  const router = useRouter();

  async function handleUpdate() {
    if (!selectedStatus) {
      setError('Please select a status');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/deliveries/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delivery_id: deliveryId,
          status: selectedStatus,
          changed_by: profileId,
          note: `Updated from UI to ${selectedStatus}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      //   window.location.reload();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (nextStatuses.length === 0) {
    return (
      <div style={{ marginTop: '16px' }}>
        <p style={{ color: '#666' }}>
          No further status updates are available.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        maxWidth: '420px',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Update Status</h3>

      <p>
        <strong>Current Status:</strong> {formatStatus(currentStatus)}
      </p>

      <label
        htmlFor='status-select'
        style={{ display: 'block', marginBottom: '8px' }}
      >
        Next Status
      </label>

      <select
        id='status-select'
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as DeliveryStatus)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '12px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          backgroundColor: 'white',
        }}
      >
        {nextStatuses.map((status) => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading || !selectedStatus}
        style={{
          padding: '10px 16px',
          backgroundColor: '#111827',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Updating...' : 'Update Status'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
    </div>
  );
}
