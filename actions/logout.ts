"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  //Use this rather than just "signOut" in a client component so that you do some server stuff before signing out (eg, clearning server data)
  await signOut();
};
