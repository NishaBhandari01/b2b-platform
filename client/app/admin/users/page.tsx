"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { Search, ChevronDown, MoreVertical } from "lucide-react";
import { useState } from "react";

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john@techcorp.com",
    role: "supplier",
    status: "active",
    joined: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@mfg.com",
    role: "supplier",
    status: "active",
    joined: "2024-02-20",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@retail.com",
    role: "buyer",
    status: "active",
    joined: "2024-03-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@finance.com",
    role: "buyer",
    status: "inactive",
    joined: "2023-12-05",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert@health.com",
    role: "supplier",
    status: "active",
    joined: "2024-04-01",
  },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform users, role assignments, and account activity.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm"
            placeholder="Search users..."
          />
        </div>
        <div className="relative">
          <select
            value={filterRole}
            onChange={(event) => setFilterRole(event.target.value)}
            className="appearance-none rounded-lg border border-input bg-background py-2 pl-3 pr-8 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="supplier">Supplier</option>
            <option value="buyer">Buyer</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-secondary/70">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-center font-semibold">Role</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Joined</th>
              <th className="px-6 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0 hover:bg-secondary/40"
              >
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge
                    className={
                      user.role === "supplier"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {user.joined}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg p-2 hover:bg-secondary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
