import type { CountryRepresentative, NewsOrg } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { StyledSelect } from "~/components/StyledInputs";
import { getNewsOrgs } from "~/models/newsOrg.server";
import {
  createNewsRepresentative,
  getAvailableRepresentatives,
  getRepresentativeByUserId,
  updateRepresentative,
} from "~/models/representative.server";
import { authenticator } from "~/services/auth.server";

type LoaderData =
  | {
      type: "country";
      availableRepresentatives: CountryRepresentative[];
    }
  | {
      type: "news";
      availableNews: NewsOrg[];
    };

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const userRep = await getRepresentativeByUserId(user.id);
  if (userRep) return redirect("/");
  if (user.initialCountryId) {
    const availableRepresentatives = await getAvailableRepresentatives(
      user.initialCountryId
    );

    return json<LoaderData>({ type: "country", availableRepresentatives });
  } else if (user.initialNews) {
    const availableNews = await getNewsOrgs();

    return json<LoaderData>({ type: "news", availableNews });
  }

  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const formData = await request.formData();
  const representative = await formData.get("representative");
  const newsOrg = await formData.get("newsOrg");
  if (representative) {
    invariant(
      typeof representative === "string",
      "representative is not string"
    );
    await updateRepresentative({
      userId: user.id,
      id: representative,
    });
  }
  if (newsOrg) {
    invariant(typeof newsOrg === "string", "newsOrg is not string");
    await createNewsRepresentative({
      userId: user.id,
      newsOrgId: newsOrg,
    });
  }

  return redirect("/");
};

export default function DefineRepresentative() {
  const loaderData = useLoaderData() as LoaderData;
  if (loaderData.type === "country") {
    return (
      <Form
        method="post"
        className="absolute top-1/2 left-1/2 flex w-[400px] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-8 bg-gray-100 p-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Escolha seu representante
        </h1>
        <StyledSelect
          label="Representante"
          name="representative"
          options={loaderData.availableRepresentatives.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
        />
        <button className="w-full p-2 text-white bg-green-500">Escolher</button>
      </Form>
    );
  } else if (loaderData.type === "news") {
    return (
      <Form
        method="post"
        className="absolute top-1/2 left-1/2 flex w-[400px] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-8 bg-gray-100 p-4"
      >
        <h1 className="text-2xl font-bold text-center">Escolha seu jornal</h1>
        <StyledSelect
          label="Jornal"
          name="newsOrg"
          options={loaderData.availableNews.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
        />
        <button className="w-full p-2 text-white bg-green-500">Escolher</button>
      </Form>
    );
  }
}
