import { Link, LoaderFunction, useLoaderData } from "remix";
import { json } from "remix";
import { getUsers, User } from "~/models/user.server";

type LoaderData = {
  users: User[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const users = await getUsers();

  return json<LoaderData>({ users });
};

export default function MediatorUsers() {
  const { users } = useLoaderData() as LoaderData;

  return (
    <>
      <ul className="px-2 ml-2 list-disc">
        {users.map((user) => (
          <li key={user.id} className="text-lg hover:text-blue-500">
            <Link to={user.id}>
              {user.displayName} - {user.email}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="novo" className="px-4 py-2 text-white bg-green-500 rounded-lg">
        Novo
      </Link>
    </>
  );
}
