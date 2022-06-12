import { TextField } from "@mui/material";
import { useState } from "react";
import type { LinksFunction, LoaderFunction } from "remix";
import { Form, json, useLoaderData } from "remix";
import invariant from "tiny-invariant";

import RichText, { richTextCssUrl } from "~/components/RichText";
import richTextOverrides from "~/compiledStyles/richTextOverrides.css";
import { getArticleBySlug } from "~/models/article.server";
import type { RawDraftContentState } from "react-draft-wysiwyg";
import { Link, useParams } from "remix";

type LoaderData = {
  title: string;
  author: string;
  initialEditorState: RawDraftContentState;
};

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

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(typeof params.slug === "string", "slug must be a string");
  const article = await getArticleBySlug(params.slug);
  if (!article) throw new Response("Article Not Found", { status: 404 });

  const editorState = JSON.parse(article.content);

  return json<LoaderData>({
    title: article.title,
    author: article.author,
    initialEditorState: editorState,
  });
};

export default function EditNews() {
  const {
    title: initialTitle,
    author,
    initialEditorState,
  } = useLoaderData() as LoaderData;
  const [title, setTitle] = useState(initialTitle);
  const { newsId, slug } = useParams();
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
          defaultValue={author}
          required
        />
        <RichText
          className="h-[500px] font-serif"
          initialState={initialEditorState}
        />
        <div className="flex gap-2">
          <Link
            to={`/noticias/${newsId}/${slug}`}
            className="flex-1 block w-0 p-2 text-xl text-center text-black bg-white border-2 border-black hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button className="flex-1 w-0 p-2 text-xl text-white bg-black border-2 border-black hover:bg-gray-700">
            Atualizar
          </button>
        </div>
      </Form>
    </>
  );
}
