import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, FileText, Users, DollarSign } from "lucide-react";

async function getAdminStats() {
  const [totalIntakes, pendingIntakes, inProgressIntakes, completedIntakes, totalRevenue] = await Promise.all([
    prisma.clientIntake.count(),
    prisma.clientIntake.count({ where: { status: "pending" } }),
    prisma.clientIntake.count({ where: { status: "in-progress" } }),
    prisma.clientIntake.count({ where: { status: "completed" } }),
    prisma.clientIntake.aggregate({
      where: { depositPaid: true },
      _sum: { depositAmount: true },
    }),
  ]);

  return {
    totalIntakes,
    pendingIntakes,
    inProgressIntakes,
    completedIntakes,
    totalRevenue: (totalRevenue._sum.depositAmount || 0) / 100, // Convert cents to dollars
  };
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Intakes",
      value: stats.totalIntakes,
      icon: Package,
      color: "bg-blue-500",
      link: "/admin/intakes",
    },
    {
      title: "Pending Review",
      value: stats.pendingIntakes,
      icon: FileText,
      color: "bg-yellow-500",
      link: "/admin/intakes?status=pending",
    },
    {
      title: "In Progress",
      value: stats.inProgressIntakes,
      icon: Users,
      color: "bg-indigo-500",
      link: "/admin/intakes?status=in-progress",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      link: "/admin/intakes?paid=true",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage client intakes and projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/intakes"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">View All Intakes</span>
          </Link>
          <Link
            href="/admin/intakes?status=pending"
            className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Package className="w-5 h-5 mr-2" />
            <span className="font-medium">Review Pending</span>
          </Link>
          <Link
            href="/intake"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">Preview Intake Form</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
          <Link
            href="/admin/intakes"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <RecentIntakes />
      </div>
    </div>
  );
}

async function RecentIntakes() {
  const recentIntakes = await prisma.clientIntake.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  if (recentIntakes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No intake submissions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentIntakes.map((intake) => (
        <Link
          key={intake.id}
          href={`/admin/intakes/${intake.id}`}
          className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-900">{intake.company}</h3>
                <StatusBadge status={intake.status} />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {intake.fullName} • {intake.email}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{intake.projectType}</span>
                <span>•</span>
                <span>{intake.budget}</span>
                <span>•</span>
                <span>{new Date(intake.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {intake.depositPaid && (
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Paid
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
