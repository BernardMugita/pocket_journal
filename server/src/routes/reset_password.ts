import { Request, Response, Router } from "express";
import crypto from "crypto";
import { generateSalt, hashPassword } from "../funcs/authenticateJWT";
import db from "../models/sequelize";
const nodemailer = require("nodemailer");

interface UserObject {
  fullname: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  userId: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  signUser?: UserObject;
}

const router = Router();
const User = db.Users;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

router.post("/request_otp", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const userWithMail = await User.findOne({ where: { email: email } });

    if (!userWithMail) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    } else {
      const OTP = crypto.randomBytes(3).toString("hex");

      var mailOptions = {
        from: { name: "Pocket Journal", address: process.env.EMAIL },
        to: email,
        subject: "Reset password OTP",
        text: "Our User's OTP",
        html: `
            <div>
                <h4>Reset password OTP</h4>
                <p>Use the OTP (One Time Pin) attached in this mail to reset your password</p>
                <p>${OTP}</p>
            </div>
        `,
      };

      try {
        const updateUserPassword = await User.update(
          { password: OTP },
          {
            where: {
              userId: userWithMail.userId,
            },
          }
        );
        if (updateUserPassword) {
          const senOTPRequest = await transporter.sendMail(mailOptions);
          res.status(200).json({
            status: "success",
            message: `Message sent to ${senOTPRequest.accepted[0]}`,
          });
        } else {
          res.status(500).json({
            status: "error",
            message: "Something went wrong!",
          });
        }
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/change_password", async (req: Request, res: Response) => {
  const { newPassword, email, otp } = req.body;

  if (!newPassword || !email || !otp) {
    return res.status(400).json({
      status: "error",
      message: "Fill in all fields",
    });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    } else {
      const isValidOTP = user.password === otp;

      if (!isValidOTP) {
        return res.status(401).json({
          status: "error",
          message: "Invalid OTP",
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
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong:",
    });
  }
});

module.exports = router;
