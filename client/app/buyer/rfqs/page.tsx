"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { useToast } from "@/lib/hooks/useToast";
import { Plus, Eye, Edit2, Trash2, Send } from "lucide-react";

interface RFQFormState {
  title: string;
  category: string;
  quantity: string;
  budget: string;
  deadline: string;
  notes: string;
}

const initialForm: RFQFormState = {
  title: "",
  category: "",
  quantity: "",
  budget: "",
  deadline: "",
  notes: "",
};

export default function BuyerRFQs() {
  const { success, error, info } = useToast();
  const [rfqs, setRfqs] = useState([
    {
      id: "RFQ-001",
      title: "Industrial Pumps Required",
      category: "Industrial Equipment",
      quantity: "50 Units",
      budget: "$25,000 - $35,000",
      deadline: "2026-07-15",
      status: "Active",
      responses: 8,
    },
    {
      id: "RFQ-002",
      title: "Raw Materials - Plastic Resin",
      category: "Raw Materials",
      quantity: "500 kg",
      budget: "$8,000 - $12,000",
      deadline: "2026-07-20",
      status: "Active",
      responses: 12,
    },
    {
      id: "RFQ-003",
      title: "Electronic Components",
      category: "Electronics",
      quantity: "1000 Units",
      budget: "$15,000 - $20,000",
      deadline: "2026-07-10",
      status: "Closed",
      responses: 15,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  const nextId = useMemo(
    () => `RFQ-${String(rfqs.length + 1).padStart(3, "0")}`,
    [rfqs.length],
  );

  const handleViewRFQ = (rfqId: string) => {
    info("RFQ details", `Showing supplier responses for ${rfqId}.`);
  };

  const handleEditRFQ = (rfqId: string) => {
    info("Edit flow", `Opening edit experience for ${rfqId}.`);
  };

  const handleDeleteRFQ = (rfqId: string) => {
    if (window.confirm(`Delete RFQ ${rfqId}?`)) {
      setRfqs((current) => current.filter((r) => r.id !== rfqId));
      success("RFQ removed", `${rfqId} was removed from your list.`);
    }
  };

  const handleCreateRFQ = () => {
    setShowForm(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.title ||
      !form.category ||
      !form.quantity ||
      !form.budget ||
      !form.deadline
    ) {
      error(
        "Missing details",
        "Please complete the required fields before posting your RFQ.",
      );
      return;
    }

    const createdRFQ = {
      id: nextId,
      title: form.title,
      category: form.category,
      quantity: form.quantity,
      budget: form.budget,
      deadline: form.deadline,
      status: "Active",
      responses: 0,
    };

    setRfqs((current) => [createdRFQ, ...current]);
    setForm(initialForm);
    setShowForm(false);
    success(
      "RFQ posted",
      `Your request is live and suppliers can respond now.`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Requests for Quotation
          </h1>
          <p className="text-slate-600 mt-1">Manage and track your RFQs</p>
        </div>
        <button
          onClick={handleCreateRFQ}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create RFQ
        </button>
      </div>

      {showForm ? (
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Create a new RFQ
            </h2>
            <p className="text-sm text-slate-600">
              Share what you need and suppliers will respond with quotes.
            </p>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                What do you need?
              </label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="e.g. Industrial pumps for production line"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <input
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="Category"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantity: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="50 units"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Budget
              </label>
              <input
                value={form.budget}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    budget: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="$25,000 - $35,000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    deadline: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                What should suppliers know?
              </label>
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0"
                placeholder="Include quality standards, delivery expectations, and any required certifications."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
                Post RFQ
              </button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  RFQ ID
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Title
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Category
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Budget
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Responses
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq) => (
                <tr
                  key={rfq.id}
                  className="border-t hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-900">
                      {rfq.id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-900">{rfq.title}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-600">{rfq.category}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-900 font-medium">{rfq.budget}</p>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={
                        rfq.status === "Active" ? "success" : "secondary"
                      }
                    >
                      {rfq.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {rfq.responses}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewRFQ(rfq.id)}
                        className="p-2 hover:bg-slate-200 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleEditRFQ(rfq.id)}
                        className="p-2 hover:bg-slate-200 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteRFQ(rfq.id)}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
