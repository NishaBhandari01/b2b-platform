"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Building2,
  FileCheck2,
  ShieldCheck,
  Crown,
  MapPin,
  Upload,
  Pencil,
  X,
  CheckCircle2,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  BadgeCheck,
  Briefcase,
} from "lucide-react";
import {
  useCompanyProfile,
  useCreateCompanyProfile,
  useUpdateCompanyProfile,
  useUploadCompanyDocument,
} from "../../../lib/hooks/useCompanyProfile";

const REQUIRED_DOCUMENT_NAMES = [
  "GST Certificate",
  "PAN Card",
  "Company Registration",
  "Bank Statement",
];

type FormState = {
  name: string;
  gstNumber: string;
  panNumber: string;
  established: string;
  employees: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  headquarters: string;
  industry: string;
};

const emptyForm: FormState = {
  name: "",
  gstNumber: "",
  panNumber: "",
  established: "",
  employees: "",
  description: "",
  website: "",
  email: "",
  phone: "",
  headquarters: "",
  industry: "",
};

export default function CompanyProfilePage() {
  const { data: company, isLoading, isError, error } = useCompanyProfile();
  const createProfile = useCreateCompanyProfile();
  const updateProfile = useUpdateCompanyProfile();
  const uploadDocument = useUploadCompanyDocument();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  const syncFormFromCompany = (c: NonNullable<typeof company>) => {
    setForm({
      name: c.name ?? "",
      gstNumber: c.gstNumber ?? "",
      panNumber: c.panNumber ?? "",
      established: c.established ?? "",
      employees: c.employees ?? "",
      description: c.description ?? "",
      website: (c as any).website ?? "",
      email: (c as any).email ?? "",
      phone: (c as any).phone ?? "",
      headquarters: (c as any).headquarters ?? (c as any).address ?? "",
      industry: (c as any).industry ?? "",
    });
  };

  useEffect(() => {
    if (company) syncFormFromCompany(company);
  }, [company]);

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => {
        toast.success("Company profile updated");
        setIsEditing(false);
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to save changes"),
    });
  };

  const handleCancel = () => {
    if (company) syncFormFromCompany(company);
    setIsEditing(false);
  };

  const handleCreate = () => {
    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    createProfile.mutate(form, {
      onSuccess: () => toast.success("Company profile created"),
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to create profile"),
    });
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (!file) return;
    setUploadingName(name);
    setUploadPct(0);
    uploadDocument.mutate(
      { name, file, onProgress: setUploadPct },
      {
        onSuccess: () => toast.success("Document uploaded"),
        onError: (err: any) =>
          toast.error(
            err?.response?.data?.message || "Upload failed — please try again",
          ),
        onSettled: () => {
          setUploadingName(null);
          setUploadPct(0);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-1">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
          <div className="space-y-6 lg:col-span-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const notFound = isError && (error as any)?.response?.status === 404;

  if (notFound) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
              <Building2 className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Set up your company profile
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              This is what buyers see on your listings and quotations. You can
              update it anytime.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-slate-700">
                Company name *
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Bharat Lighting Co."
                className="h-11 border-slate-200 bg-slate-50/50 focus-visible:ring-slate-400"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-slate-700">GST number</Label>
                <Input
                  value={form.gstNumber}
                  onChange={(e) =>
                    setForm({ ...form, gstNumber: e.target.value })
                  }
                  className="h-11 border-slate-200 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700">PAN</Label>
                <Input
                  value={form.panNumber}
                  onChange={(e) =>
                    setForm({ ...form, panNumber: e.target.value })
                  }
                  className="h-11 border-slate-200 bg-slate-50/50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700">About</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="resize-none border-slate-200 bg-slate-50/50"
              />
            </div>
            <Button
              className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={handleCreate}
              disabled={createProfile.isPending}
            >
              {createProfile.isPending
                ? "Creating..."
                : "Create company profile"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/80 px-6 py-5 text-sm text-red-700">
        Couldn&apos;t load your company profile. Please refresh the page.
      </div>
    );
  }

  const documentsByName = new Map(company.documents.map((d) => [d.name, d]));
  const displayDocuments = REQUIRED_DOCUMENT_NAMES.map(
    (name) =>
      documentsByName.get(name) ?? {
        id: name,
        name,
        url: "",
        status: "missing",
      },
  );
  const uploadedCount = displayDocuments.filter((d) => d.url).length;
  const docProgress = Math.round(
    (uploadedCount / REQUIRED_DOCUMENT_NAMES.length) * 100,
  );

  const display = {
    name: company.name,
    established: company.established || "—",
    employees: company.employees || "—",
    industry: form.industry || (company as any).industry || "",
    headquarters:
      form.headquarters ||
      (company as any).headquarters ||
      (company as any).address ||
      "",
    website: form.website || (company as any).website || "",
    email: form.email || (company as any).email || "",
    phone: form.phone || (company as any).phone || "",
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* ─── HEADER ─── */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        {/* soft top wash */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-slate-50 to-transparent" />

        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-5">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-semibold tracking-tight text-white shadow-lg shadow-slate-900/15 sm:h-20 sm:w-20 sm:text-3xl">
              {display.name?.charAt(0)?.toUpperCase() || "?"}
            </div>

            <div className="min-w-0 space-y-2.5 pt-0.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
                  {display.name}
                </h1>
                {company.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              {display.industry && (
                <p className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  {display.industry}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-slate-500">
                {display.headquarters && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {display.headquarters}
                  </span>
                )}
                {display.established !== "—" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Est. {display.established}
                  </span>
                )}
                {display.employees !== "—" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {display.employees} employees
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="h-9 gap-1.5 border-slate-200 px-3.5 text-slate-600 hover:bg-slate-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  className="h-9 gap-1.5 bg-slate-900 px-4 text-white hover:bg-slate-800"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {updateProfile.isPending ? "Saving..." : "Save changes"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-9 gap-1.5 border-slate-200 px-3.5 text-slate-700 hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit profile
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ─── BODY ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-8">
          {/* About */}
          <Card className="rounded-2xl border-slate-200/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
              About
            </h2>
            {isEditing ? (
              <div className="mt-4">
                <Textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe your company, products, markets, and strengths..."
                  className="resize-none border-slate-200 bg-slate-50/40 text-sm leading-relaxed focus-visible:ring-slate-400"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {company.description?.trim() || (
                  <span className="text-slate-400">
                    No description yet. Click Edit profile to add one.
                  </span>
                )}
              </p>
            )}
          </Card>

          {/* Business details */}
          <Card className="rounded-2xl border-slate-200/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
              Business details
            </h2>

            {isEditing ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["name", "Company name", "sm:col-span-2"],
                    ["gstNumber", "GST number", ""],
                    ["panNumber", "PAN", ""],
                    ["established", "Established year", ""],
                    ["employees", "Employees", ""],
                    ["industry", "Industry", "sm:col-span-2"],
                  ] as const
                ).map(([key, label, span]) => (
                  <div key={key} className={`space-y-1.5 ${span}`}>
                    <Label className="text-xs font-medium text-slate-500">
                      {label}
                    </Label>
                    <Input
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      placeholder={
                        key === "established"
                          ? "2015"
                          : key === "employees"
                            ? "50-100"
                            : key === "industry"
                              ? "Manufacturing & Wholesale"
                              : undefined
                      }
                      className="h-10 border-slate-200 bg-slate-50/40 focus-visible:ring-slate-400"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Legal name", value: company.name },
                  { label: "GST number", value: company.gstNumber || "—" },
                  { label: "PAN", value: company.panNumber || "—" },
                  { label: "Established", value: company.established || "—" },
                  {
                    label: "Company size",
                    value: company.employees
                      ? `${company.employees} employees`
                      : "—",
                  },
                  { label: "Industry", value: display.industry || "—" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      {row.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Documents */}
          <Card className="rounded-2xl border-slate-200/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  Verification documents
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {uploadedCount} of {REQUIRED_DOCUMENT_NAMES.length} uploaded
                </p>
              </div>
              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-800 transition-all duration-500"
                    style={{ width: `${docProgress}%` }}
                  />
                </div>
                <span className="text-xs font-medium tabular-nums text-slate-500">
                  {docProgress}%
                </span>
              </div>
            </div>

            <ul className="mt-5 divide-y divide-slate-100">
              {displayDocuments.map((doc) => {
                const isThisUploading = uploadingName === doc.name;
                const isUploaded = Boolean(doc.url);
                return (
                  <li
                    key={doc.name}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isUploaded
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <FileCheck2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {doc.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {isThisUploading
                            ? `Uploading ${uploadPct}%…`
                            : isUploaded
                              ? "Uploaded"
                              : "Required · not uploaded"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:pl-0 pl-13">
                      {doc.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-slate-600 hover:text-slate-900"
                        >
                          <a href={doc.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </a>
                        </Button>
                      )}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="absolute inset-0 z-10 cursor-pointer opacity-0"
                          disabled={isThisUploading}
                          onChange={(e) => {
                            handleFileChange(
                              doc.name,
                              e.target.files?.[0] ?? null,
                            );
                            e.target.value = "";
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isThisUploading}
                          className="relative z-0 h-8 gap-1.5 border-slate-200 text-slate-700"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {doc.url ? "Replace" : "Upload"}
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Certifications & branches */}
          <Card className="rounded-2xl border-slate-200/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
              Certifications
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {company.certifications.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No certifications added yet.
                </p>
              ) : (
                company.certifications.map((cert) => (
                  <Badge
                    key={cert.id}
                    variant="secondary"
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
                  >
                    {cert.name}
                  </Badge>
                ))
              )}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
                Branches
              </h2>
              <ul className="mt-3 space-y-2">
                {company.branches.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No branches added yet.
                  </p>
                ) : (
                  company.branches.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/40 px-3.5 py-3 text-sm"
                    >
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>
                        <span className="font-medium text-slate-800">
                          {b.label}
                        </span>
                        <span className="text-slate-500"> — {b.location}</span>
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <aside className="space-y-5 lg:col-span-4">
          {/* Verification */}
          <Card className="rounded-2xl border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  company.verified
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {company.verified ? "Verified supplier" : "Not verified"}
                </p>
                <p className="text-xs text-slate-500">
                  {company.verified && company.verifiedAt
                    ? `Since ${new Date(company.verifiedAt).toLocaleDateString()}`
                    : "Upload documents to get verified"}
                </p>
              </div>
            </div>
            {!company.verified && (
              <p className="mt-4 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">
                Complete all document uploads to unlock the verified badge and
                increase buyer trust.
              </p>
            )}
          </Card>

          {/* Contact */}
          <Card className="rounded-2xl border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
              Contact
            </h2>

            {isEditing ? (
              <div className="mt-4 space-y-3.5">
                {(
                  [
                    ["website", "Website", "www.company.com"],
                    ["email", "Email", "contact@company.com"],
                    ["phone", "Phone", "9876543210"],
                    ["headquarters", "Headquarters", "Mumbai, India"],
                  ] as const
                ).map(([key, label, ph]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500">
                      {label}
                    </Label>
                    <Input
                      type={
                        key === "email"
                          ? "email"
                          : key === "phone"
                            ? "tel"
                            : "text"
                      }
                      inputMode={key === "phone" ? "numeric" : undefined}
                      maxLength={key === "phone" ? 10 : undefined}
                      value={form[key]}
                      onChange={(e) => {
                        if (key === "phone") {
                          const digits = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setForm({ ...form, phone: digits });
                          return;
                        }
                        setForm({ ...form, [key]: e.target.value });
                      }}
                      placeholder={ph}
                      className="h-9 border-slate-200 bg-slate-50/40 text-sm focus-visible:ring-slate-400"
                    />
                    {key === "phone" &&
                      form.phone.length > 0 &&
                      form.phone.length < 10 && (
                        <p className="text-[11px] text-amber-600">
                          Enter a 10-digit mobile number
                        </p>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {[
                  {
                    icon: Globe,
                    value: display.website,
                    empty: "Website not added",
                  },
                  {
                    icon: Mail,
                    value: display.email,
                    empty: "Email not added",
                  },
                  {
                    icon: Phone,
                    value: display.phone,
                    empty: "Phone not added",
                  },
                  {
                    icon: MapPin,
                    value: display.headquarters,
                    empty: "Location not added",
                  },
                ].map(({ icon: Icon, value, empty }) => (
                  <li key={empty} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className={
                        value
                          ? "pt-1 text-slate-700"
                          : "pt-1 text-slate-400 italic"
                      }
                    >
                      {value || empty}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Membership */}
          <Card className="overflow-hidden rounded-2xl border-slate-200/80 p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="bg-slate-900 px-5 py-5 text-white">
              <div className="flex items-center gap-2">
                <Crown className="h-4.5 w-4.5 text-amber-400" />
                <p className="text-sm font-semibold">Gold member</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Priority listings, verified badge, and supplier analytics.
              </p>
            </div>
            <div className="bg-white p-4">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-full border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Upgrade to Enterprise
              </Button>
            </div>
          </Card>

          {/* Help */}
          <Card className="rounded-2xl border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                <Building2 className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Need help?</p>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
              Contact your account manager to update legal details or request a
              verification review.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
