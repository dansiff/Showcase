"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { portalConfig, type PortalType } from "@/lib/portal";
import { SignOutButton } from "@/components/SignOutButton";

interface PortalHubClientProps {
  user: {
    name: string | null;
    email: string;
  };
  portals: Record<PortalType, boolean>;
  hasCreator: boolean;
  hasFan: boolean;
  hasClient: boolean;
}

export function PortalHubClient({
  user,
  portals,
  hasCreator,
  hasFan,
  hasClient,
}: PortalHubClientProps) {
  const router = useRouter();

  useEffect(() => {
    // Check for last portal preference
    const lastPortal = localStorage.getItem("lastPortal") as PortalType | null;
    
    if (lastPortal && portals[lastPortal]) {
      // Auto-redirect to last portal after a brief delay
      const timer = setTimeout(() => {
        router.push(portalConfig[lastPortal].path);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [portals, router]);

  const handlePortalClick = (portalId: PortalType) => {
    // Store the portal choice
    localStorage.setItem("lastPortal", portalId);
  };

  const activePortals = Object.entries(portals).filter(
    ([_, active]) => active
  ) as [PortalType, boolean][];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with Sign Out */}
        <div className="flex justify-between items-start mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome back, {user.name || "User"}!
            </h1>
            <p className="text-lg text-gray-600">
              Choose where you'd like to go
            </p>
          </div>
          <SignOutButton className="ml-4" />
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activePortals.map(([portalId]) => {
            const portal = portalConfig[portalId];
            return (
              <Link
                key={portalId}
                href={portal.path}
                onClick={() => handlePortalClick(portalId)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500"
              >
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {portal.icon}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {portal.name}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-4">{portal.description}</p>

                {/* CTA */}
                <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700">
                  Go to portal
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>

                {/* Badge for primary portal */}
                {portalId === "creator" && hasCreator && (
                  <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Primary
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portals.creator && (
              <Link
                href="/creator/content/upload"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-2xl mr-3">📤</span>
                <div>
                  <div className="font-semibold text-gray-900">
                    Upload Content
                  </div>
                  <div className="text-sm text-gray-600">
                    Share with your fans
                  </div>
                </div>
              </Link>
            )}

            {portals.fan && (
              <Link
                href="/fan/discover"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-2xl mr-3">🔍</span>
                <div>
                  <div className="font-semibold text-gray-900">
                    Discover Creators
                  </div>
                  <div className="text-sm text-gray-600">Find new content</div>
                </div>
              </Link>
            )}

            {portals.client && (
              <Link
                href="/client/projects"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-2xl mr-3">📋</span>
                <div>
                  <div className="font-semibold text-gray-900">
                    View Projects
                  </div>
                  <div className="text-sm text-gray-600">Check progress</div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Settings Link */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard/settings"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Account Settings →
          </Link>
        </div>
      </div>
    </div>
  );
}
