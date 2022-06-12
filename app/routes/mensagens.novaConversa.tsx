import { Button, TextField } from "@mui/material";
import { Country } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import { newsOrgImages } from "~/bowserConstants";
import ConversationAutoComplete, {
  Member,
} from "~/components/ConversationAutocomplete/ConversationAutocomplete";
import Navbar from "~/components/Navbar";
import SharingAutocomplete from "~/components/SharingAutocomplete";
import {
  getNewsOrgByUser,
  getNewsOrgsExceptOwn,
} from "~/models/ newsOrg.server";
import { createConversation } from "~/models/conversation.server";
import {
  getCountries,
  getCountriesExceptOwn,
  getCountryByUser,
} from "~/models/country.server";
import { authenticator, mediatorGuard } from "~/services/auth.server";
import Conversation from "./mensagens/$id";

type LoaderData = {
  possibleMembers: Member[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const countries = await getCountriesExceptOwn(user.id);
  const newsOrgs = await getNewsOrgsExceptOwn(user.id);

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

  return json<LoaderData>({ possibleMembers });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const formData = await request.formData();
  const name = formData.get("name");
  invariant(typeof name === "string", "name must be a string");

  const conversationMembersStr = formData.get("conversationMembers");
  invariant(
    typeof conversationMembersStr === "string",
    "conversationMembers must be a string"
  );

  const conversationMembers = JSON.parse(conversationMembersStr) as Member[];
  const userCountry = await getCountryByUser(user.id);
  const userNewsOrg = await getNewsOrgByUser(user.id);

  const countries: string[] = userCountry
    ? [
        userCountry.id,
        ...conversationMembers
          .filter((member) => member.type === "country")
          .map(({ id }) => id),
      ]
    : conversationMembers
        .filter((member) => member.type === "country")
        .map(({ id }) => id);

  const newsOrgs: string[] = userNewsOrg
    ? [
        userNewsOrg.id,
        ...conversationMembers
          .filter((member) => member.type === "news")
          .map(({ id }) => id),
      ]
    : conversationMembers
        .filter((member) => member.type === "news")
        .map(({ id }) => id);

  const { id } = await createConversation({ name, countries, newsOrgs });

  return redirect(`/mensagens/${id}`);
};

export default function NewConversation() {
  const { possibleMembers } = useLoaderData() as LoaderData;
  return (
    <>
      <Navbar />
      <Form
        method="post"
        className="flex flex-col max-w-screen-sm gap-4 p-4 mx-auto mt-8 shadow-sm bg-gray-50/80"
      >
        <h1 className="text-2xl text-center">Nova Conversa</h1>
        <TextField name="name" label="Nome da conversa" required fullWidth />
        <ConversationAutoComplete members={possibleMembers} />
        <button className="w-full p-4 text-xl text-white bg-green-500 rounded-lg">
          Criar Conversa
        </button>
      </Form>
    </>
  );
}
