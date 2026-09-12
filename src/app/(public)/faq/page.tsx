import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - ONWA",
  description: "Frequently asked questions about ONWA - African Digital Museum, artwork collections, and membership.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is ONWA?",
      answer: "ONWA is a luxury digital museum dedicated to the preservation, celebration, and reimagining of African culture through AI-assisted digital artwork. We bridge traditional African artistry with cutting-edge technology to create immersive digital experiences."
    },
    {
      question: "How can I purchase artwork?",
      answer: "Artwork can be purchased through our Gallery or Collections pages. Each artwork listing includes pricing, available resolutions, and licensing options. We accept payments through Lemon Squeezy and Paystack for secure transactions."
    },
    {
      question: "What resolutions are available?",
      answer: "We offer various resolution options for each artwork, typically ranging from standard web resolution to high-resolution prints suitable for large-format displays. Each artwork's available resolutions and pricing are listed on its detail page."
    },
    {
      question: "What license types do you offer?",
      answer: "We offer Personal and Commercial license options. Personal licenses are for personal use and display, while Commercial licenses allow for commercial use and redistribution. Specific terms are detailed during the purchase process."
    },
    {
      question: "How are downloads delivered?",
      answer: "After purchase, you'll receive secure download links via email. Downloads are delivered through signed URLs for security and are available for a limited time. High-resolution files may take longer to download depending on your internet connection."
    },
    {
      question: "Can I use artwork for commercial purposes?",
      answer: "Yes, but you need to purchase a Commercial license. Personal licenses do not permit commercial use. Commercial licenses allow you to use the artwork in business projects, marketing materials, and commercial products."
    },
    {
      question: "Do you offer refunds?",
      answer: "Due to the digital nature of our products, we generally do not offer refunds once artwork has been downloaded. However, if you experience technical issues with your download, please contact our support team for assistance."
    },
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign In' button in the header to create an account using Clerk authentication. You can sign up with email or use social authentication options. Having an account allows you to track your purchases and manage your collection."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept payments through Lemon Squeezy and Paystack, supporting various payment methods including credit/debit cards, and regional payment options depending on your location."
    },
    {
      question: "Can I commission custom artwork?",
      answer: "Currently, we focus on our curated collections. For custom artwork inquiries, please contact us through our About page. We may offer commission services in the future."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="museum-heading text-5xl md:text-7xl text-primary mb-6">
              FAQ
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Frequently Asked Questions
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border/20 rounded-lg bg-card overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                      <h3 className="museum-heading text-lg text-primary pr-4">
                        {faq.question}
                      </h3>
                      <svg
                        className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="museum-heading text-3xl md:text-4xl text-primary mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find the answer you're looking for? Please reach out to our team.
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
