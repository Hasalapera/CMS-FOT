import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  ServerCrash,
  ArrowLeft,
  FlaskConical,
  Beaker,
  ShieldAlert,
  FileText,
  Download,
  Pencil,
  Trash2,
  Tag,
} from 'lucide-react';
import api from '../../api/axiosInstance';
import EditChemicalModal from '../../components/chemicals/EditChemicalModal';
import DeleteConfirmationModal from '../../components/Common/DeleteConfirmationModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DetailItem = ({ label, value, children }) => {
  if (!value && !children) {
    return null;
  }
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)] sm:col-span-2 sm:mt-0">
        {children || value || <span className="text-[var(--color-text-muted)]">N/A</span>}
      </dd>
    </div>
  );
};

const ChemicalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chemical, setChemical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleteProcessing, setIsDeleteProcessing] = useState(false);

  useEffect(() => {
    const fetchChemical = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/chemicals/${id}`);
        if (response.data?.success) {
          setChemical(response.data.chemical);
        } else {
          throw new Error('Failed to fetch chemical details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Could not find the requested chemical.');
        console.error("Error fetching chemical:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChemical();
  }, [id]);

  const handleUpdateSuccess = (updatedChemical) => {
    setChemical(updatedChemical);
    setIsEditing(false);
  };

  const handleDeleteRequest = async () => {
    setIsDeleteProcessing(true);
    setError(null);
    try {
      await api.delete(`/chemicals/${id}`);
      // Navigate back to the list after successful deactivation.
      // A toast notification could be added here for better UX.
      navigate('/chemicals/list');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate the chemical.');
      // Close the confirmation modal on error to show the page error
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleteProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] text-center text-[var(--color-text-secondary)]">
        <Loader2 size={48} className="animate-spin text-[var(--color-primary)]" />
        <h3 className="text-xl font-semibold">Loading Chemical Details...</h3>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] text-center text-[var(--color-danger)]">
        <ServerCrash size={48} />
        <h3 className="text-xl font-semibold">Failed to Load Data</h3>
        <p className="max-w-md">{error}</p>
        <button
          onClick={() => navigate('/chemicals/list')}
          className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-text-inverse)]"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </button>
      </div>
    );
  }

  if (!chemical) return null;

  const sdsUrl = chemical.sdsStorageKey ? `${API_BASE_URL}/uploads/sds/${chemical.sdsStorageKey}` : null;

  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* Page header */}
            <header className="mb-6 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-dark)] shadow-[var(--shadow-md)]">
              <div className="relative p-5 sm:p-7 lg:p-8">
                <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[var(--color-primary-light)] opacity-30" />
                <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[var(--color-accent)] opacity-10" />

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => navigate('/chemicals/list')}
                    className="mb-5 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-primary-light)] bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-[var(--color-text-inverse)] color-transition hover:bg-[var(--color-primary-light)]"
                  >
                    <ArrowLeft size={17} />
                    Back to List
                  </button>

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-light)]">
                          <FlaskConical size={14} />
                          Chemical Details
                        </span>
                      </div>
                      <h1 className="text-2xl font-extrabold text-[var(--color-text-inverse)] sm:text-3xl lg:text-4xl">
                        {chemical.canonicalName}
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-inverse)] opacity-80 sm:text-base">
                        Viewing the master record for chemical code:{" "}
                        <strong className="font-bold text-[var(--color-accent-light)]">{chemical.chemicalCode}</strong>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--color-danger)] color-transition hover:bg-[var(--color-danger)] hover:text-[var(--color-text-inverse)]"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary-dark)] shadow-[var(--shadow-sm)] color-transition hover:bg-[var(--color-accent-light)]"
                      >
                        <Pencil size={16} />
                        Edit Chemical
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                  <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                    <Beaker size={20} className="text-[var(--color-primary)]" />
                    <h2 className="text-base font-bold text-[var(--color-text-primary)]">Chemical Identity</h2>
                  </header>
                  <div className="px-4 sm:px-5">
                    <dl className="divide-y divide-[var(--color-border)]">
                      <DetailItem label="Canonical Name" value={chemical.canonicalName} />
                      <DetailItem label="CAS Number" value={chemical.casNumber} />
                      <DetailItem label="Chemical Formula" value={chemical.formula} />
                      <DetailItem label="Synonyms">
                        {chemical.synonyms?.length > 0 ? (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {chemical.synonyms.map((syn, index) => (
                              <span key={index} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                                <Tag size={12} />
                                {syn}
                              </span>
                            ))}
                          </div>
                        ) : <span className="text-[var(--color-text-muted)]">No synonyms listed</span>}
                      </DetailItem>
                    </dl>
                  </div>
                </section>

                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                  <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                    <ShieldAlert size={20} className="text-[var(--color-warning)]" />
                    <h2 className="text-base font-bold text-[var(--color-text-primary)]">Safety Summary</h2>
                  </header>
                  <div className="p-4 sm:p-5">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {chemical.safetySummary || "No summary provided. Always refer to the official SDS."}
                    </p>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                  <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                    <FlaskConical size={20} className="text-[var(--color-primary)]" />
                    <h2 className="text-base font-bold text-[var(--color-text-primary)]">Properties & Stock</h2>
                  </header>
                  <div className="px-4 sm:px-5">
                    <dl className="divide-y divide-[var(--color-border)]">
                      <DetailItem label="Physical State" value={chemical.physicalState} />
                      <DetailItem label="Stock Dimension" value={chemical.stockDimension} />
                      <DetailItem label="Base Unit" value={chemical.baseUnit} />
                      <DetailItem label="Density" value={chemical.densityValue ? `${chemical.densityValue} ${chemical.densityUnit}` : null} />
                    </dl>
                  </div>
                </section>

                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                  <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                    <FileText size={20} className="text-[var(--color-info)]" />
                    <h2 className="text-base font-bold text-[var(--color-text-primary)]">SDS Document</h2>
                  </header>
                  <div className="p-4 sm:p-5">
                    {sdsUrl ? (
                      <div>
                        <a href={sdsUrl} download={chemical.sdsOriginalFilename} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-primary)] bg-[var(--color-primary-tint)] px-4 py-3 text-sm font-bold text-[var(--color-primary)] color-transition hover:bg-[var(--color-primary)] hover:text-[var(--color-text-inverse)]">
                          <Download size={18} />
                          Download SDS ({ (chemical.sdsFileSize / 1024 / 1024).toFixed(2) } MB)
                        </a>
                        <p className="mt-2 truncate text-center text-xs text-[var(--color-text-muted)]">{chemical.sdsOriginalFilename}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-center text-[var(--color-text-muted)]">
                        <FileText size={32} />
                        <p className="text-sm font-semibold">No SDS on file</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
      {isEditing && <EditChemicalModal chemical={chemical} onClose={() => setIsEditing(false)} onSuccess={handleUpdateSuccess} />}
      <DeleteConfirmationModal
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={handleDeleteRequest}
        isProcessing={isDeleteProcessing}
        title="Deactivate Chemical"
        message={`Are you sure you want to deactivate "${chemical.canonicalName}"? This action will hide it from the main inventory list but will not remove historical data.`}
        confirmText="Yes, Deactivate"
      />
    </>
  );
};

export default ChemicalDetails;