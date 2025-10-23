import Link from "next/link";

type CaseStudy = {
  slug: string;
  title: string;
  company: string;
  summary: string;
  badges: string[];
};

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "gazam",
    title: "EHR/EMR SaaS",
    company: "Gazam",
    summary:
      "Full-stack pain clinic software with Azure hosting, Twilio video, automated intake, and data migration for multi-clinic subscription model.",
    badges: ["React", "Azure", "Twilio", "EHR"],
  },
  {
    slug: "bluesky-telepsych",
    title: "Telepsychiatry Platform",
    company: "Bluesky Telepsych",
    summary:
      "Custom EHR/EMR on AWS with live video, automated billing, and offshore team management. Site migration from WordPress to Wix.",
    badges: ["AWS", "Twilio", "DevOps", "HIPAA"],
  },
  {
    slug: "independent-creator",
    title: "Creator platform (in progress)",
    company: "Independent Creator",
    summary:
      "Custom profile, subscription tiers, and gated posts—powered by our creator platform.",
    badges: ["Subscriptions", "Stripe", "Supabase"],
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1] md:py-20">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-12 text-center">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Case studies
          </h2>
          <p className="text-lg text-indigo-200/65">
            A few real collaborations and an active creator build—focused on outcomes over hype.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((cs) => (
            <article key={cs.slug} className="relative rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-100">{cs.company}</h3>
                  <span className="text-xs text-gray-400">{cs.title}</span>
                </div>
                <p className="text-indigo-200/75">{cs.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {cs.badges.map((b) => (
                    <span key={b} className="rounded-full border border-indigo-700/50 bg-indigo-900/20 px-2 py-0.5 text-xs text-indigo-200">
                      {b}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Read case study →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
