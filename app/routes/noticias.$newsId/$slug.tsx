import { Link, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import draftToHtml from "draftjs-to-html";
import invariant from "tiny-invariant";
import { Article, updateArticle } from "~/models/article.server";
import { getArticleBySlug } from "~/models/article.server";
import {
  getRepresentativeByUserIdWithOrg,
  isNewsRepresentative,
} from "~/models/representative.server";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  article: Article;
  author: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(typeof params.slug === "string", "slug must be a string");
  const article = await getArticleBySlug(params.slug);
  if (!article) throw new Response("Article Not Found", { status: 404 });
  const content = draftToHtml(JSON.parse(article.content));

  const { newsId } = params;

  const user = await authenticator.isAuthenticated(request);
  if (!user) return json({ author: false });
  const userRep = await getRepresentativeByUserIdWithOrg(user.id);
  console.log(userRep);
  const author = !!(
    userRep &&
    isNewsRepresentative(userRep) &&
    userRep.newsOrgId === newsId
  );

  return json<LoaderData>({
    article: {
      ...article,
      content,
    },
    author,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const newsId = params.newsId;
  const slug = params.slug;
  const formData = await request.formData();
  const richText = formData.get("richText");
  const title = formData.get("title");
  const author = formData.get("author");

  invariant(typeof newsId === "string", "newsId must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof author === "string", "author must be a string");
  invariant(typeof richText === "string", "richText must be a string");

  const article = await updateArticle({
    title,
    author,
    newsOrg: newsId,
    content: richText,
    slug,
  });

  return redirect(`/noticias/${newsId}/${article.slug}`);
};

export default function NYTArticle() {
  const { article, author } = useLoaderData() as LoaderData;

  return (
    <main className="relative mx-auto  min-h-[calc(100vh-5rem)] w-full max-w-screen-md flex-col bg-white p-8 shadow">
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
        className="mx-auto mt-4 prose prose-p:text-justify prose-p:text-lg"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      {author && (
        <Link
          className="block p-4 mx-auto my-8 text-center text-white bg-black max-w-prose"
          to={"editar"}
        >
          Editar
        </Link>
      )}
    </main>
  );
}
