"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

import { db } from "@/lib/db";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  //Search for an existing user in the db
  const existingUser = await getUserByEmail(email);

  //If the existing user doesn't have a password that means they must have signed in with Oauth and shouldn't be trying to login with a password
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  //If a user just created an account but hasn't verified their email, let them know a confirmation email was sent and don't allow them to login until they have gone to their email.
  //This is also checked in auth.ts under the signIn callback for improved security
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    //This is done with resend.com
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verify confirmation email!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      //TODO; verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      //Remove 2FA token from db
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      //Search for existing 2FA confirmation in db
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      //Remove existing 2FA confirmation from db
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      //Create 2FA confirmation in db
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      //Generate two factor code and send it as an email to user
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
