// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Building2,
//   FileCheck2,
//   ShieldCheck,
//   Crown,
//   MapPin,
//   Upload,
// } from "lucide-react";

// const company = {
//   name: "Bharat Lighting Co.",
//   gst: "07ABCDE1234F1Z5",
//   pan: "ABCDE1234F",
//   established: "2009",
//   employees: "50-100",
//   description:
//     "Manufacturer and exporter of LED lighting solutions and electrical fixtures for commercial and industrial use.",
// };

// const initialDocuments = [
//   { name: "GST Certificate", status: "Missing", url: "" },
//   { name: "PAN Card", status: "Missing", url: "" },
//   { name: "Company Registration", status: "Missing", url: "" },
//   { name: "Bank Statement", status: "Missing", url: "" },
// ];

// const certifications = ["ISO 9001:2015", "CE Certified", "RoHS Compliant"];

// const branches = [
//   { label: "Head Office", location: "Mumbai, Maharashtra" },
//   { label: "Manufacturing Unit", location: "Pune, Maharashtra" },
//   { label: "Warehouse", location: "Delhi NCR" },
// ];

// export default function CompanyProfilePage() {
//   const [description, setDescription] = useState(company.description);
//   const [docsState, setDocsState] = useState<{name: string, status: string, url?: string}[]>(initialDocuments);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-semibold text-emerald-700">
//           {company.name.charAt(0)}
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold">{company.name}</h1>
//           <p className="text-sm text-muted-foreground">Company profile</p>
//         </div>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Left column */}
//         <div className="space-y-6 lg:col-span-2">
//           {/* Business details */}
//           <Card className="p-6">
//             <h2 className="font-semibold">Business details</h2>
//             <div className="mt-4 grid gap-4 sm:grid-cols-2">
//               <div className="space-y-1.5">
//                 <Label htmlFor="companyName">Company name</Label>
//                 <Input id="companyName" defaultValue={company.name} />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor="gst">GST number</Label>
//                 <Input id="gst" defaultValue={company.gst} />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor="pan">PAN</Label>
//                 <Input id="pan" defaultValue={company.pan} />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor="established">Established year</Label>
//                 <Input id="established" defaultValue={company.established} />
//               </div>
//               <div className="space-y-1.5 sm:col-span-2">
//                 <Label htmlFor="employees">Employees</Label>
//                 <Input id="employees" defaultValue={company.employees} />
//               </div>
//               <div className="space-y-1.5 sm:col-span-2">
//                 <Label htmlFor="description">Company description</Label>
//                 <Textarea
//                   id="description"
//                   rows={4}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>
//             </div>
//             <Button className="mt-5">Save changes</Button>
//           </Card>

//           {/* Documents */}
//           <Card className="p-6">
//             <h2 className="font-semibold">Documents</h2>
//             <div className="mt-4 divide-y divide-slate-100">
//               {docsState.map((doc, idx) => (
//                 <div
//                   key={doc.name}
//                   className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="rounded-lg bg-emerald-50 p-2">
//                       <FileCheck2 className="h-4 w-4 text-emerald-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-slate-800">
//                         {doc.name}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {doc.status}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {doc.url && (
//                       <Button asChild variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
//                         <a href={doc.url} target="_blank" rel="noreferrer">
//                           See document
//                         </a>
//                       </Button>
//                     )}
//                     <div className="relative">
//                       <input
//                         type="file"
//                         className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
//                         onChange={async (e) => {
//                           const file = e.target.files?.[0];
//                           if (!file) return;

//                           const newDocs = [...docsState];
//                           newDocs[idx].status = "Uploading...";
//                           setDocsState(newDocs);

//                           try {
//                             const { uploadFileApi } = await import('@/lib/api/product.api');
//                             const res = await uploadFileApi(file, (pct) => {
//                               const progDocs = [...docsState];
//                               progDocs[idx].status = `Uploading ${pct}%`;
//                               setDocsState(progDocs);
//                             });

//                             const doneDocs = [...docsState];
//                             doneDocs[idx].status = "Uploaded · verified";
//                             doneDocs[idx].url = res.url;
//                             setDocsState(doneDocs);

