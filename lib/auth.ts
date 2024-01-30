//This can be used in server components, server actions, and api routes

import { auth } from "@/auth";

//I would personally rename this file to something like currentUser.ts

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
