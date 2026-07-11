import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Plus, Loader2, ServerCrash, Search, Eye, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../api/axiosInstance';

const getStatus = (expiryDate) => {
  if (!expiryDate) {
    return { text: 'No Expiry', color: 'bg-gray-100 text-gray-800' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (expiry < today) {
    return { text: 'Expired', color: 'bg-red-100 text-red-800' };
  }
  if (expiry <= thirtyDaysFromNow) {
    return { text: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' };
  }
  return { text: 'Good', color: 'bg-green-100 text-green-800' };
};

const ViewAllBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/batches');
        if (response.data?.success) {
          setBatches(response.data.batches);
        } else {
          throw new Error('Failed to fetch batches from the server.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An unknown error occurred.');
        console.error("Error fetching batches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const filteredBatches = useMemo(() =>
    batches.filter(batch =>
      (batch.chemical?.canonicalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (batch.supplier?.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [batches, searchTerm]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-[var(--color-text-secondary)]">
          <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold">Loading Stock Batches...</h3>
          <p>Please wait while we fetch the inventory data.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-danger)] bg-[var(--color-surface)] py-20 text-center text-[var(--color-danger)]">
          <ServerCrash size={40} />
          <h3 className="text-lg font-semibold">Failed to Load Batches</h3>
          <p className="max-w-md">{error}</p>
        </div>
      );
    }

    if (filteredBatches.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-20 text-center text-[var(--color-text-secondary)]">
          <Truck size={40} />
          <h3 className="text-lg font-semibold">No Batches Found</h3>
          <p>Your inventory is empty. Add a new stock batch to get started.</p>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr>
                <th scope="col" className="px-4 py-3.5 text-left font-semibold text-[var(--color-text-primary)]">Chemical</th>
                <th scope="col" className="px-4 py-3.5 text-left font-semibold text-[var(--color-text-primary)]">Batch No.</th>
                <th scope="col" className="px-4 py-3.5 text-left font-semibold text-[var(--color-text-primary)]">Quantity</th>
                <th scope="col" className="px-4 py-3.5 text-left font-semibold text-[var(--color-text-primary)]">Supplier</th>
                <th scope="col" className="px-4 py-3.5 text-left font-semibold text-[var(--color-text-primary)]">Received</th>
                <th scope="col" className="px-4 py-3.5 text-left font-semibold text-[var(--color-text-primary)]">Expires</th>
                <th scope="col" className="px-4 py-3.5 text-left font-semibold text-[var(--color-text-primary)]">Status</th>
                <th scope="col" className="relative px-4 py-3.5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredBatches.map(batch => {
                const status = getStatus(batch.expiryDate);
                return (
                  <tr key={batch.id} className="hover:bg-[var(--color-surface-muted)]">
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-[var(--color-text-primary)]">
                      <div className="font-bold">{batch.chemical?.canonicalName || 'N/A'}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{batch.chemical?.chemicalCode}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--color-text-secondary)]">{batch.batchNumber}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--color-text-secondary)]">
                      <span className="font-semibold text-[var(--color-text-primary)]">{parseFloat(batch.currentQuantity)}</span> / {parseFloat(batch.quantityReceived)} {batch.chemical?.baseUnit}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--color-text-secondary)]">{batch.supplier || 'N/A'}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--color-text-secondary)]">{format(new Date(batch.receivedDate), 'MMM dd, yyyy')}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--color-text-secondary)]">{batch.expiryDate ? format(new Date(batch.expiryDate), 'MMM dd, yyyy') : 'N/A'}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-text-primary)]">
                          <Eye size={16} />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-text-primary)]">
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
    <main
      className="
        min-h-screen
        px-4 py-5
        sm:px-6
        lg:px-8 lg:py-8
      "
    >
      <div className="mx-auto w-full max-w-7xl">
          {/* Page header */}
          <header className="mb-8 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-dark)] shadow-[var(--shadow-md)]">
            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[var(--color-primary-light)] opacity-30" />
              <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[var(--color-accent)] opacity-10" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-light)]">
                      <Truck size={14} />
                      Procurement & Stock
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-[var(--color-text-inverse)] sm:text-3xl lg:text-4xl">
                    All Stock Batches
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-inverse)] opacity-80 sm:text-base">
                    Browse and manage all individual chemical batches in the inventory.
                  </p>
                </div>
                <div className="shrink-0">
                  <Link
                    to="/stock/add"
                    className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-[var(--color-primary-dark)] shadow-[var(--shadow-sm)] color-transition hover:bg-[var(--color-accent-light)]"
                  >
                    <Plus size={18} />
                    Add New Batch
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Search and Filter Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by chemical, batch no, or supplier..."
                className="w-full max-w-lg rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-12 pr-4 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] color-transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-tint)]"
              />
            </div>
          </div>

          {/* Content Area */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ViewAllBatches;