//                             // Optional: sync with backend using company.api.ts updateCompanyProfile
//                             const { updateCompanyProfile } = await import('@/lib/api/company.api');
//                             await updateCompanyProfile({
//                               documents: doneDocs.filter(d => d.url).map(d => ({
//                                 name: d.name,
//                                 url: d.url,
//                                 status: 'verified'
//                               }))
//                             });
//                           } catch (error) {
//                             console.error("=== UPLOAD ERROR ===", error);
//                             const errDocs = [...docsState];
//                             errDocs[idx].status = "Upload failed";
//                             setDocsState(errDocs);
//                           }
//                         }}
//                       />
//                       <Button variant="outline" size="sm" className="gap-1.5 relative z-0">
//                         <Upload className="h-3.5 w-3.5" /> {doc.url ? "Replace" : "Upload document"}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Certifications & branches */}
//           <Card className="p-6">
//             <h2 className="font-semibold">Certifications & branches</h2>

//             <div className="mt-4 flex flex-wrap gap-2">
//               {certifications.map((cert) => (
//                 <Badge
//                   key={cert}
//                   variant="secondary"
//                   className="bg-slate-100 font-normal text-slate-700"
//                 >
//                   {cert}
//                 </Badge>
//               ))}
//             </div>

//             <p className="mt-5 mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
//               Branches
//             </p>
//             <ul className="space-y-2">
//               {branches.map((b) => (
//                 <li
//                   key={b.label}
//                   className="flex items-center gap-2 text-sm text-slate-600"
//                 >
//                   <MapPin className="h-3.5 w-3.5 text-slate-400" />
//                   <span className="font-medium text-slate-700">
//                     {b.label}
//                   </span>{" "}
//                   — {b.location}
//                 </li>
//               ))}
//             </ul>
//           </Card>
//         </div>

//         {/* Right column */}
//         <div className="space-y-6">
//           <Card className="p-6">
//             <div className="flex items-center gap-2">
//               <ShieldCheck className="h-5 w-5 text-emerald-600" />
//               <h2 className="font-semibold">Verified supplier</h2>
//             </div>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Verified on 12 Apr 2024
//             </p>
//           </Card>

//           <Card className="overflow-hidden p-0">
//             <div className="bg-linear-to-br from-amber-500 to-amber-400 p-5 text-white">
//               <div className="flex items-center gap-2">
//                 <Crown className="h-5 w-5" />
//                 <h2 className="font-semibold">Gold member</h2>
//               </div>
//               <p className="mt-1.5 text-sm text-amber-50">
//                 Priority listings, verified badge, analytics.
//               </p>
//             </div>
//             <div className="p-4">
//               <Button variant="outline" className="w-full">
//                 Upgrade to Enterprise
//               </Button>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center gap-2">
//               <Building2 className="h-5 w-5 text-slate-400" />
//               <h2 className="font-semibold">Need help?</h2>
//             </div>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Contact your account manager to update legal business details.
//             </p>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

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
} from "lucide-react";
import {
  useCompanyProfile,
  useCreateCompanyProfile,
  useUpdateCompanyProfile,
  useUploadCompanyDocument,
} from "../../../lib/hooks/useCompanyProfile";

// Must match REQUIRED_DOCUMENT_NAMES in the backend company.service.ts
const REQUIRED_DOCUMENT_NAMES = [
  "GST Certificate",
  "PAN Card",
  "Company Registration",
  "Bank Statement",
];

