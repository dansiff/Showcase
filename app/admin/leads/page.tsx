import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "B2B Leads | Admin",
};

async function getLeads() {
  const leads = await prisma.clientIntake.findMany({
    where: {
      projectType: "b2b-lead",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return leads;
}

export default async function LeadsDashboard() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const leads = await getLeads();

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const getStatusColor = (status: string) => statusColors[status] || "bg-gray-100 text-gray-800";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">B2B Leads</h2>
        <p className="text-gray-600 mt-2">Manage incoming business inquiries</p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No leads yet. When submissions come in, they'll appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="cursor-pointer">
                        <p className="text-sm font-semibold text-gray-900">{lead.company}</p>
                        <p className="text-sm text-gray-600">{lead.fullName}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                        {lead.phone && <p className="text-xs text-gray-500">{lead.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lead.businessType || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p>{lead.monthlyRevenueEstimate || "—"}</p>
                        {lead.revenueModel && (
                          <p className="text-xs text-gray-600">{lead.revenueModel}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lead.budget || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {leads.filter((l: any) => l.status === "pending").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Commission Interest</p>
              <p className="text-2xl font-bold text-blue-600">
                {leads.filter((l: any) => l.commissionInterested).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter((l: any) => {
                  const leadDate = new Date(l.createdAt);
                  const thisMonth = new Date();
                  return leadDate.getMonth() === thisMonth.getMonth() &&
                    leadDate.getFullYear() === thisMonth.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Next Steps</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Review pending leads regularly</li>
          <li>✓ Reach out within 24 hours with a call or email</li>
          <li>✓ Update lead status as you progress through the sales pipeline</li>
          <li>✓ Track commission-interested prospects separately for partnership discussions</li>
        </ul>
      </div>
    </div>
  );
}
