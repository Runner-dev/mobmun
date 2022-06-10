import type { ActionFunction } from "remix";
import { Form, Link, redirect } from "remix";
import invariant from "tiny-invariant";
import { StyledInput } from "~/components/StyledInputs";
import { createAlliance } from "~/models/alliance.server";
import { mediatorGuard } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const name = formData.get("name");
  invariant(typeof name === "string", "name must be a string");
  const alliance = await createAlliance({ name });
  return redirect(`/mesa/aliancas/${alliance.id}`);
};

export default function NewAnnouncement() {
  return (
    <Form method="post" className="flex w-full max-w-[400px] flex-col gap-2">
      <StyledInput name="name" placeholder="OTAN" label="Nome" />

      <div className="flex self-center gap-4 mt-2">
        <Link
          to="/mesa/aliancas"
          className="px-4 py-2 text-white bg-gray-500 rounded-lg"
        >
          Cancelar
        </Link>
        <button className="px-4 py-2 text-white bg-green-500 rounded-lg">
          Criar
        </button>
      </div>
    </Form>
  );
}
