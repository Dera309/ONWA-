import { Metadata } from "next";
import { getCurrentMoonPhase } from "@/config/moon-phases";
import { AmbientAudioPlayer } from "@/components/shared/AmbientAudioPlayer";

export const metadata: Metadata = {
  title: "Museum Mode | ONWA",
  description: "Experience ONWA in Museum Mode - an immersive, full-screen journey through African digital art with ambient audio and curator notes.",
};

export default function MuseumPage() {
  const currentPhase = getCurrentMoonPhase();

  return (
    <main className="min-h-screen bg-background">
      {/* Museum Mode Header */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-background to-background" />
        
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <div className="animate-in-up">
            <p className="label-caps text-muted-foreground mb-8">Museum Mode</p>
            <h1 className="museum-heading text-display-xl-mobile md:text-display-xl text-primary mb-8">
              {currentPhase.name}
            </h1>
            <p className="museum-body text-body-lg md:text-body-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              {currentPhase.description}
            </p>
            <div className="flex items-center justify-center space-x-8 mb-16">
              <div className="text-center">
                <p className="text-4xl md:text-6xl text-primary mb-2">{currentPhase.icon}</p>
                <p className="label-caps text-muted-foreground">Current Phase</p>
              </div>
            </div>
            <button className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps">
              Enter Exhibition
            </button>
          </div>
        </div>
      </section>

      {/* Featured Artwork */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="artwork-mat">
              <div className="aspect-[4/5] bg-surface-container-low flex items-center justify-center">
                <div className="text-center">
                  <p className="label-caps text-muted-foreground mb-4">Featured Artwork</p>
                  <p className="museum-body text-body-md text-muted-foreground">
                    The Moon Queen
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <p className="label-caps text-muted-foreground mb-4">Curator's Note</p>
                <h2 className="museum-heading text-headline-lg text-primary mb-6">
                  The Moon Queen
                </h2>
                <p className="museum-body text-body-lg text-muted-foreground leading-relaxed">
                  This artwork explores Yoruba spirituality and lunar symbolism, 
                  representing the divine feminine energy that governs the night sky. 
                  The Moon Queen is both a protector and a guide, illuminating the 
                  path for those who seek wisdom in darkness.
                </p>
              </div>
              
              <div>
                <p className="label-caps text-muted-foreground mb-4">Historical Context</p>
                <p className="museum-body text-body-md text-muted-foreground leading-relaxed">
                  In Yoruba cosmology, the moon (Ọsùpá) is associated with various 
                  deities and represents the cyclical nature of time, fertility, and 
                  spiritual renewal. This piece draws from centuries of oral tradition 
                  and visual symbolism.
                </p>
              </div>

              <div>
                <p className="label-caps text-muted-foreground mb-4">Spiritual Meaning</p>
                <p className="museum-body text-body-md text-muted-foreground leading-relaxed">
                  The Moon Queen embodies the balance between light and darkness, 
                  wisdom and mystery. She reminds us that even in the darkest nights, 
                  there is always illumination to be found for those who seek it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambient Audio Control */}
      <AmbientAudioPlayer
        variant="floating"
        title={`${currentPhase.name} · Lunar Atmosphere`}
      />
    </main>
  );
}
