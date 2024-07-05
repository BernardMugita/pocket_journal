import { Request, Response, Router, NextFunction } from "express";
import db from "../models/sequelize";
import authenticateToken from "../funcs/authenticateJWT";

const router = Router();
const UserModel = db.Users;

// Extend the Request interface to include the user property
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

router.post(
  "/get_user",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;

    try {
      const user = await UserModel.findOne({ where: { userId: userId } });
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        res.status(200).json({
          status: "success",
          user: user,
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

router.post(
  "/get_all_users",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;

    try {
      const user = await UserModel.findOne({ where: { userId: userId } });
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const authorizedUser = user.role === "admin";
        if (!authorizedUser) {
          res.status(403).json({
            status: "error",
            message: "Action prohibited",
          });
        } else {
          const users = await UserModel.findAll();
          if (!users) {
            res.status(404).json({
              status: "error",
              message: "No users found",
            });
          } else {
            res.status(200).json({
              status: "success",
              users: users,
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong:",
      });
    }
  }
);

router.post(
  "/edit_user_account",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;

    try {
      const user = await UserModel.findOne({ where: { userId: userId } });
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const { fullname } = req.body;
        const user_details = {
          fullname,
        };
        const updatedUser = await UserModel.update(user_details, {
          where: { userId: user.userId },
        });
        res.status(200).json({
          status: "success",
          message: "Account updated successfully",
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

router.post(
  "/delete_user_account",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;

    try {
      const user = await UserModel.findOne({ where: { userId: userId } });
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        await UserModel.destroy({ where: { userId: userId } });
        res.status(200).json({
          status: "success",
          message: "Account Deleted Successfully",
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
