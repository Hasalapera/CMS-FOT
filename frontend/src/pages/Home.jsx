import React from "react";
import { LogIn, Boxes, FlaskConical, Loader2, ServerCrash, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import ChemicalCard from "../components/Common/ChemicalCard";
import LocationNode from "../components/locations/LocationNode";

const PublicChemicalsList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicChemicals"],
    queryFn: async () => {
      const response = await api.get("/chemicals/public");
      return response.data.chemicals;
    },
  });

  if (isLoading) {
    return <div className="col-span-full flex items-center justify-center gap-2 py-10 text-[var(--color-text-muted)]"><Loader2 className="animate-spin" /> Loading available chemicals...</div>;
  }

  if (isError) {
    return <div className="col-span-full flex items-center justify-center gap-2 py-10 text-[var(--color-danger)]"><ServerCrash /> Could not load chemicals.</div>;
  }

  return data.map((chemical) => <ChemicalCard key={chemical.id} chemical={chemical} isPublicView />);
};

const PublicLocationTree = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicLocationTree"],
    queryFn: async () => {
      const response = await api.get("/locations/public-tree");
      return response.data.locations;
    },
  });

  if (isLoading) {
    return <div className="col-span-full flex items-center justify-center gap-2 py-10 text-[var(--color-text-muted)]"><Loader2 className="animate-spin" /> Loading storage locations...</div>;
  }

  if (isError) {
    return <div className="col-span-full flex items-center justify-center gap-2 py-10 text-[var(--color-danger)]"><ServerCrash /> Could not load locations.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="col-span-full text-center py-10 text-[var(--color-text-muted)]">No storage locations have been defined yet.</div>;
  }

  return (
    <div className="col-span-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
      {data.map(node => (
        <LocationNode key={node.id} node={node} isPublicView={true} />
      ))}
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--color-bg)] font-[family-name:var(--font-body)]">
      {/* ---------------- Header ---------------- */}
      <header className="w-full border-b border-[var(--color-primary-dark)] bg-[var(--color-primary)] color-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-7 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Faculty Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logoFac.jpg"
              alt="Faculty Logo"
              className="w-15 h-15 sm:w-15 sm:h-15 shrink-0 rounded-full object-cover border-2 border-[var(--color-primary-light)] shadow-sm bg-white"
            />
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-sm sm:text-base font-semibold text-[var(--color-text-inverse)] leading-none truncate color-transition">
              Faculty Laboratory Chemical Management System
              </p>
              <p className="text-[11px] sm:text-xs text-[var(--color-primary-tint)] mt-1 truncate color-transition hidden sm:block">
               Faculty Of Technology 
              </p>
            </div>
          </div>

          {/* Login button */}
          <Link
            to="/login"
            className="shrink-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-[var(--color-text-inverse)] text-[var(--color-text-inverse)] text-sm font-medium hover:bg-[var(--color-text-inverse)] hover:text-[var(--color-primary)] color-transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" strokeWidth={1.8} />
            <span>Login</span>
          </Link>
        </div>
      </header>

      {/* ---------------- Main content ---------------- */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mb-8 sm:mb-10">
            <h1 className="flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
              <FlaskConical size={28} className="text-[var(--color-primary)]" />
              Available Chemicals
            </h1>
          </div>

          {/* Placeholder grid — 2 rows x 4 cols, real cards to be added later */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            <PublicChemicalsList />
          </div>

          {/* New Locations Section */}
          <div className="mt-16 mb-8 sm:mb-10">
            <h1 className="flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
              <MapPin size={28} className="text-[var(--color-primary)]" />
              Storage Locations
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-xl">
              Browse the physical storage hierarchy and expand each location to see the chemicals stored there.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4"><PublicLocationTree /></div>
        </div>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 FLCMS · Faculty Laboratory Chemical Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
