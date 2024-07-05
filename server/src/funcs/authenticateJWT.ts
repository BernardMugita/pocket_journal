import { Request, Response, NextFunction } from "express";

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

function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
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
}

export default authenticateToken;
