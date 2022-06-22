import {
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useParams,
} from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import {
  getRepresentativeByUserIdWithOrg,
  isNewsRepresentative,
} from "~/models/representative.server";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { newsId } = params;

  const user = await authenticator.isAuthenticated(request);
  if (!user) return json({ author: false });
  const userRep = await getRepresentativeByUserIdWithOrg(user.id);
  if (
    userRep &&
    isNewsRepresentative(userRep) &&
    userRep.newsOrgId === newsId
  ) {
    return json({ author: true });
  }
  return json({ author: false });
};

export default function NewsOrg() {
  const matches = useMatches();
  const indexPage =
    matches[matches.length - 1].id === "routes/noticias.$newsId/index";
  const newArticlePage =
    matches[matches.length - 1].id === "routes/noticias.$newsId/nova";
  const { newsId } = useParams();

  const { author } = useLoaderData();

  return (
    <div className="min-h-screen font-serif bg-gray-50">
      <nav
        className={`h- fixed top-0 z-50 flex w-full items-center justify-between ${
          newsId === "kolnische-zeitung" ? "h-28" : "h-20"
        } border-b border-b-black bg-white shadow-md`}
      >
        <Link
          to={indexPage ? "/noticias/" : `/noticias/${newsId}`}
          className="flex items-center justify-center h-full px-8 hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={4}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <Link
          to={`/noticias/${newsId}/`}
          className="flex items-center h-full py-2"
        >
          <img
            className="h-full"
            src={`/images/${newsId}/full.jpg`}
            alt={`${newsId} logo`}
          />
        </Link>
        {author && !newArticlePage ? (
          <Link
            to={`/noticias/${newsId}/nova`}
            className="flex items-center justify-center h-full px-8 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        ) : (
          <div className="h-12 w-[5.5rem]"></div>
        )}
      </nav>
      <div className={newsId === "kolnische-zeitung" ? "h-28" : "h-20"} />
      <Outlet />
    </div>
  );
}
