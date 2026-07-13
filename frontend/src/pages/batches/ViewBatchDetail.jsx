import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Loader2,
  ServerCrash,
  ArrowLeft,
  Truck,
  FlaskConical,
  Box,
  Calendar,
  Scale,
  MapPin,
  Info,
  ChevronRight,
  QrCode,
  Printer,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DetailItem = ({ label, value, children, icon: Icon }) => {
  if (!value && !children) {
    return null;
  }
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
        {Icon && <Icon size={16} className="shrink-0" />}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-[var(--color-text-primary)] sm:col-span-2 sm:mt-0">
        {children || value || <span className="text-[var(--color-text-muted)]">N/A</span>}
      </dd>
    </div>
  );
};

const getStatus = (expiryDate) => {
  if (!expiryDate) {
    return { text: 'No Expiry', color: 'bg-gray-100 text-gray-800 border-gray-300' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (expiry < today) {
    return { text: 'Expired', color: 'bg-red-100 text-red-800 border-red-400' };
  }
  if (expiry <= thirtyDaysFromNow) {
    return { text: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800 border-yellow-400' };
  }
  return { text: 'Good', color: 'bg-green-100 text-green-800 border-green-400' };
};

const ViewBatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { user } = useAuth();
  const canViewQrCode = user && (user.role === 'ADMIN' || user.role === 'TECHNICAL_OFFICER');

  const handlePrint = () => {
    const printContent = document.getElementById('qr-print-area')?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print QR Code</title>');
    printWindow.document.write(`
      <style>
        body { font-family: sans-serif; text-align: center; padding: 20px; }
        h1 { font-size: 16px; margin: 0 0 5px 0; }
        p { font-size: 12px; margin: 0 0 15px 0; }
        svg { width: 150px; height: 150px; }
      </style>
    `);
    printWindow.document.write('</head><body>' + printContent + '</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  const handleDownloadPdf = async () => {
    const qrElement = document.getElementById('qr-print-area');
    if (!qrElement) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(qrElement, {
        scale: 3, // Higher scale for better resolution
        useCORS: true,
        backgroundColor: '#ffffff', // Explicitly set background to white
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Using a common label size, e.g., 2.25 x 1.25 inches -> ~57x32 mm
      const pdfWidth = 57;
      const pdfHeight = 32;
      const pdf = new jsPDF({
        orientation: 'landscape', // Label is wider than tall
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      // Center the image inside the PDF, maintaining aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const pdfAspectRatio = pdfWidth / pdfHeight;
      const imgAspectRatio = imgProps.width / imgProps.height;

      let finalImgWidth = pdfWidth;
      let finalImgHeight = pdfWidth / imgAspectRatio;
      if (finalImgHeight > pdfHeight) {
        finalImgHeight = pdfHeight;
        finalImgWidth = finalImgHeight * imgAspectRatio;
      }
      const x = (pdfWidth - finalImgWidth) / 2;
      const y = (pdfHeight - finalImgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
      pdf.save(`QR-Label-${batch.chemical?.chemicalCode || 'CHEM'}-${batch.batchNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/batches/${id}`);
        if (response.data?.success) {
          setBatch(response.data.batch);
        } else {
          throw new Error('Failed to fetch batch details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Could not find the requested batch.');
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] text-center text-[var(--color-text-secondary)]">
        <Loader2 size={48} className="animate-spin text-[var(--color-primary)]" />
        <h3 className="text-xl font-semibold">Loading Batch Details...</h3>
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
          onClick={() => navigate('/stock/batches')}
          className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-text-inverse)]"
        >
          <ArrowLeft size={18} />
          Back to All Batches
        </button>
      </div>
    );
  }

  if (!batch) return null;

  const status = getStatus(batch.expiryDate);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-6 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-dark)] shadow-[var(--shadow-md)]">
            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[var(--color-primary-light)] opacity-30" />
              <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[var(--color-accent)] opacity-10" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => navigate('/stock/batches')}
                  className="mb-5 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-primary-light)] bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-[var(--color-text-inverse)] color-transition hover:bg-[var(--color-primary-light)]"
                >
                  <ArrowLeft size={17} />
                  Back to List
                </button>
                <div className="max-w-3xl">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-light)]">
                      <Truck size={14} />
                      Batch Details
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-[var(--color-text-inverse)] sm:text-3xl lg:text-4xl">
                    {batch.chemical?.canonicalName || 'N/A'}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-inverse)] opacity-80 sm:text-base">
                    Viewing details for batch number:{" "}
                    <strong className="font-bold text-[var(--color-accent-light)]">{batch.batchNumber}</strong>
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                  <Info size={20} className="text-[var(--color-primary)]" />
                  <h2 className="text-base font-bold text-[var(--color-text-primary)]">Batch Information</h2>
                </header>
                <div className="px-4 sm:px-5">
                  <dl className="divide-y divide-[var(--color-border)]">
                    <DetailItem label="Chemical" icon={FlaskConical}>
                      <Link to={`/chemicals/${batch.chemical.id}`} className="text-[var(--color-primary)] hover:underline">
                        {batch.chemical.canonicalName} ({batch.chemical.chemicalCode})
                      </Link>
                    </DetailItem>
                    <DetailItem label="Supplier" value={batch.supplier} icon={Truck} />
                    <DetailItem label="Batch Number" value={batch.batchNumber} icon={Box} />
                    <DetailItem label="Received Date" value={format(new Date(batch.receivedDate), 'MMMM dd, yyyy')} icon={Calendar} />
                    <DetailItem label="Expiry Date" value={batch.expiryDate ? format(new Date(batch.expiryDate), 'MMMM dd, yyyy') : 'N/A'} icon={Calendar} />
                  </dl>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                  <Scale size={20} className="text-[var(--color-primary)]" />
                  <h2 className="text-base font-bold text-[var(--color-text-primary)]">Quantity & Status</h2>
                </header>
                <div className="px-4 sm:p-5">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">Current Status</p>
                    <span className={`mt-1 inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <dl className="divide-y divide-[var(--color-border)]">
                    <DetailItem label="Quantity Received">
                      {`${parseFloat(batch.quantityReceived)} ${batch.chemical?.baseUnit}`}
                    </DetailItem>
                    <DetailItem label="Current Quantity">
                      {`${parseFloat(batch.currentQuantity)} ${batch.chemical?.baseUnit}`}
                    </DetailItem>
                  </dl>
                </div>
              </section>

              {canViewQrCode && (
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                  <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                    <QrCode size={20} className="text-[var(--color-primary)]" />
                    <h2 className="text-base font-bold text-[var(--color-text-primary)]">QR Code & Label</h2>
                  </header>
                  <div className="p-4 sm:p-5 text-center">
                    <div id="qr-print-area" className="inline-block rounded-md border border-[var(--color-border)] bg-white p-4">
                      <QRCodeSVG value={window.location.href} size={150} includeMargin={true} />
                      <h1 className="mt-3 font-bold text-[var(--color-text-primary)]">{batch.chemical?.canonicalName}</h1>
                      <p className="text-sm text-[var(--color-text-secondary)]">Batch: {batch.batchNumber}</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <button onClick={handlePrint} className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] color-transition hover:bg-[var(--color-surface-muted)] sm:w-auto">
                          <Printer size={16} /> Print Label
                      </button>
                      <button 
                          onClick={handleDownloadPdf} 
                          disabled={isDownloading}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white color-transition hover:bg-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                      >
                          {isDownloading ? (
                              <Loader2 size={16} className="animate-spin" />
                          ) : (
                              <Download size={16} />
                          )}
                          {isDownloading ? 'Downloading...' : 'Download PDF'}
                      </button>
                    </div>
                  </div>
                </section>
              )}

              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                <header className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
                  <MapPin size={20} className="text-[var(--color-primary)]" />
                  <h2 className="text-base font-bold text-[var(--color-text-primary)]">Storage Location</h2>
                </header>
                <div className="p-4 sm:p-5">
                  {batch.location?.path && batch.location.path.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
                      {batch.location.path.map((loc, index) => (
                        <React.Fragment key={loc.id}>
                          {index > 0 && <ChevronRight size={16} className="shrink-0 text-[var(--color-text-muted)]" />}
                          <Link to={`/locations/${loc.id}`} className="text-[var(--color-primary)] hover:underline">
                            {loc.name}
                          </Link>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : batch.location ? (
                    <Link to={`/locations/${batch.location.id}`} className="text-[var(--color-primary)] hover:underline font-semibold">{batch.location.name}</Link>
                  ) : (
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">No location assigned</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewBatchDetail;