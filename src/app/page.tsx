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
      <section className="relative min-h-screen flex flex-col items-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-background to-background" />
        
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full">
          {/* Hero Artwork */}
          <div className="mb-8 animate-in-up">
            <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
              <ProtectedArtworkImage 
                src="/hero-artwork.png" 
                alt="ONWA Featured Artwork" 
                className="w-full h-auto object-contain max-h-[70vh]"
                watermarkText="ONWA · THE AFRICAN DIGITAL MUSEUM"
              />
            </div>
          </div>
          
          <div className="animate-in-up">
            <p className="label-caps text-muted-foreground mb-8">The African Digital Museum</p>
            <h1 className="museum-heading text-display-xl-mobile md:text-displayxl text-primary mb-8">
              ONWA
            </h1>
            <p className="museum-body text-body-lg md:text-body-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Onwa means Moon in Igbo. Preserve, celebrate, and reimagine African culture, 
              spirituality, traditions, heritage, history, kingdoms, folklore, architecture, 
              symbols, rituals, and everyday life through AI-assisted digital artwork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/museum"
                className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps"
              >
                Enter Museum
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 label-caps"
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
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-caps text-muted-foreground mb-4">Featured Collections</p>
            <h2 className="museum-heading text-headline-lg text-primary mb-6">
              Moon Cycles
            </h2>
            <p className="museum-body text-body-md text-muted-foreground max-w-2xl mx-auto">
              Our collections are organized by the phases of the moon, each representing different 
              aspects of African storytelling and spiritual wisdom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { phase: "New Moon", description: "Beginnings and creation stories" },
              { phase: "Waxing Crescent", description: "Growth and transformation" },
              { phase: "Full Moon", description: "Illumination and revelation" },
              { phase: "Waning Crescent", description: "Reflection and wisdom" },
            ].map((cycle, index) => (
              <div key={index} className="artwork-mat group cursor-pointer">
                <div className="aspect-square bg-surface-container-low mb-4 flex items-center justify-center group-hover:bg-surface-container transition-colors duration-300">
                  <div className="w-32 h-32 rounded-full border-2 border-border/20 group-hover:border-primary/40 transition-colors duration-300" />
                </div>
                <p className="label-caps text-muted-foreground mb-2">{cycle.phase}</p>
                <p className="museum-body text-body-md text-muted-foreground">{cycle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto text-center">
          <p className="label-caps text-muted-foreground mb-4">About ONWA</p>
          <h2 className="museum-heading text-headline-lg text-primary mb-8">
            A Digital Sanctuary for African Heritage
          </h2>
          <p className="museum-body text-body-lg text-muted-foreground mb-8">
            ONWA is more than a marketplace—it is a carefully curated digital museum where commerce 
            serves as a means of preservation. Every artwork tells a story, every collection honors 
            a tradition, and every purchase supports the continued celebration of African culture.
          </p>
          <p className="museum-body text-body-lg text-muted-foreground mb-12">
            Visitors are invited to explore in Museum Mode, where artwork fills the screen and stories 
            unfold with ambient audio and curator notes. For those who prefer a traditional browsing 
            experience, Gallery Mode offers a refined selection interface.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="label-caps text-muted-foreground mb-4">Stay Connected</p>
          <h2 className="museum-heading text-headline-lg text-primary mb-6">
            Join the Collector Circle
          </h2>
          <p className="museum-body text-body-md text-muted-foreground mb-8">
            Receive updates on new collections, exclusive drops, and insights into African 
            art and culture.
          </p>
          <NewsletterSubscribe buttonText="Subscribe" placeholder="Enter your email" source="home_page" />
        </div>
      </section>
    </main>
  );
}
