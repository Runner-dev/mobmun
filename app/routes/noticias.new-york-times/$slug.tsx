import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import sanitizer from "sanitizer";
import invariant from "tiny-invariant";
import type { Article } from "~/models/article.server";
import { getArticleBySlug } from "~/models/article.server";

type LoaderData = {
  article: Article;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(typeof params.slug === "string", "slug must be a string");
  const article = await getArticleBySlug(params.slug);
  if (!article) throw new Response("Article Not Found", { status: 404 });
  const sanitizedContent = sanitizer.sanitize(article.content);
  return json<LoaderData>({
    article: {
      ...article,
      content: sanitizedContent,
    },
  });
};

export default function NYTArticle() {
  const { article } = useLoaderData() as LoaderData;

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-max max-w-[80ch] bg-white p-8 font-serif shadow-md">
      <h1 className="text-4xl font-bold text-justify max-w-prose">
        {article.title}
      </h1>
      <div className="flex items-center justify-start gap-2 py-2 mx-auto max-w-prose">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        {article.author}
      </div>
      <div
        className="mx-auto mt-4 prose max-w-prose prose-p:text-justify prose-p:text-lg"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </main>
  );
}
