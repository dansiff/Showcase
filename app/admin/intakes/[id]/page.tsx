"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Check,
  X,
  Clock,
} from "lucide-react";

type IntakeDetail = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string;
  website: string | null;
  projectType: string;
  projectDescription: string;
  goals: string;
  targetAudience: string;
  features: string[];
  designPreferences: string | null;
  brandGuidelines: string | null;
  contentReady: string;
  timeline: string;
  launchDate: string | null;
  budget: string;
  competitors: string | null;
  inspiration: string | null;
  additionalNotes: string | null;
  preferredCallDate: string | null;
  preferredCallTime: string | null;
  uploadedFiles: string[];
  status: string;
  depositPaid: boolean;
  depositAmount: number | null;
  createdAt: string;
  updatedAt: string;
};

export default function IntakeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [intake, setIntake] = useState<IntakeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchIntake();
  }, []);

  const fetchIntake = async () => {
    try {
      const response = await fetch(`/api/admin/intakes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setIntake(data);
      }
    } catch (err) {
      console.error("Failed to fetch intake:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/intakes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setIntake((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Intake not found</h2>
          <Link href="/admin/intakes" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            ← Back to intakes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/intakes"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Intakes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{intake.company}</h1>
            <p className="mt-2 text-gray-600">
              Submitted on {new Date(intake.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={intake.status} />
            {intake.depositPaid && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <DollarSign className="w-4 h-4 mr-1" />
                Deposit Paid (${(intake.depositAmount || 0) / 100})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-gray-900">{intake.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="mt-1 text-gray-900">{intake.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <a
                  href={`mailto:${intake.email}`}
                  className="mt-1 text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  {intake.email}
                </a>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1 text-gray-900">{intake.phone || "Not provided"}</p>
              </div>
              {intake.website && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Current Website</label>
                  <a
                    href={intake.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    {intake.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Project Type</label>
                <p className="mt-1 text-gray-900 capitalize">{intake.projectType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{intake.projectDescription}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Business Goals</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{intake.goals}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Target Audience</label>
                <p className="mt-1 text-gray-900">{intake.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements & Features</h2>
            <div className="space-y-4">
              {intake.features.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Required Features</label>
                  <div className="flex flex-wrap gap-2">
                    {intake.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {intake.designPreferences && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Design Preferences</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{intake.designPreferences}</p>
                </div>
              )}
              {intake.brandGuidelines && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand Guidelines</label>
                  <p className="mt-1 text-gray-900">{intake.brandGuidelines}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Content Status</label>
                <p className="mt-1 text-gray-900 capitalize">{intake.contentReady}</p>
              </div>
              {intake.inspiration && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Inspiration</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{intake.inspiration}</p>
                </div>
              )}
              {intake.competitors && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Competitors</label>
                  <p className="mt-1 text-gray-900">{intake.competitors}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {intake.additionalNotes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{intake.additionalNotes}</p>
            </div>
          )}

          {/* Uploaded Files */}
          {intake.uploadedFiles && intake.uploadedFiles.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h2>
              <div className="space-y-2">
                {intake.uploadedFiles.map((file, index) => (
                  <a
                    key={index}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">{file.split("/").pop()}</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h2>
            <div className="space-y-2">
              {["pending", "in-progress", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating || intake.status === status}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    intake.status === status
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed capitalize`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Budget</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Timeline
                </label>
                <p className="mt-1 text-gray-900 capitalize">{intake.timeline}</p>
              </div>
              {intake.launchDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Target Launch</label>
                  <p className="mt-1 text-gray-900">{new Date(intake.launchDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Budget
                </label>
                <p className="mt-1 text-gray-900">{intake.budget}</p>
              </div>
            </div>
          </div>

          {/* Kickoff Call */}
          {(intake.preferredCallDate || intake.preferredCallTime) && (
            <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6">
              <h2 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Preferred Kickoff Call
              </h2>
              <div className="space-y-2">
                {intake.preferredCallDate && (
                  <div>
                    <label className="text-sm font-medium text-indigo-700">Date</label>
                    <p className="mt-1 text-indigo-900">{intake.preferredCallDate}</p>
                  </div>
                )}
                {intake.preferredCallTime && (
                  <div>
                    <label className="text-sm font-medium text-indigo-700">Time (EST)</label>
                    <p className="mt-1 text-indigo-900">{intake.preferredCallTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`mailto:${intake.email}`}
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Client
              </a>
              {intake.phone && (
                <a
                  href={`tel:${intake.phone}`}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Client
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
