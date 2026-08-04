// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Building2,
//   MapPin,
//   Mail,
//   Phone,
//   Globe,
//   BadgeCheck,
//   Users,
//   Calendar,
//   Package,
//   FileText,
// } from "lucide-react";

// import { getCompanyById } from "@/lib/api/company.api";

// export default function CompanyDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const companyId = params.companyId as string;

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["company", companyId],
//     queryFn: () => getCompanyById(companyId),
//     enabled: !!companyId,
//   });

//   if (isLoading) {
//     return <div className="p-10 text-center">Loading company profile...</div>;
//   }

//   if (isError || !data?.data) {
//     return <div className="p-10 text-center">Company not found</div>;
//   }

//   const company = data.data;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <button
//         onClick={() => router.back()}
//         className="
//         flex
//         items-center
//         gap-2
//         px-4
//         py-2
//         bg-white
//         border
//         rounded-lg
//         text-slate-700
//         hover:bg-slate-50
//         transition
//         shadow-sm
//       "
//       >
//         ← Back
//       </button>

//       <div className="bg-white border rounded-xl p-6 flex justify-between">
//         <div className="flex gap-5">
//           <div
//             className="
//             w-20 h-20
//             rounded-xl
//             bg-purple-600
//             text-white
//             flex
//             items-center
//             justify-center
//             text-3xl
//             font-bold
//             "
//           >
//             {company.name.slice(0, 2).toUpperCase()}
//           </div>

//           <div>
//             <div className="flex items-center gap-2">
//               <h1 className="text-3xl font-bold">{company.name}</h1>

//               {company.verified && <BadgeCheck className="text-blue-600" />}
//             </div>

//             <p className="text-slate-600 mt-2">{company.industry}</p>

//             <p className="text-sm text-slate-500 mt-2">
//               Established {company.established ?? "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Company Information */}

//       <div className="grid md:grid-cols-3 gap-6">
//         <div
//           className="
//           md:col-span-2
//           bg-white
//           border
//           rounded-xl
//           p-6
//         "
//         >
//           <h2 className="text-xl font-semibold mb-3">About Company</h2>

//           <p className="text-slate-600 leading-relaxed">
//             {company.description || "No description available"}
//           </p>
//         </div>

//         <div
//           className="
//           bg-white
//           border
//           rounded-xl
//           p-6
//           space-y-4
//         "
//         >
//           <h2 className="font-semibold text-xl">Contact</h2>

//           <p className="flex gap-2 text-slate-600">
//             <Mail size={18} />
//             {company.email || "N/A"}
//           </p>

//           <p className="flex gap-2 text-slate-600">
//             <Phone size={18} />
//             {company.phone || "N/A"}
//           </p>

//           <p className="flex gap-2 text-slate-600">
//             <MapPin size={18} />
//             {company.headquarters || "N/A"}
//           </p>

//           {company.website && (
//             <p className="flex gap-2 text-slate-600">
//               <Globe size={18} />
//               {company.website}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Business Stats */}

//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="bg-white border rounded-xl p-5">
//           <Users className="text-purple-600 mb-3" />

//           <p className="text-sm text-slate-500">Employees</p>

//           <p className="font-semibold">{company.employees || "N/A"}</p>
//         </div>

//         <div className="bg-white border rounded-xl p-5">
//           <Calendar className="text-purple-600 mb-3" />

//           <p className="text-sm text-slate-500">Founded</p>

//           <p className="font-semibold">{company.established || "N/A"}</p>
//         </div>

//         <div className="bg-white border rounded-xl p-5">
//           <Package className="text-purple-600 mb-3" />

//           <p className="text-sm text-slate-500">Products</p>

//           <p className="font-semibold">{company.products?.length ?? 0}</p>
//         </div>
//       </div>

//       {/* Certifications */}

//       <div
//         className="
//         bg-white
//         border
//         rounded-xl
//         p-6
//       "
//       >
//         <h2 className="text-xl font-semibold mb-4">Certifications</h2>

//         {company.certifications?.length ? (
//           <div className="flex flex-wrap gap-3">
//             {company.certifications.map((cert: any) => (
//               <span
//                 key={cert.id}
//                 className="
//                       px-4
//                       py-2
//                       bg-purple-100
//                       text-purple-700
//                       rounded-full
//                       "
//               >
//                 {cert.name}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-slate-500">No certifications available</p>
//         )}
//       </div>

//       {/* Branches */}

//       <div
//         className="
//         bg-white
//         border
//         rounded-xl
//         p-6
//       "
//       >
//         <h2 className="text-xl font-semibold mb-4">Branch Locations</h2>

