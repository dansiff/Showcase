import VideoThumb from "@/public/images/hero-image-01.jpg";
import ModalVideo from "@/components/modal-video";
import PortalLink from "@/components/PortalLink";

export default function HeroHome() {
    return (
        <section>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                {/* Hero content */}
                <div className="py-12 md:py-20">
                    {/* Section header */}
                    <div className="pb-12 text-center md:pb-20">
                        <h1
                            className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
                            data-aos="fade-up"
                        >
                            AI-driven tools with direct support from an experienced developer.
                        </h1>

                        <div className="mx-auto max-w-3xl">
                            <p
                                className="mb-8 text-xl text-indigo-200/65"
                                data-aos="fade-up"
                                data-aos-delay={200}
                            >
                                Our marketing page options work on all devices, empowering you to focus on your business.
                                Get the benefits of advanced marketing and application support without the heavy cost.
                            </p>

                            <div className="mx-auto flex flex-col sm:flex-row sm:justify-center gap-4 max-w-sm sm:max-w-none">
                                {/* Portal Link - shows "Sign In" or "Go to Portal" based on auth state */}
                                <div data-aos="fade-up" data-aos-delay={300}>
                                    <PortalLink />
                                </div>

                                {/* Stripe Checkout CTA */}
                                <a
                                    data-aos="fade-up"
                                    data-aos-delay={400}
                                    href="https://buy.stripe.com/dRmdR8fpf4XFaaTe2cdIA01"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn group w-full sm:w-auto bg-gradient-to-t from-indigo-600 to-indigo-500 text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                                >
                                    <span className="relative inline-flex items-center">
                                        Start with a quote today
                                        <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                                            -&gt;
                                        </span>
                                    </span>
                                </a>

                                {/* Optional pricing section link */}
                                <a
                                    data-aos="fade-up"
                                    data-aos-delay={600}
                                    href="/pricing"
                                    className="btn w-full sm:w-auto bg-gradient-to-b from-gray-800 to-gray-800/60 text-gray-300 hover:bg-[length:100%_150%] border border-transparent rounded-[inherit]"
                                >
                                    View pricing plans
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Modal Video */}
                    <ModalVideo
                        thumb={VideoThumb}
                        thumbWidth={1104}
                        thumbHeight={576}
                        thumbAlt="Modal video thumbnail"
                        video="https://www.youtube.com/embed/yXEZSXBTcVw?si=51xOdQw3UCurJWaq"
                        videoWidth={1920}
                        videoHeight={1080}
                        videoType="youtube"
                    />
                </div>
            </div>
        </section>
    );
}
