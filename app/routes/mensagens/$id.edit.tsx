import type {
  Conversation,
  ConversationCountryMember,
  ConversationNewsOrgMember,
  Country,
  NewsOrg,
} from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect } from "remix";
import { Form, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { newsOrgImages } from "~/bowserConstants";
import ConversationAutocomplete, {
  Member,
} from "~/components/ConversationAutocomplete/ConversationAutocomplete";
import {
  addMembersToConversation,
  getConversationByIdWithMembers,
  leaveConversation,
} from "~/models/conversation.server";
import { getCountriesOutsideConversation } from "~/models/country.server";
import { getNewsOrgOutsideConversation } from "~/models/newsOrg.server";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  conversationData: Conversation & {
    countryMembers: (ConversationCountryMember & {
      country: Country;
    })[];
    newsOrgMembers: (ConversationNewsOrgMember & {
      newsOrg: NewsOrg;
    })[];
  };
  possibleMembers: Member[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(typeof id === "string");

  const conversationData = await getConversationByIdWithMembers(id);
  if (!conversationData)
    return new Response("Conversa não encontrada", { status: 404 });
  const countries = await getCountriesOutsideConversation(id);
  const newsOrgs = await getNewsOrgOutsideConversation(id);

  const possibleMembers: Member[] = [
    ...newsOrgs.map<Member>((org) => ({
      id: org.id,
      label: org.name,
      imageSrc: newsOrgImages[org.id as keyof typeof newsOrgImages],
      type: "news",
    })),
    ...countries.map<Member>((country) => ({
      id: country.id,
      label: country.name,
      imageSrc: country.flag,
      type: "country",
    })),
  ];

  return json<LoaderData>({ conversationData, possibleMembers });
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(typeof id === "string");

  const formData = await request.formData();
  const action = formData.get("_action");
  invariant(typeof action === "string");
  switch (action) {
    case "add": {
      const conversationMembersStr = formData.get("conversationMembers");
      invariant(
        typeof conversationMembersStr === "string",
        "conversationMembers must be a string"
      );

      const conversationMembers = JSON.parse(
        conversationMembersStr
      ) as Member[];

      const countries: string[] = conversationMembers
        .filter((member) => member.type === "country")
        .map(({ id }) => id);

      const newsOrgs: string[] = conversationMembers
        .filter((member) => member.type === "news")
        .map(({ id }) => id);

      await addMembersToConversation({ id, countries, newsOrgs });

      return redirect(`/mensagens/${id}`);
    }
    case "leave": {
      const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      });

      await leaveConversation({ conversationId: id, userId: user.id });

      return redirect("/mensagens");
    }
  }
};

export default function EditConversation() {
  const { conversationData, possibleMembers } = useLoaderData() as LoaderData;
  return (
    <Form method="post">
      <h1 className="flex items-center h-12 p-2 text-xl border-b bg-blue-300/40">
        {conversationData.name}
      </h1>
      <div className="p-2">
        <h2 className="text-xl font-bold">Membros Atuais:</h2>
        <ul className="px-2">
          {conversationData.newsOrgMembers.map(({ id, newsOrg }) => (
            <li key={id}>{newsOrg.name}</li>
          ))}
          {conversationData.countryMembers.map(({ country, id }) => (
            <li key={id}>{country.name}</li>
          ))}
        </ul>
        <h2 className="mt-4 text-xl font-bold">Adicionar Membros:</h2>
        <div className="max-w-[300px] py-2">
          <ConversationAutocomplete members={possibleMembers} />
        </div>
        <button
          value="add"
          name="_action"
          className="p-2 text-white bg-green-500"
        >
          Adicionar
        </button>
      </div>
      <button
        className="p-2 mx-2 mt-4 text-white bg-red-500"
        value="leave"
        name="_action"
        onClick={(e) => {
          if (!confirm("Você tem certeza que deseja sair desta conversa?"))
            e.preventDefault();
        }}
      >
        Sair da conversa
      </button>
    </Form>
  );
}
