import * as bcrypt from "bcryptjs";
import { verify, sign, SignOptions } from "jsonwebtoken";

export const isPasswordValid = async (reqPass: string, dbPass: string) => {
  try {
    return await bcrypt.compare(reqPass, dbPass);
  } catch (error) {
    return error;
  }
};

export const issueJWT = async (user: any) => {
  try {
    const payload = {
      id: user.userId,
    };
    const options: SignOptions = {
      algorithm: "HS512",
      expiresIn: 24 * 60 * 60,
    };
    const signToken = sign(payload, "jwtPrivateKey", options);
    return signToken;
  } catch (error) {
    return error;
  }
};

export const requireAuth = async (token) => {
  try {
    const decodedToken = await verify(token, "jwtPrivateKey");
    return decodedToken;
  } catch (error) {
    return { error: "Invalid Token" };
  }
};
