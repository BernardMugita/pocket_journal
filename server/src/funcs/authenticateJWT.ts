import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const JWT = require("jsonwebtoken");

interface User {
  fullname: string;
  username: string;
  password: string;
  salt: string;
  userId: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  signUser?: User;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  JWT.verify(
    token,
    process.env.JSON_SECRET_KEY as string,
    (err: Error, user: User) => {
      if (err) {
        return res.status(403).json({
          status: "error",
          message: err.message,
        });
      } else {
        req.signUser = user as User;
        next();
      }
    }
  );
};

export const hashPassword = (
  password: string, 
  salt: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, "sha256", (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
};

// generate the salt
export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString("hex");
};
