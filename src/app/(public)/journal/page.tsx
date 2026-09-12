"use client";

import { NewsletterSubscribe } from "@/components/shared/NewsletterSubscribe";

export default function JournalPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="museum-heading text-5xl md:text-7xl text-primary mb-6">
              Journal
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Stories, Insights, and Creative Journeys
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h2 className="museum-heading text-3xl md:text-4xl text-primary mb-6">
              Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our journal is currently being curated with stories about African art, artist interviews, 
              behind-the-scenes insights into our creative process, and explorations of cultural themes 
              that inspire our digital artwork collections.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 border border-border/20 rounded-lg bg-card">
                <h3 className="museum-heading text-lg text-primary mb-3">Artist Stories</h3>
                <p className="text-sm text-muted-foreground">
                  Interviews and profiles of contemporary African artists and their creative journeys.
                </p>
              </div>
              <div className="p-6 border border-border/20 rounded-lg bg-card">
                <h3 className="museum-heading text-lg text-primary mb-3">Cultural Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Deep dives into African cultural traditions, symbolism, and artistic heritage.
                </p>
              </div>
              <div className="p-6 border border-border/20 rounded-lg bg-card">
                <h3 className="museum-heading text-lg text-primary mb-3">Creative Process</h3>
                <p className="text-sm text-muted-foreground">
                  Behind-the-scenes looks at how our digital artwork collections are created.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="museum-heading text-3xl md:text-4xl text-primary mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be the first to know when we launch our journal with new stories and insights.
            </p>
            <NewsletterSubscribe
              buttonText="Subscribe"
              placeholder="Enter your email"
              source="journal_page"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
