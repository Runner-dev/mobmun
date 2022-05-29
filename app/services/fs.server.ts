import { writeFile } from "fs/promises";

export async function saveToFile(path: string, data: any) {
  return writeFile(path, data);
}
