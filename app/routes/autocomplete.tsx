import { json } from "@remix-run/server-runtime";

export const loader = async () => {
  return json({ worked: true });
};
