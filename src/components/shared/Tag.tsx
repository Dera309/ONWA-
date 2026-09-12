import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 border border-border/20 text-xs label-caps text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