export default function CompanyProfilePage() {
  const { data: company, isLoading, isError, error } = useCompanyProfile();
  const createProfile = useCreateCompanyProfile();
  const updateProfile = useUpdateCompanyProfile();
  const uploadDocument = useUploadCompanyDocument();

  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
    panNumber: "",
    established: "",
    employees: "",
    description: "",
  });
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name ?? "",
        gstNumber: company.gstNumber ?? "",
        panNumber: company.panNumber ?? "",
        established: company.established ?? "",
        employees: company.employees ?? "",
        description: company.description ?? "",
      });
    }
  }, [company]);

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => toast.success("Company profile updated"),
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to save changes"),
    });
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
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // No profile yet (backend returns 404 / "Company not Found!") — show create form
  const notFound = isError && (error as any)?.response?.status === 404;

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Set up your company profile</h1>
          <p className="text-sm text-muted-foreground">
            This is what buyers will see when they view your listings.
          </p>
        </div>
        <Card className="p-6">
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Company name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Bharat Lighting Co."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gstNumber">GST number</Label>
              <Input
                id="gstNumber"
                value={form.gstNumber}
                onChange={(e) =>
                  setForm({ ...form, gstNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="panNumber">PAN</Label>
              <Input
                id="panNumber"
                value={form.panNumber}
                onChange={(e) =>
                  setForm({ ...form, panNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            className="mt-5 w-full"
            onClick={handleCreate}
            disabled={createProfile.isPending}
          >
            {createProfile.isPending ? "Creating..." : "Create profile"}
          </Button>
        </Card>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        Couldn't load your company profile. Please refresh the page.
      </div>
    );
  }

  // Merge real documents with placeholder rows for any not yet uploaded,
  // since the backend only creates a CompanyDocument row once something's uploaded.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-semibold text-emerald-700">
          {company.name ? company.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-sm text-muted-foreground">Company profile</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Business details */}
          <Card className="p-6">
            <h2 className="font-semibold">Business details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gst">GST number</Label>
                <Input
                  id="gst"
                  value={form.gstNumber}
                  onChange={(e) =>
                    setForm({ ...form, gstNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pan">PAN</Label>
                <Input
                  id="pan"
                  value={form.panNumber}
                  onChange={(e) =>
                    setForm({ ...form, panNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="established">Established year</Label>
                <Input
                  id="established"
                  value={form.established}
                  onChange={(e) =>
                    setForm({ ...form, established: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="employees">Employees</Label>
                <Input
                  id="employees"
                  value={form.employees}
                  onChange={(e) =>
                    setForm({ ...form, employees: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="description">Company description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              className="mt-5"
              onClick={handleSave}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </Button>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <h2 className="font-semibold">Documents</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {displayDocuments.map((doc) => {
                const isThisUploading = uploadingName === doc.name;
                return (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-50 p-2">
                        <FileCheck2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isThisUploading
                            ? `Uploading ${uploadPct}%`
                            : doc.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.url && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <a href={doc.url} target="_blank" rel="noreferrer">
                            See document
                          </a>
                        </Button>
                      )}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
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
                          className="relative z-0 gap-1.5"
                          disabled={isThisUploading}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {doc.url ? "Replace" : "Upload document"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Certifications & branches */}
          <Card className="p-6">
            <h2 className="font-semibold">Certifications & branches</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {company.certifications.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No certifications added yet.
                </p>
              )}
              {company.certifications.map((cert) => (
                <Badge
                  key={cert.id}
                  variant="secondary"
                  className="bg-slate-100 font-normal text-slate-700"
                >
                  {cert.name}
                </Badge>
              ))}
            </div>

            <p className="mt-5 mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Branches
            </p>
            <ul className="space-y-2">
              {company.branches.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No branches added yet.
                </p>
              )}
              {company.branches.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    {b.label}
                  </span>{" "}
                  — {b.location}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`h-5 w-5 ${company.verified ? "text-emerald-600" : "text-slate-300"}`}
              />
              <h2 className="font-semibold">
                {company.verified ? "Verified supplier" : "Not yet verified"}
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {company.verified && company.verifiedAt
                ? `Verified on ${new Date(company.verifiedAt).toLocaleDateString()}`
                : "Upload your documents to get verified."}
            </p>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="bg-linear-to-br from-amber-500 to-amber-400 p-5 text-white">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                <h2 className="font-semibold">Gold member</h2>
              </div>
              <p className="mt-1.5 text-sm text-amber-50">
                Priority listings, verified badge, analytics.
              </p>
            </div>
            <div className="p-4">
              <Button variant="outline" className="w-full">
                Upgrade to Enterprise
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-400" />
              <h2 className="font-semibold">Need help?</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact your account manager to update legal business details.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
