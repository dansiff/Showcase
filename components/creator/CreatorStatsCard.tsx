"use client";

type CreatorStatsCardProps = {
  postCount: number;
  subscriberCount: number;
  joinDate: Date;
};

export default function CreatorStatsCard({
  postCount,
  subscriberCount,
  joinDate,
}: CreatorStatsCardProps) {
  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Creator Stats</h3>
      
      <div className="space-y-4">
        {/* Posts Count */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="text-lg">📝</span>
            Posts
          </span>
          <span className="font-bold text-lg">{postCount}</span>
        </div>

        {/* Subscribers Count */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="text-lg">👥</span>
            Subscribers
          </span>
          <span className="font-bold text-lg text-purple-400">
            {formatSubscriberCount(subscriberCount)}
          </span>
        </div>

        {/* Join Date */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="text-lg">📅</span>
            Joined
          </span>
          <span className="font-semibold">{formatJoinDate(joinDate)}</span>
        </div>

        {/* Response Time (optional) */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2">
            <span className="text-lg">⚡</span>
            Response Time
          </span>
          <span className="font-semibold text-green-400">~2h</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>✓</span>
          <span>Verified Creator</span>
        </div>
      </div>
    </div>
  );
}
