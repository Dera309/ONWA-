import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | ONWA - African Digital Museum",
  description: "Connect with the ONWA Curatorial Office for acquisitions, collaborations, and inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-16">
          <p className="label-caps text-muted-foreground mb-4">Curatorial Inquiries</p>
          <h1 className="museum-heading text-headline-lg md:text-display-xl-mobile text-primary mb-6">
            Connect with ONWA
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground max-w-xl mx-auto">
            Whether inquiring about acquisitions, institutional curation, or cultural preservation partnerships, our curators welcome your dialogue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="artwork-mat p-8 text-center space-y-3">
            <p className="label-caps text-xs text-muted-foreground">Direct Desk</p>
            <h3 className="museum-heading text-headline-sm text-primary">Inquiries</h3>
            <p className="text-sm text-muted-foreground">hello@onwa.art</p>
          </div>
          <div className="artwork-mat p-8 text-center space-y-3">
            <p className="label-caps text-xs text-muted-foreground">Acquisitions</p>
            <h3 className="museum-heading text-headline-sm text-primary">Collectors</h3>
            <p className="text-sm text-muted-foreground">curator@onwa.art</p>
          </div>
          <div className="artwork-mat p-8 text-center space-y-3">
            <p className="label-caps text-xs text-muted-foreground">Press & Global</p>
            <h3 className="museum-heading text-headline-sm text-primary">Media</h3>
            <p className="text-sm text-muted-foreground">press@onwa.art</p>
          </div>
        </div>

        <div className="artwork-mat p-8 md:p-12 border border-border/30">
          <h2 className="museum-heading text-headline-md text-primary mb-6">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label-caps text-xs text-muted-foreground">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-surface-container-low border border-border/40 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="label-caps text-xs text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="collector@domain.com"
                  className="w-full bg-surface-container-low border border-border/40 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-caps text-xs text-muted-foreground">Subject</label>
              <input
                type="text"
                required
                placeholder="Acquisition inquiry, Press, or Curation"
                className="w-full bg-surface-container-low border border-border/40 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="label-caps text-xs text-muted-foreground">Message</label>
              <textarea
                rows={5}
                required
                placeholder="Share your inquiry or thoughts with our curatorial team..."
                className="w-full bg-surface-container-low border border-border/40 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
            >
              Transmit Inquiry
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}