'use client';

import CreatorCard from './CreatorCard';

type Creator = any;

export default function CreatorListClient({ creators }: { creators: Creator[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((c) => (
        <div key={c.id}>
          <CreatorCard creator={c} />
        </div>
      ))}
    </div>
  );
}
