import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - ONWA",
  description: "Learn about ONWA - African Digital Museum dedicated to preserving, celebrating, and reimagining African culture through AI-assisted digital artwork.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="museum-heading text-5xl md:text-7xl text-primary mb-6">
              About ONWA
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Preserving African Heritage Through Digital Innovation
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="museum-heading text-3xl md:text-4xl text-primary mb-8">
              Our Mission
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                ONWA is a luxury digital museum dedicated to the preservation, celebration, and reimagining of African culture. 
                Through the intersection of traditional African artistry and cutting-edge AI technology, we create immersive 
                digital experiences that honor the continent's rich artistic heritage while pushing the boundaries of creative expression.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to make African art accessible to a global audience, supporting contemporary artists while 
                preserving traditional techniques and stories for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="museum-heading text-3xl md:text-4xl text-primary mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border border-border/20 rounded-lg bg-card">
                <h3 className="museum-heading text-xl text-primary mb-3">Preservation</h3>
                <p className="text-muted-foreground">
                  Digitally preserving African art forms, techniques, and cultural narratives that might otherwise be lost to time.
                </p>
              </div>
              <div className="p-6 border border-border/20 rounded-lg bg-card">
                <h3 className="museum-heading text-xl text-primary mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  Embracing AI and digital technologies to create new forms of artistic expression while respecting traditional methods.
                </p>
              </div>
              <div className="p-6 border border-border/20 rounded-lg bg-card">
                <h3 className="museum-heading text-xl text-primary mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making African art accessible to everyone, everywhere, through digital platforms and immersive experiences.
                </p>
              </div>
              <div className="p-6 border border-border/20 rounded-lg bg-card">
                <h3 className="museum-heading text-xl text-primary mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Building a global community of artists, collectors, and enthusiasts who share a passion for African culture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="museum-heading text-3xl md:text-4xl text-primary mb-8">
              Our Story
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                ONWA was born from a vision to bridge the gap between ancient African artistic traditions and the digital future. 
                We recognized that while African art has influenced global culture for centuries, much of its depth and diversity 
                remains underrepresented in the digital art space.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                By collaborating with African artists, historians, and technologists, we've created a platform that not only 
                showcases digital artwork but also tells the stories behind each piece—the cultural significance, the traditional 
                techniques that inspired it, and the spiritual meanings embedded within.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every artwork in our collection is a dialogue between past and present, a testament to the enduring power of 
                African creativity to evolve and inspire across generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="museum-heading text-3xl md:text-4xl text-primary mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Interested in collaborating, collecting, or learning more about our work?
            </p>
            <a
              href="mailto:hello@onwa.art"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors label-caps"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
