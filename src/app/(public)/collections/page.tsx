import { Metadata } from "next";
import { moonPhases } from "@/config/moon-phases";

export const metadata: Metadata = {
  title: "Collections | ONWA",
  description: "Explore ONWA's collections organized by moon cycles. Each collection represents a different phase of African storytelling and spiritual wisdom.",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Collections Header */}
      <section className="py-16 px-4 border-b border-border/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="label-caps text-muted-foreground mb-4">Collections</p>
            <h1 className="museum-heading text-headline-lg text-primary mb-6">
              Moon Cycles
            </h1>
            <p className="museum-body text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Our collections are organized by the phases of the moon, each representing 
              different aspects of African storytelling and spiritual wisdom.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {moonPhases.map((phase) => (
              <div key={phase.id} className="artwork-mat group cursor-pointer">
                <div className="aspect-square bg-surface-container-low mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="w-32 h-32 rounded-full border-2 border-border/20 group-hover:border-primary/40 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="label-caps text-muted-foreground mb-2">{phase.name}</p>
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  {phase.name}
                </h3>
                <p className="museum-body text-body-md text-muted-foreground">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
