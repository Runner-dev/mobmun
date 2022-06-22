import { TextField } from "@mui/material";
import { useState } from "react";
import RichText, { richTextCssUrl } from "~/components/RichText";
import richTextOverrides from "~/compiledStyles/richTextOverrides.css";
import { createArticle } from "~/models/article.server";
import invariant from "tiny-invariant";
import { slugify, useUser } from "~/utils";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { Form } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: richTextCssUrl,
    },
    {
      rel: "stylesheet",
      href: richTextOverrides,
    },
  ];
};

export const action: ActionFunction = async ({ request, params }) => {
  const newsId = params.newsId;
  const formData = await request.formData();
  const richText = formData.get("richText");
  const title = formData.get("title");
  const author = formData.get("author");

  invariant(typeof newsId === "string", "newsId must be a string");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof author === "string", "author must be a string");
  invariant(typeof richText === "string", "richText must be a string");

  const article = await createArticle({
    title,
    author,
    newsOrg: newsId,
    content: richText,
    slug: slugify(title),
  });

  return redirect(`/noticias/${newsId}/${article.slug}`);
};

export default function NewNews() {
  const [title, setTitle] = useState("");
  const user = useUser();
  return (
    <>
      <Form
        method="post"
        className="flex flex-col w-full max-w-screen-md gap-4 p-8 mx-auto text-black bg-white"
      >
        <h1 className="mb-4 text-4xl font-bold text-justify max-w-prose">
          {title || "Nova Notícia"}
        </h1>
        <TextField
          fullWidth
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          label="Autor"
          name="author"
          variant="outlined"
          defaultValue={user.displayName}
          required
        />
        <RichText className="h-[500px] font-serif" />
        <button className="p-2 text-xl text-white bg-black">
          Criar Notícia
        </button>
      </Form>
    </>
  );
}
