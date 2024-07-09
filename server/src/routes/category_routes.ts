import { Request, Response, Router } from "express";
import db from "../models/sequelize";
import authenticateToken from "../funcs/authenticateJWT";

const router = Router();
const CategoryModel = db.Categories;
const UserModel = db.Users;

// Extend the Request interface to include the user property

interface User {
  fullname: string;
  username: string;
  password: string;
  salt: string;
  userId: string;
  role: string;
  exp: number;
}

interface Category {
  categoryId: string;
  categoryName?: string;
  owner?: string;
}

interface AuthenticatedRequest extends Request {
  signUser?: User;
}

router.post("/create_category", async (req: Request, res: Response) => {
  const { categoryName, owner } = req.body;

  const category_details = {
    categoryName,
    owner,
  };

  if (!categoryName || !owner) {
    return res.status(400).json({
      status: "error",
      message: "Fill in all the fields",
    });
  }

  try {
    const newCategory = await CategoryModel.create(category_details);
    return res.status(200).json({
      status: "success",
      category: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error,
    });
  }
});

router.post(
  "/get_category",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const categoryId = req.body.categoryId;

    try {
      if (!categoryId) {
        res.status(400).json({
          status: "error",
          message: "categoryId must be provided",
        });
      }

      const category = await CategoryModel.findOne({
        where: { categoryId: categoryId },
      });
      if (!category) {
        res.status(404).json({
          status: "error",
          message: "category not found!",
        });
      } else {
        res.status(200).json({
          status: "success",
          category: category,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
);

router.post(
  "/get_user_categories",
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
        const categories = await CategoryModel.findAll({
          where: { owner: user.username },
        });
        if (categories.length === 0) {
          res.status(404).json({
            status: "error",
            message: "User does not have categories",
          });
        } else {
          res.status(200).json({
            status: "success",
            categories: categories,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
);

router.post(
  "/get_all_categories",
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
          const categories = await CategoryModel.findAll();
          if (!categories) {
            res.status(404).json({
              status: "error",
              message: "No categories found",
            });
          } else {
            res.status(200).json({
              status: "success",
              categories: categories,
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
);

router.post(
  "/edit_category",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;
    const categoryId = req.body.categoryId;

    if (!categoryId) {
      res.status(400).json({
        status: "error",
        message: "category Id must be provided",
      });
    }

    try {
      const user = await UserModel.findOne({ where: { userId: userId } });
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const category = await CategoryModel.findOne({
          where: { categoryId: categoryId },
        });

        if (!category) {
          return res.status(404).json({
            status: "error",
            message: "category not found",
          });
        } else {
          const isUsercategory = category.owner === user.username;
          if (!isUsercategory) {
            return res.status(403).json({
              status: "error",
              message: "Unauthorized, user is not category owner",
            });
          } else {
            const { categoryName } = req.body;

            if (!categoryName) {
              return res.status(400).json({
                status: "error",
                message: "Fill in all the fields",
              });
            }

            const category_details = {
              categoryName,
            };
            await CategoryModel.update(category_details, {
              where: { categoryId: categoryId },
            });
            res.status(200).json({
              status: "success",
              message: "category updated successfully",
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
);

router.post(
  "/delete_category",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;
    const categoryId = req.body.categoryId;

    if (!categoryId) {
      res.status(400).json({
        status: "error",
        message: "category Id must be provided",
      });
    }

    try {
      const user = await UserModel.findOne({ where: { userId: userId } });
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const category = await CategoryModel.findOne({
          where: { categoryId: categoryId },
        });

        if (!category) {
          return res.status(404).json({
            status: "error",
            message: "category not found",
          });
        } else {
          const isUsercategory = category.owner === user.username;
          if (!isUsercategory) {
            return res.status(403).json({
              status: "error",
              message: "Unauthorized, user is not category owner",
            });
          } else {
            await CategoryModel.destroy({ where: { categoryId: categoryId } });
            res.status(200).json({
              status: "success",
              message: "category Deleted Successfully",
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

module.exports = router;