//         {company.branches?.length ? (
//           company.branches.map((branch: any) => (
//             <div
//               key={branch.id}
//               className="
//                   border
//                   rounded-lg
//                   p-4
//                   mb-3
//                   "
//             >
//               <p className="font-semibold">{branch.label}</p>

//               <p className="text-slate-600">{branch.location}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-slate-500">No branches added</p>
//         )}
//       </div>

//       {/* Products */}

//       <div
//         className="
//         bg-white
//         border
//         rounded-xl
//         p-6
//       "
//       >
//         <h2 className="text-xl font-semibold mb-4">Products</h2>

//         {company.products?.length ? (
//           <div className="grid md:grid-cols-3 gap-5">
//             {company.products.map((product: any) => (
//               <div
//                 key={product.id}
//                 className="
//                       border
//                       rounded-lg
//                       p-4
//                       "
//               >
//                 <h3 className="font-semibold">{product.name}</h3>

//                 <p className="text-sm text-slate-500">{product.category}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-slate-500">No products listed</p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertCircle,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  BadgeCheck,
  Users,
  Calendar,
  Package,
  ShieldCheck,
} from "lucide-react";

import { getCompanyById } from "@/lib/api/company.api";

// ============================================================================
// TYPES
// ============================================================================

interface Certification {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  label: string;
  location: string;
}

interface Product {
  id: string;
  name: string;
  category?: string;
}

interface Company {
  id: string;
  name: string;
  verified?: boolean;
  industry?: string;
  established?: string | number;
  description?: string;
  email?: string;
  phone?: string;
  headquarters?: string;
  website?: string;
  employees?: string;
  products?: Product[];
  certifications?: Certification[];
  branches?: Branch[];
}

// ============================================================================
// HELPERS
// ============================================================================

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

// ============================================================================
// PAGE
// ============================================================================

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const { data, isLoading, isError, refetch } = useQuery<{ data: Company }>({
    queryKey: ["company", companyId],
    queryFn: () => getCompanyById(companyId),
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white md:col-span-2" />
            <div className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Company not found
          </h2>
          <p className="max-w-sm text-sm text-slate-500">
            We couldn&apos;t load this supplier&apos;s profile. It may have been
            removed, or something went wrong on our end.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Go back
            </button>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const company = data.data;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Profile header */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="h-20 bg-gradient-to-r from-orange-500 to-amber-500" />
          <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end">
            <div className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-4 border-white bg-slate-800 text-2xl font-bold text-white shadow-sm">
              {getInitials(company.name)}
            </div>

            <div className="flex-1 pt-2 sm:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {company.name}
                </h1>
                {company.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <BadgeCheck size={12} />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                {company.industry && (
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} />
                    {company.industry}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Established {company.established ?? "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* About + Contact */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:col-span-2">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              About Company
            </h2>
            <p className="leading-relaxed text-slate-600">
              {company.description || "No description available"}
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>

            <div className="space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-slate-400" />
                {company.email || "N/A"}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-slate-400" />
                {company.phone || "N/A"}
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={16} className="shrink-0 text-slate-400" />
                {company.headquarters || "N/A"}
              </p>
              {company.website && (
                <p className="flex items-center gap-2.5">
                  <Globe size={16} className="shrink-0 text-slate-400" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Business stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm text-slate-500">Employees</p>
            <p className="font-semibold text-slate-900">
              {company.employees || "N/A"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm text-slate-500">Founded</p>
            <p className="font-semibold text-slate-900">
              {company.established || "N/A"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm text-slate-500">Products</p>
            <p className="font-semibold text-slate-900">
              {company.products?.length ?? 0}
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-slate-400" />
            Certifications
          </h2>

          {company.certifications?.length ? (
            <div className="flex flex-wrap gap-2.5">
              {company.certifications.map((cert) => (
                <span
                  key={cert.id}
                  className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700"
                >
                  {cert.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No certifications available
            </p>
          )}
        </div>

        {/* Branches */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Branch Locations
          </h2>

          {company.branches?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {company.branches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 p-4"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{branch.label}</p>
                    <p className="text-sm text-slate-500">{branch.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No branches added</p>
          )}
        </div>

        {/* Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Products
          </h2>

          {company.products?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {company.products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-slate-200 p-4 transition hover:shadow-sm"
                >
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    <Package className="h-4 w-4 text-slate-500" />
                  </div>
                  <h3 className="font-medium text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500">
                    {product.category || "Uncategorized"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No products listed</p>
          )}
        </div>
      </div>
    </div>
  );
}
