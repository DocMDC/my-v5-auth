import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { type Session } from "next-auth";
// import { JWT } from "next-auth/jwt";
import { JWT } from "@auth/core/jwt";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/accout";
// declare module "@auth/core" {
//   interface Session {
//     user: {
//       role: "ADMIN" | "USER";
//     } & DefaultSession["user"];
//   }
// }

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    //authjs redirects to this route when something goes wrong (eg, user signed up w/ GitHub and then tries to login with the same email using Google Oauth)
    signIn: "/auth/login",
    //if an error happens show this page
    error: "/auth/error",
  },
  events: {
    //if a user has registered with an oauth provider there is no need to verify the user's email (this was already done with oauth provider) so make their emailVerified key the date when they registered
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow Oauth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user) return false;

      const exisitingUser = await getUserById(user.id as string);

      //Don't allow users to login unless they have verified email
      //Must set up valid domain if using in production
      if (!exisitingUser?.emailVerified) return false;

      //Handle two factor authentication
      if (exisitingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          exisitingUser.id
        );

        //If user doesn't provide a 2FA code then don't allow them to login
        if (!twoFactorConfirmation) return false;

        // If a 2FA code is provided, delete 2FA code for next sign in and then break out of if statement so user can login
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    //Error that I ran into: "Property 'token' does not exist on type '({ session: Session; user: AdapterUser; } | { session: Session; token: JWT; }) & { newSession: any; trigger?: "update" | undefined; }'.ts(2339)

    //That error has a opened issue in authjs repository and only happens to the newest version: 5.0.0-beta.5

    async session({ session, token }: { session: Session; token?: JWT }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token?.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token?.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token?.name;
        session.user.email = token?.email;
        session.user.isOAuth = token?.isOauth as boolean;
      }

      return session;
    },
    //We must extend the default session callback because it by default returns basically only name and email. Before we can do this, we need to extend the jwt callback

    async jwt({ token }) {
      //Token has an object key called sub which is the id from the database
      //Use sub/user id to load user from db
      //Pass sub/user id to session callback
      //User is logged out
      if (!token.sub) return token;

      //Get the user from our db by their id
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const exisitingAccount = await getAccountByUserId(existingUser.id);

      //turn into a boolean
      token.isOauth = !!exisitingAccount;

      //manually update the name and email based on what is in the db
      token.name = existingUser.name;
      token.email = existingUser.email;
      //Add a role to the token that is based on what the user's rols is in the db
      token.role = existingUser.role;

      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      //Return the token so that it can be used by the session callback
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  //we have to use jwt strategy with prisma due to edge incompatbility
  session: { strategy: "jwt" },
  ...authConfig,
});
