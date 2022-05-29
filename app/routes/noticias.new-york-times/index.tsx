import { Link, useLoaderData } from "@remix-run/react";
import { getArticlesByNewsOrg } from "~/models/article.server";
import type { Article } from "~/models/article.server";
import { json } from "@remix-run/server-runtime";

type LoaderData = {
  articles: { slug: string; author: string; title: string }[];
};

export const loader = async () => {
  return json<LoaderData>({
    articles: await getArticlesByNewsOrg("new-york-times"),
  });
};

export default function NewYorkTimesIndex() {
  const { articles } = useLoaderData() as LoaderData;
  return (
    <main className="relative mx-auto min-h-[calc(100vh-5rem)] w-full max-w-screen-md bg-white pt-2 shadow sm:flex sm:justify-center">
      <ul className="w-full">
        {articles.map((article, i) => (
          <>
            <li key={article.slug}>
              <Link
                to={article.slug}
                className="flex flex-col items-center w-full py-6 group hover:text-gray-700"
              >
                <div>
                  <h2 className="w-[28ch] max-w-full text-left text-3xl font-bold group-hover:underline">
                    {article.title}
                  </h2>
                  <div className="flex items-center justify-start gap-2 px-2 py-1">
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
                </div>
              </Link>
            </li>
            {i < articles.length - 1 && <hr className="my-8" />}
          </>
        ))}
      </ul>
    </main>
  );
}
