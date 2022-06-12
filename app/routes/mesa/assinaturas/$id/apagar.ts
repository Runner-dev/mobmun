import { ActionFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import { deleteSignature } from "~/models/signature.server";
import { mediatorGuard } from "~/services/auth.server";

export const action: ActionFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  const { id } = params;
  invariant(id, "id is required");

  const { documentId } = await deleteSignature(id);

  return redirect(`/mesa/documentos/${documentId}`);
};
