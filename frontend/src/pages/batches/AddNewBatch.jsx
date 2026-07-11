import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Beaker,
  Box,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Hash,
  Info,
  Loader2,
  MapPin,
  RotateCcw,
  Save,
  Truck,
} from "lucide-react";
import api from "../../api/axiosInstance";

const INITIAL_FORM = {
  chemicalId: "",
  supplier: "",
  batchNumber: "",
  quantityReceived: "",
  expiryDate: "",
  receivedDate: new Date().toISOString().split("T")[0], // Default to today
  locationId: "",
};

const InputLabel = ({ children, required = false, description, htmlFor }) => (
  <div className="mb-2">
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary)]"
    >
      {children}
      {required && <span className="text-[var(--color-danger)]">*</span>}
    </label>
    {description && (
      <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
        {description}
      </p>
    )}
  </div>
);

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[var(--color-danger)]">
      <AlertTriangle size={14} />
      {message}
    </p>
  );
};

const AddNewBatch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const [chemicals, setChemicals] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const buildLocationPaths = (locations) => {
        const locationMap = new Map(locations.map(loc => [loc.id, loc]));
        
        const getPath = (locationId) => {
            const path = [];
            let currentLoc = locationMap.get(locationId);
            while (currentLoc) {
              path.unshift(currentLoc.name);
              currentLoc = locationMap.get(currentLoc.parentLocationId);
            }
            return path.join(' > ');
        };

        return locations.map(loc => ({
            ...loc,
            pathName: getPath(loc.id),
        })).sort((a, b) => a.pathName.localeCompare(b.pathName));
      };

      try {
        setIsLoading(true);
        const [chemicalsRes, locationsRes] = await Promise.all([
          api.get("/chemicals"),
          api.get("/locations"),
        ]);

        if (chemicalsRes.data?.success) {
          setChemicals(chemicalsRes.data.chemicals);
        }
        if (locationsRes.data?.success) {
          const processedLocations = buildLocationPaths(locationsRes.data.locations);
          setLocations(processedLocations);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setSubmitMessage({
          type: "error",
          text: "Could not load required data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedChemical = useMemo(
    () => chemicals.find((c) => c.id === formData.chemicalId),
    [formData.chemicalId, chemicals]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitMessage(null);
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.chemicalId) nextErrors.chemicalId = "Please select a chemical.";
    if (!formData.batchNumber.trim()) nextErrors.batchNumber = "Batch number is required.";
    if (!formData.quantityReceived) {
      nextErrors.quantityReceived = "Received quantity is required.";
    } else if (Number(formData.quantityReceived) <= 0) {
      nextErrors.quantityReceived = "Quantity must be greater than zero.";
    }
    if (!formData.receivedDate) nextErrors.receivedDate = "Received date is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSubmitMessage({
        type: "error",
        text: "Please correct the highlighted fields.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      const payload = {
        ...formData,
        quantityReceived: Number(formData.quantityReceived),
        currentQuantity: Number(formData.quantityReceived), // Initially, current quantity is the received quantity
        expiryDate: formData.expiryDate || null,
        locationId: formData.locationId || null,
      };

      // You will need to create this endpoint in your backend
      const response = await api.post("/batches", payload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to add new batch.");
      }

      setSubmitMessage({
        type: "success",
        text: "New stock batch added successfully!",
      });

      setTimeout(() => {
        navigate("/stock/batches"); // Redirect to the list of all batches
      }, 2000);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setSubmitMessage(null);
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
          <header className="mb-6 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-dark)] shadow-[var(--shadow-md)]">
            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[var(--color-primary-light)] opacity-30" />
              <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[var(--color-accent)] opacity-10" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mb-5 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-primary-light)] bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-[var(--color-text-inverse)] color-transition hover:bg-[var(--color-primary-light)]"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>
                <div className="max-w-3xl">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-light)]">
                      <Truck size={14} />
                      Procurement & Stock
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-[var(--color-text-inverse)] sm:text-3xl lg:text-4xl">
                    Add New Stock Batch
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-inverse)] opacity-80 sm:text-base">
                    Register a new batch of a chemical received from a supplier. This will add a new physical stock unit to the inventory.
                  </p>
                </div>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Chemical Selection */}
                  <div className="md:col-span-2">
                    <InputLabel htmlFor="chemicalId" required description="Select the chemical this batch belongs to.">
                      Chemical
                    </InputLabel>
                    <div className="relative">
                      <Beaker size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <select
                        id="chemicalId"
                        name="chemicalId"
                        value={formData.chemicalId}
                        onChange={handleChange}
                        disabled={isLoading || chemicals.length === 0}
                        className={`w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--color-surface)] py-3 pl-12 pr-10 text-sm font-medium text-[var(--color-text-primary)] color-transition disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] ${
                          errors.chemicalId ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                        }`}
                      >
                        <option value="" disabled>
                          {isLoading ? "Loading chemicals..." : "Select a chemical"}
                        </option>
                        {chemicals.map((chem) => (
                          <option key={chem.id} value={chem.id}>
                            {chem.canonicalName} ({chem.chemicalCode})
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    </div>
                    <ErrorMessage message={errors.chemicalId} />
                  </div>

                  {/* Supplier */}
                  <div>
                    <InputLabel htmlFor="supplier" description="Name of the company or person who supplied this batch.">
                      Supplier
                    </InputLabel>
                    <div className="relative">
                      <Truck size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        id="supplier"
                        name="supplier"
                        type="text"
                        value={formData.supplier}
                        onChange={handleChange}
                        placeholder="e.g. Sigma-Aldrich"
                        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-12 pr-4 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] color-transition focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <ErrorMessage message={errors.supplier} />
                  </div>

                  {/* Batch Number */}
                  <div>
                    <InputLabel htmlFor="batchNumber" required description="The unique number identifying this specific batch.">
                      Batch Number
                    </InputLabel>
                    <div className="relative">
                      <Hash size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        id="batchNumber"
                        name="batchNumber"
                        type="text"
                        value={formData.batchNumber}
                        onChange={handleChange}
                        placeholder="e.g. MKCD1234V"
                        className={`w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] py-3 pl-12 pr-4 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] color-transition ${
                          errors.batchNumber ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                        }`}
                      />
                    </div>
                    <ErrorMessage message={errors.batchNumber} />
                  </div>

                  {/* Quantity Received */}
                  <div>
                    <InputLabel htmlFor="quantityReceived" required description="The total amount of chemical in this batch.">
                      Quantity Received
                    </InputLabel>
                    <div className="relative">
                      <Box size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        id="quantityReceived"
                        name="quantityReceived"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.quantityReceived}
                        onChange={handleChange}
                        placeholder="e.g. 500"
                        disabled={!formData.chemicalId}
                        className={`w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] py-3 pl-12 pr-20 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] color-transition disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] ${
                          errors.quantityReceived ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                        }`}
                      />
                      {selectedChemical && (
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-text-secondary)]">
                          {selectedChemical.baseUnit}
                        </span>
                      )}
                    </div>
                    <ErrorMessage message={errors.quantityReceived} />
                  </div>

                  {/* Location */}
                  <div>
                    <InputLabel htmlFor="locationId" description="The initial storage location for this batch.">
                      Storage Location
                    </InputLabel>
                    <div className="relative">
                      <MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <select
                        id="locationId"
                        name="locationId"
                        value={formData.locationId}
                        onChange={handleChange}
                        disabled={isLoading || locations.length === 0}
                        className="w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-12 pr-10 text-sm font-medium text-[var(--color-text-primary)] color-transition disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] focus:border-[var(--color-primary)]"
                      >
                        <option value="">
                          {isLoading ? "Loading..." : "Assign later"}
                        </option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.pathName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    </div>
                    <ErrorMessage message={errors.locationId} />
                  </div>

                  {/* Received Date */}
                  <div>
                    <InputLabel htmlFor="receivedDate" required description="The date this batch was received.">
                      Received Date
                    </InputLabel>
                    <div className="relative">
                      <Calendar size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        id="receivedDate"
                        name="receivedDate"
                        type="date"
                        value={formData.receivedDate}
                        onChange={handleChange}
                        className={`w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] py-3 pl-12 pr-4 text-sm font-medium text-[var(--color-text-primary)] color-transition ${
                          errors.receivedDate ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                        }`}
                      />
                    </div>
                    <ErrorMessage message={errors.receivedDate} />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <InputLabel htmlFor="expiryDate" description="The expiry date printed on the container.">
                      Expiry Date
                    </InputLabel>
                    <div className="relative">
                      <Calendar size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-12 pr-4 text-sm font-medium text-[var(--color-text-primary)] color-transition focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <ErrorMessage message={errors.expiryDate} />
                  </div>
                </div>
              </section>
            </div>

            {/* Submit message */}
            {submitMessage && (
              <div
                role="alert"
                className={`mt-6 flex items-start gap-3 rounded-[var(--radius-md)] border p-4 ${
                  submitMessage.type === "success"
                    ? "border-[var(--color-success)] bg-[var(--color-primary-tint)]"
                    : "border-[var(--color-danger)] bg-[var(--color-surface)]"
                }`}
              >
                {submitMessage.type === "success" ? (
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                ) : (
                  <AlertTriangle size={20} className="mt-0.5 shrink-0 text-[var(--color-danger)]" />
                )}
                <p className={`text-sm font-semibold ${
                  submitMessage.type === "success" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                }`}>
                  {submitMessage.text}
                </p>
              </div>
            )}

            {/* Bottom actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text-secondary)] color-transition hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw size={18} />
                Reset Form
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] color-transition hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] color-transition hover:bg-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving Batch...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save New Batch
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddNewBatch;