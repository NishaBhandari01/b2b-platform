"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  FileCheck2,
  ShieldCheck,
  Crown,
  MapPin,
  Upload,
} from "lucide-react";

/* -------- mock data — replace with your API response -------- */

const company = {
  name: "Bharat Lighting Co.",
  gst: "07ABCDE1234F1Z5",
  pan: "ABCDE1234F",
  established: "2009",
  employees: "50-100",
  description:
    "Manufacturer and exporter of LED lighting solutions and electrical fixtures for commercial and industrial use.",
};

const documents = [
  { name: "GST Certificate", status: "Uploaded · verified" },
  { name: "PAN Card", status: "Uploaded · verified" },
  { name: "Company Registration", status: "Uploaded · verified" },
  { name: "Bank Statement", status: "Uploaded · verified" },
];

const certifications = ["ISO 9001:2015", "BIS", "CE"];

const branches = [
  { label: "Head Office", location: "Delhi" },
  { label: "Factory", location: "Noida, UP" },
  { label: "Sales Office", location: "Mumbai" },
];

/* -------------------------------------------------------------- */

export default function CompanyProfilePage() {
  const [description, setDescription] = useState(company.description);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-semibold text-emerald-700">
          {company.name.charAt(0)}
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
                <Input id="companyName" defaultValue={company.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gst">GST number</Label>
                <Input id="gst" defaultValue={company.gst} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pan">PAN</Label>
                <Input id="pan" defaultValue={company.pan} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="established">Established year</Label>
                <Input id="established" defaultValue={company.established} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="employees">Employees</Label>
                <Input id="employees" defaultValue={company.employees} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="description">Company description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <Button className="mt-5">Save changes</Button>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <h2 className="font-semibold">Documents</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {documents.map((doc) => (
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
                        {doc.status}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Upload className="h-3.5 w-3.5" /> Replace
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Certifications & branches */}
          <Card className="p-6">
            <h2 className="font-semibold">Certifications & branches</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <Badge
                  key={cert}
                  variant="secondary"
                  className="bg-slate-100 font-normal text-slate-700"
                >
                  {cert}
                </Badge>
              ))}
            </div>

            <p className="mt-5 mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Branches
            </p>
            <ul className="space-y-2">
              {branches.map((b) => (
                <li
                  key={b.label}
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
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h2 className="font-semibold">Verified supplier</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Verified on 12 Apr 2024
            </p>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-amber-500 to-amber-400 p-5 text-white">
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
