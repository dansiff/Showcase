// app/client/projects/page.tsx
// Client portal: view all intake submissions and project requests

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Projects — The Fusion Space",
  description: "View and manage your project submissions",
};

async function getClientProjects() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/signin");
  }

  // Get all client intakes for this user's email
  const intakes = await prisma.clientIntake.findMany({
    where: {
      email: authUser.email!,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { user: authUser, intakes };
}

export default async function ClientProjects() {
  const { user, intakes } = await getClientProjects();

  const activeProjects = intakes.filter((i) => i.status === "IN_PROGRESS");
  const completedProjects = intakes.filter((i) => i.status === "COMPLETED");
  const pendingProjects = intakes.filter((i) => i.status === "PENDING");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Projects
              </h1>
              <p className="mt-1 text-gray-600">
                Track your submissions and project status
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/intake"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                + New Request
              </Link>
              <Link
                href="/portal"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                ← Back to Portal
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex items-center gap-6">
            <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="font-semibold text-yellow-900">{pendingProjects.length}</span>
              <span className="text-yellow-700 text-sm ml-1">Pending</span>
            </div>
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-semibold text-blue-900">{activeProjects.length}</span>
              <span className="text-blue-700 text-sm ml-1">In Progress</span>
            </div>
            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-semibold text-green-900">{completedProjects.length}</span>
              <span className="text-green-700 text-sm ml-1">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {intakes.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Submit your first project request to get started
            </p>
            <Link
              href="/intake"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Submit New Request
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Projects */}
            {activeProjects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  In Progress ({activeProjects.length})
                </h2>
                <div className="space-y-4">
                  {activeProjects.map((intake) => (
                    <div
                      key={intake.id}
                      className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {intake.company || "Project Request"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Submitted {new Date(intake.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                          In Progress
                        </span>
                      </div>

                      {intake.budget && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">Budget: </span>
                          <span className="font-semibold text-gray-900">{intake.budget}</span>
                        </div>
                      )}

                      {intake.timeline && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">Timeline: </span>
                          <span className="font-semibold text-gray-900">{intake.timeline}</span>
                        </div>
                      )}

                      {intake.projectDescription && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {intake.projectDescription}
                          </p>
                        </div>
                      )}

                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Projects */}
            {pendingProjects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Pending Review ({pendingProjects.length})
                </h2>
                <div className="space-y-4">
                  {pendingProjects.map((intake) => (
                    <div
                      key={intake.id}
                      className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {intake.company || "Project Request"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Submitted {new Date(intake.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
                          Pending
                        </span>
                      </div>

                      {intake.budget && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">Budget: </span>
                          <span className="font-semibold text-gray-900">{intake.budget}</span>
                        </div>
                      )}

                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Projects */}
            {completedProjects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Completed ({completedProjects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedProjects.map((intake) => (
                    <div
                      key={intake.id}
                      className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900">
                          {intake.company || "Project Request"}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          ✓ Done
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Completed {new Date(intake.updatedAt).toLocaleDateString()}
                      </p>
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
