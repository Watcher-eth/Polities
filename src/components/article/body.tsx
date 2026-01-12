// src/components/article/ArticleBody.tsx
import * as React from "react";
import { splitParagraphs } from "../../lib/utils/format";

export function ArticleBody({ body }: { body?: string | null }) {
  const ps = splitParagraphs(body);

  return (
    <section className="py-4">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {ps.length ? (
          ps.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="text-muted-foreground">
            No additional market context was provided.
          </p>
        )}
      </div>

      {/* NYT-ish subtle divider */}
      <div className="pt-6 border-t border-border" />
    </section>
  );
}