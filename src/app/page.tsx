import { Metadata } from "next";
import Link from "next/link";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";
import { NewsletterSubscribe } from "@/components/shared/NewsletterSubscribe";

export const metadata: Metadata = {
  title: "ONWA - The African Story",
  description: "Enter a luxury digital museum dedicated to African storytelling through AI-assisted digital art. Onwa means Moon in Igbo.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center pt-28 md:pt-36 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-background to-background" />
        
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full">
          {/* Hero Artwork */}
          <div className="mb-8 animate-in-up">
            <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
              <ProtectedArtworkImage 
                src="/hero-artwork.png" 
                alt="ONWA Featured Artwork" 
                className="w-full h-auto object-contain max-h-[60vh] md:max-h-[70vh]"
                watermarkText="ONWA · THE AFRICAN DIGITAL MUSEUM"
              />
            </div>
          </div>
          
          <div className="animate-in-up">
            <p className="label-caps text-muted-foreground mb-4 md:mb-8 text-xs">The African Digital Museum</p>
            <h1 className="museum-heading text-display-xl-mobile md:text-display-xl text-primary mb-6 md:mb-8">
              ONWA
            </h1>
            <p className="museum-body text-base md:text-body-lg text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12">
              Onwa means Moon in Igbo. Preserve, celebrate, and reimagine African culture, 
              spirituality, traditions, heritage, history, kingdoms, folklore, architecture, 
              symbols, rituals, and everyday life through AI-assisted digital artwork.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link
                href="/museum"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs sm:text-sm"
              >
                Enter Museum
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 label-caps text-xs sm:text-sm"
              >
                Browse Gallery
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
        </div>
      </section>

      {/* Featured Collections Preview */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="label-caps text-muted-foreground mb-3">Featured Collections</p>
            <h2 className="museum-heading text-2xl md:text-headline-lg text-primary mb-4 md:mb-6">
              Moon Cycles
            </h2>
            <p className="museum-body text-sm md:text-body-md text-muted-foreground max-w-2xl mx-auto">
              Our collections are organized by the phases of the moon, each representing different 
              aspects of African storytelling and spiritual wisdom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                phase: "New Moon",
                description: "Beginnings and creation stories",
                image: "/images/lunar/new-moon.svg",
              },
              {
                phase: "Waxing Crescent",
                description: "Growth and transformation",
                image: "/images/lunar/waxing-crescent.svg",
              },
              {
                phase: "Full Moon",
                description: "Illumination and revelation",
                image: "/images/lunar/full-moon.svg",
              },
              {
                phase: "Waning Crescent",
                description: "Reflection and wisdom",
                image: "/images/lunar/waning-crescent.svg",
              },
            ].map((cycle, index) => (
              <Link
                key={index}
                href="/collections"
                className="artwork-mat group cursor-pointer block hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-square bg-surface-container-low mb-4 flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-surface-container transition-colors duration-300">
                  <img
                    src={cycle.image}
                    alt={cycle.phase}
                    className="w-28 sm:w-36 h-28 sm:h-36 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="label-caps text-primary text-xs font-semibold">{cycle.phase}</p>
                  <span className="text-[10px] label-caps text-muted-foreground group-hover:text-primary transition-colors">
                    View &rarr;
                  </span>
                </div>
                <p className="museum-body text-sm md:text-body-md text-muted-foreground">{cycle.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 px-4 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto text-center">
          <p className="label-caps text-muted-foreground mb-3">About ONWA</p>
          <h2 className="museum-heading text-2xl md:text-headline-lg text-primary mb-6 md:mb-8">
            A Digital Sanctuary for African Heritage
          </h2>
          <p className="museum-body text-base md:text-body-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
            ONWA is more than a marketplace—it is a carefully curated digital museum where commerce 
            serves as a means of preservation. Every artwork tells a story, every collection honors 
            a tradition, and every purchase supports the continued celebration of African culture.
          </p>
          <p className="museum-body text-base md:text-body-lg text-muted-foreground mb-8 md:mb-12 leading-relaxed">
            Visitors are invited to explore in Museum Mode, where artwork fills the screen and stories 
            unfold with ambient audio and curator notes. For those who prefer a traditional browsing 
            experience, Gallery Mode offers a refined selection interface.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs sm:text-sm"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="label-caps text-muted-foreground mb-3">Stay Connected</p>
          <h2 className="museum-heading text-2xl md:text-headline-lg text-primary mb-4 md:mb-6">
            Join the Collector Circle
          </h2>
          <p className="museum-body text-sm md:text-body-md text-muted-foreground mb-8">
            Receive updates on new collections, exclusive drops, and insights into African 
            art and culture.
          </p>
          <NewsletterSubscribe buttonText="Subscribe" placeholder="Enter your email" source="home_page" />
        </div>
      </section>
    </main>
  );
}
