"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  BadgeCheck,
  Users,
  Calendar,
  Package,
  FileText,
} from "lucide-react";

import { getCompanyById } from "@/lib/api/company.api";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompanyById(companyId),
    enabled: !!companyId,
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading company profile...</div>;
  }

  if (isError || !data?.data) {
    return <div className="p-10 text-center">Company not found</div>;
  }

  const company = data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="
        flex
        items-center
        gap-2
        px-4
        py-2
        bg-white
        border
        rounded-lg
        text-slate-700
        hover:bg-slate-50
        transition
        shadow-sm
      "
      >
        ← Back
      </button>

      <div className="bg-white border rounded-xl p-6 flex justify-between">
        <div className="flex gap-5">
          <div
            className="
            w-20 h-20
            rounded-xl
            bg-purple-600
            text-white
            flex
            items-center
            justify-center
            text-3xl
            font-bold
            "
          >
            {company.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{company.name}</h1>

              {company.verified && <BadgeCheck className="text-blue-600" />}
            </div>

            <p className="text-slate-600 mt-2">{company.industry}</p>

            <p className="text-sm text-slate-500 mt-2">
              Established {company.established ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Company Information */}

      <div className="grid md:grid-cols-3 gap-6">
        <div
          className="
          md:col-span-2
          bg-white
          border
          rounded-xl
          p-6
        "
        >
          <h2 className="text-xl font-semibold mb-3">About Company</h2>

          <p className="text-slate-600 leading-relaxed">
            {company.description || "No description available"}
          </p>
        </div>

        <div
          className="
          bg-white
          border
          rounded-xl
          p-6
          space-y-4
        "
        >
          <h2 className="font-semibold text-xl">Contact</h2>

          <p className="flex gap-2 text-slate-600">
            <Mail size={18} />
            {company.email || "N/A"}
          </p>

          <p className="flex gap-2 text-slate-600">
            <Phone size={18} />
            {company.phone || "N/A"}
          </p>

          <p className="flex gap-2 text-slate-600">
            <MapPin size={18} />
            {company.headquarters || "N/A"}
          </p>

          {company.website && (
            <p className="flex gap-2 text-slate-600">
              <Globe size={18} />
              {company.website}
            </p>
          )}
        </div>
      </div>

      {/* Business Stats */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-5">
          <Users className="text-purple-600 mb-3" />

          <p className="text-sm text-slate-500">Employees</p>

          <p className="font-semibold">{company.employees || "N/A"}</p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <Calendar className="text-purple-600 mb-3" />

          <p className="text-sm text-slate-500">Founded</p>

          <p className="font-semibold">{company.established || "N/A"}</p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <Package className="text-purple-600 mb-3" />

          <p className="text-sm text-slate-500">Products</p>

          <p className="font-semibold">{company.products?.length ?? 0}</p>
        </div>
      </div>

      {/* Certifications */}

      <div
        className="
        bg-white
        border
        rounded-xl
        p-6
      "
      >
        <h2 className="text-xl font-semibold mb-4">Certifications</h2>

        {company.certifications?.length ? (
          <div className="flex flex-wrap gap-3">
            {company.certifications.map((cert: any) => (
              <span
                key={cert.id}
                className="
                      px-4
                      py-2
                      bg-purple-100
                      text-purple-700
                      rounded-full
                      "
              >
                {cert.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No certifications available</p>
        )}
      </div>

      {/* Branches */}

      <div
        className="
        bg-white
        border
        rounded-xl
        p-6
      "
      >
        <h2 className="text-xl font-semibold mb-4">Branch Locations</h2>

        {company.branches?.length ? (
          company.branches.map((branch: any) => (
            <div
              key={branch.id}
              className="
                  border
                  rounded-lg
                  p-4
                  mb-3
                  "
            >
              <p className="font-semibold">{branch.label}</p>

              <p className="text-slate-600">{branch.location}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No branches added</p>
        )}
      </div>

      {/* Products */}

      <div
        className="
        bg-white
        border
        rounded-xl
        p-6
      "
      >
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        {company.products?.length ? (
          <div className="grid md:grid-cols-3 gap-5">
            {company.products.map((product: any) => (
              <div
                key={product.id}
                className="
                      border
                      rounded-lg
                      p-4
                      "
              >
                <h3 className="font-semibold">{product.name}</h3>

                <p className="text-sm text-slate-500">{product.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No products listed</p>
        )}
      </div>
    </div>
  );
}
