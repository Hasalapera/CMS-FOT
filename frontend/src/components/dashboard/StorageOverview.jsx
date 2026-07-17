// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   ArrowRight,
//   Loader2,
//   Warehouse,
// } from "lucide-react";

// const PANEL =
//   "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]";

// const SectionHeader = ({
//   icon: Icon,
//   title,
//   text,
//   to,
//   action,
// }) => (
//   <header className="flex flex-col gap-3 border-b border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
//     <div className="flex min-w-0 items-start gap-3">
//       <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] text-[var(--color-primary)]">
//         <Icon size={20} />
//       </span>

//       <div className="min-w-0">
//         <h2 className="text-base font-extrabold text-[var(--color-text-primary)] sm:text-lg">
//           {title}
//         </h2>

//         {text && (
//           <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm">
//             {text}
//           </p>
//         )}
//       </div>
//     </div>

//     {to && action && (
//       <Link
//         to={to}
//         className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)]"
//       >
//         {action}
//         <ArrowRight size={15} />
//       </Link>
//     )}
//   </header>
// );

// const EmptyState = ({ children }) => (
//   <div className="flex min-h-44 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-4 text-center text-sm font-semibold text-[var(--color-text-secondary)]">
//     {children}
//   </div>
// );

// const StorageOverview = ({
//   locations = [],
//   isLoading = false,
//   isError = false,
// }) => {
//   return (
//     <article className={`${PANEL} overflow-hidden`}>
//       <SectionHeader
//         icon={Warehouse}
//         title="Storage Overview"
//         text="Current utilization across laboratory locations."
//         to="/locations"
//         action="View locations"
//       />

//       <div className="space-y-5 p-4 sm:p-5">
//         {isLoading ? (
//           <div className="flex min-h-44 items-center justify-center">
//             <Loader2
//               size={28}
//               className="animate-spin text-[var(--color-primary)]"
//             />
//           </div>
//         ) : isError ? (
//           <EmptyState>
//             Unable to load storage overview.
//           </EmptyState>
//         ) : locations.length > 0 ? (
//           locations.map((item) => {
//             const usage = Math.min(
//               100,
//               Math.max(0, Number(item.usage || 0)),
//             );

//             return (
//               <div key={item.id || item.name}>
//                 <div className="flex items-center justify-between gap-3">
//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">
//                       {item.name}
//                     </p>

//                     <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
//                       {Number(item.count || 0)} locations
//                     </p>
//                   </div>

//                   <strong className="shrink-0 text-sm text-[var(--color-primary)]">
//                     {usage.toFixed(1)}%
//                   </strong>
//                 </div>

//                 <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
//                   <div
//                     className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500"
//                     style={{
//                       width: `${usage}%`,
//                     }}
//                   />
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <EmptyState>
//             Locations overview is coming soon.
//           </EmptyState>
//         )}
//       </div>
//     </article>
//   );
// };

// export default StorageOverview;