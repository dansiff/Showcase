// app/creator/content/upload/page.tsx
// Creator portal: upload new content

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      isPremium: formData.get("isPremium") === "on",
      isPublished: formData.get("isPublished") === "on",
      // Note: File upload would go here in production
      imageUrl: null,
      videoUrl: null,
    };

    try {
      const res = await fetch("/api/creator/content/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create post");
      }

      // Redirect to library on success
      router.push("/creator/content/library");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Upload Content
              </h1>
              <p className="mt-1 text-gray-600">
                Share your latest creation with your audience
              </p>
            </div>
            <Link
              href="/creator/dashboard"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Give your post a catchy title..."
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="What's on your mind?"
              required
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Images: PNG, JPG up to 10MB • Videos: MP4, MOV up to 100MB
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="inline-block mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* Post Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Post Settings
            </h3>

            {/* Premium Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <label htmlFor="isPremium" className="font-medium text-gray-900">
                  Premium Content
                </label>
                <p className="text-sm text-gray-600">
                  Require subscription to view this post
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isPremium"
                  name="isPremium"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="isPublished" className="font-medium text-gray-900">
                  Publish Now
                </label>
                <p className="text-sm text-gray-600">
                  Make this post visible immediately
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/creator/dashboard"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 bg-indigo-50 rounded-xl p-6">
          <h3 className="font-semibold text-indigo-900 mb-2">💡 Tips for Great Content</h3>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Use eye-catching visuals to grab attention</li>
            <li>• Write engaging captions that tell a story</li>
            <li>• Post consistently to keep your audience engaged</li>
            <li>• Interact with your fans in the comments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
