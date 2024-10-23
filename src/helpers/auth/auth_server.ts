"use server";

import { cookies } from "next/headers";

export async function getTokenServer() {
  const cookie = cookies().get("id");
  const user_token = cookie?.value;
  return user_token;
}
