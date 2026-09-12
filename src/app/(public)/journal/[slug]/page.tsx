import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface JournalSlugProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: JournalSlugProps): Promise<Metadata> {
  const article = await prisma.journal.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true },
  });

  return {
    title: article ? `${article.title} | Journal | ONWA` : "Journal | ONWA",
    description: article?.excerpt || "Read cultural narratives and essays on African heritage on ONWA Journal.",
  };
}

export default async function JournalArticlePage({ params }: JournalSlugProps) {
  const article = await prisma.journal.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <article className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <Link href="/journal" className="text-xs label-caps text-muted-foreground hover:text-primary transition-colors">
            ← Return to Journal
          </Link>
        </div>

        <header className="mb-12">
          {article.category && (
            <p className="label-caps text-xs text-primary mb-4">{article.category}</p>
          )}
          <h1 className="museum-heading text-headline-lg md:text-display-xl-mobile text-primary mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-border/20 pb-6">
            <span>By {article.author}</span>
            <span>·</span>
            <span>{article.readTime ? `${article.readTime} min read` : "5 min read"}</span>
            <span>·</span>
            <span>{new Date(article.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </header>

        {article.coverImage && (
          <div className="aspect-[16/9] mb-12 overflow-hidden rounded bg-black/40">
            <img src={article.coverImage} alt={article.coverImageAlt || article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-base md:text-lg space-y-6">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  );
}