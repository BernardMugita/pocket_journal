import { Request, Response, Router } from "express";
import crypto from "crypto";
import db from "../models/sequelize";
import authenticateToken from "../funcs/authenticateJWT";

const router: Router = Router();
const User = db.Users;
const JWT = require("jsonwebtoken");

// user interface
interface UserObject {
  fullname: string;
  username: string;
  password: string;
  salt: string;
  userId: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  signUser?: UserObject;
}

// function to hash password
const hashPassword = (password: string, salt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, "sha256", (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
};

// generate the salt
const generateSalt = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

router.post("/register_user", async (req: Request, res: Response) => {
  const { fullname, username, password } = req.body;

  if (!fullname || !username || !password) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);

  const new_user = {
    fullname,
    username,
    password: hashedPassword,
    salt,
  };

  try {
    const user = await User.findOne({ where: { username: new_user.username } });

    if (user) {
      return res.status(409).json({
        status: "error",
        message: "Username already taken!",
      });
    }

    const registeredUser = await User.create(new_user);
    return res.status(200).json({
      status: "success",
      user: registeredUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong:",
    });
  }
});

const verifyPassword = (
  password: string,
  hash: string,
  salt: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!salt) {
      return reject(new Error("Salt is undefined"));
    }
    crypto.pbkdf2(password, salt, 10000, 64, "sha256", (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      resolve(hash === derivedKey.toString("hex"));
    });
  });
};

const generateAccessToken = (user: any) => {
  const secretToken = process.env.JSON_SECRET_KEY!;
  const signUser = { userId: user.userId };
  return JWT.sign(signUser, secretToken, { expiresIn: "4h" });
};

const generateRefreshToken = (user: any) => {
  const refreshToken = process.env.JSON_REFRESH_KEY!;
  const signUser = { userId: user.userId };
  return JWT.sign(signUser, refreshToken, { expiresIn: "7d" });
};

router.post("/sign_in_user", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username: username } });

    if (!existingUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const { password: hashedPassword, salt } = existingUser;
    const isValidPassword = await verifyPassword(
      password,
      hashedPassword,
      salt
    );

    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Wrong password, try again!",
      });
    }

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    return res.status(200).json({
      status: "success",
      token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Error in /sign_in_user route:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong:",
    });
  }
});

router.post(
  "/change_password",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const newPassword = req.body.newPassword;
    const userId = req.signUser?.userId;

    if (!newPassword) {
      return res.status(400).json({
        status: "error",
        message: "New password is required",
      });
    }

    try {
      const user = await User.findOne({ where: { userId: userId } });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const newSalt = generateSalt();
        const hashedNewPassword = await hashPassword(newPassword, newSalt);

        user.password = hashedNewPassword;
        user.salt = newSalt;
        await user.save();

        return res.status(200).json({
          status: "success",
          message: "Password updated successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong:",
      });
    }
  }
);

module.exports = router;
