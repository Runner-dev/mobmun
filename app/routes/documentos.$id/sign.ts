import type { ActionFunction } from "remix";
import { redirect } from "remix";
import invariant from "tiny-invariant";
import { getCountryByUser } from "~/models/country.server";
import { createSignature } from "~/models/signatures.server";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, "Id Must be Defined");
  const id = params.id;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const country = await getCountryByUser(user.id);
  invariant(country, "User must have country");
  await createSignature({ countryId: country.id, documentId: id });
  return redirect(`/documentos/${id}`);
};
