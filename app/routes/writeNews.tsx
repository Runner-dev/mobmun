import { Form } from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

import reactQuillCssUrl from "react-quill/dist/quill.snow.css";
import invariant from "tiny-invariant";
import Navbar from "~/components/Navbar";
import RichText from "~/components/RichText";
import { createArticle } from "~/models/article.server";
import { slugify } from "~/utils";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: reactQuillCssUrl }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const content = formData.get("richtext");
  const author = formData.get("author");
  const newsOrg = formData.get("newsOrg");
  const title = formData.get("title");
  invariant(typeof content === "string", "content must be a string");
  invariant(typeof author === "string", "author must be a string");
  invariant(typeof newsOrg === "string", "newsOrg must be a string");
  invariant(typeof title === "string", "title must be a string");
  const slug = slugify(title);
  const data = {
    content,
    author,
    newsOrg,
    title,
    slug,
  };
  const article = await createArticle(data);
  return redirect(`/noticias/${article.newsOrg}/${article.slug}`);
};

export default function MyComponent() {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-md mx-auto my-4 ">
        <Form method="post" className="flex flex-col gap-2">
          <h1 className="mb-8 text-4xl text-center">Nova Notícia</h1>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              type="text"
              placeholder="Nome do autor"
              name="author"
              className="flex-grow"
              required
            />
            <div className="flex items-center gap-4 px-4 border border-gray-400 rounded-sm">
              <div>Jornal:</div>
              <label className="flex items-center h-full gap-2">
                <input
                  type="radio"
                  name="newsOrg"
                  value="new-york-times"
                  required
                />
                New York Times
              </label>
              <label className="flex items-center h-full gap-2 ">
                <input type="radio" name="newsOrg" value="new-york-times" />{" "}
                Sputnik
              </label>
            </div>
          </div>
          <hr className="my-4" />
          <input
            type="text"
            name="title"
            placeholder="Título da notícia"
            required
          />
          <RichText height="h-96" />
          <button className="px-8 py-4 my-4 bg-gray-300" type="submit">
            Enviar Notícia
          </button>
        </Form>
      </main>
    </>
  );
}
