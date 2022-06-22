import type { ActionFunction, LoaderFunction } from "remix";
import { Form, redirect } from "remix";
import {
  getRepresentativeByUserId,
  isNewsRepresentative,
  updateNewsRepresentative,
} from "~/models/representative.server";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  if (!user) return new Response("Unauthorized", { status: 403 });
  const userRep = getRepresentativeByUserId(user.id);
  if (!userRep) return new Response("Unauthorized", { status: 403 });
  if (!isNewsRepresentative(userRep))
    return new Response("Unauthorized", { status: 403 });

  return new Response("OK", { status: 200 });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const ids = ["daily-mail", "kolnische-zeitung"];
  const rep = await getRepresentativeByUserId(user.id);
  if (!rep) return new Response("Unauthorized", { status: 403 });
  if (!isNewsRepresentative(rep))
    return new Response("Unauthorized", { status: 403 });
  if (!ids.includes(rep.newsOrgId))
    return new Response("Unauthorized", { status: 403 });
  await updateNewsRepresentative({
    id: rep.id,
    newsOrgId: ids.filter((id) => id !== rep.newsOrgId)[0],
  });

  return redirect("/noticias");
};

export default function TrocarImprensa() {
  return (
    <Form method="post">
      <button className="p-4 text-white bg-green-500">Trocar Imprensa</button>
    </Form>
  );
}
