import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  //expires in 5 min
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //Look for existing token in database
  const existingToken = await getPasswordResetTokenByEmail(email);

  //If token already exists, delete it before generating a new one
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  //Generate a new passwordResetToken corresponding to the user's email
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  //Generate random token
  const token = uuidv4();

  //expire the token in 1 hour (in milliseconds)
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //Get the existing verification token in our db associated with the user's email account
  const existingToken = await getVerificationTokenByEmail(email);

  //If the user already has a token, delete it
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //Generate a token based on the user's email which has an expiriation
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
