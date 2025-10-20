import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
// Inline fallback for CreatorProfileView to avoid missing module during development.
// Replace this with a dedicated ./CreatorProfileView component file when available.
const CreatorProfileView = ({ creator, posts, subscriptionPlans }: { creator: any; posts: any[]; subscriptionPlans: any[] }) => {
  return (
    <div>
      <header>
        <h1>{creator?.name || 'Unknown Creator'}</h1>
        {creator?.profile?.bio && <p>{creator.profile.bio}</p>}
      </header>

      <section>
        <h2>Posts ({posts?.length || 0})</h2>
        {(!posts || posts.length === 0) ? (
          <div style={{ color: '#888', padding: '1rem' }}>No posts yet. Check back soon!</div>
        ) : (
          <ul>
            {posts.map((post: any) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Subscription Plans ({subscriptionPlans?.length || 0})</h2>
        {(!subscriptionPlans || subscriptionPlans.length === 0) ? (
          <div style={{ color: '#888', padding: '1rem' }}>No subscription plans available.</div>
        ) : (
          <ul>
            {subscriptionPlans.map((plan: any) => (
              <li key={plan.id}>
                {plan.name} — {plan.priceCents != null ? `$${(plan.priceCents / 100).toFixed(2)}` : 'Free'}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};



export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const creator = await (prisma as any).user.findFirst({
    where: { 
      name: { equals: params.username, mode: 'insensitive' }
    },
    include: {
      profile: true
    }
  });

  if (!creator) {
    return { 
      title: 'Creator Not Found',
      description: 'The creator you are looking for does not exist.'
    };
  }

  return {
    title: `${creator.name} - Creator Profile`,
    description: creator.profile?.bio || `Subscribe to ${creator.name}'s exclusive content`,
    openGraph: {
      title: creator.name,
      description: creator.profile?.bio || '',
      images: creator.image ? [creator.image] : [],
    },
  };
}

export default async function CreatorPage({ params }: { params: { username: string } }) {
  // Fetch creator data with profile
  const creator = await (prisma as any).user.findFirst({
    where: { 
      name: { equals: params.username, mode: 'insensitive' }
    },
    include: {
      profile: true,
    },
  });

  if (!creator) {
    notFound();
  }

  // Fetch creator's posts
  const posts = await (prisma as any).post.findMany({
    where: { 
      authorId: creator.id,
      isPublished: true
    },
    include: {
      likes: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Fetch subscription plans if creator
  const subscriptionPlans = await (prisma as any).plan.findMany({
    where: {
      creator: {
        userId: creator.id
      },
      isActive: true
    },
    orderBy: { priceCents: 'asc' }
  });

  return (
    <CreatorProfileView 
      creator={creator} 
      posts={posts}
      subscriptionPlans={subscriptionPlans}
    />
  );
}
