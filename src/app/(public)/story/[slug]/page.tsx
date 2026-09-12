import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface StorySlugProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: StorySlugProps): Promise<Metadata> {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true },
  });

  return {
    title: story ? `${story.title} | Folklore & History | ONWA` : "Story | ONWA",
    description: story?.excerpt || "Sacred African stories, folklore, and historical narratives.",
  };
}

export default async function StoryPage({ params }: StorySlugProps) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <article className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <Link href="/museum" className="text-xs label-caps text-muted-foreground hover:text-primary transition-colors">
            ← Return to Museum
          </Link>
        </div>

        <header className="mb-12">
          <p className="label-caps text-xs text-muted-foreground mb-3">
            {[story.region, story.country, story.ethnicGroup].filter(Boolean).join(" · ")}
          </p>
          <h1 className="museum-heading text-headline-lg md:text-display-xl-mobile text-primary mb-6">
            {story.title}
          </h1>
          {story.era && (
            <p className="text-sm text-primary/80 font-mono mb-4">Historical Era: {story.era}</p>
          )}
        </header>

        {story.coverImage && (
          <div className="aspect-[16/9] mb-12 overflow-hidden rounded bg-black/40">
            <img src={story.coverImage} alt={story.coverImageAlt || story.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-base md:text-lg space-y-6">
          {story.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  );
}