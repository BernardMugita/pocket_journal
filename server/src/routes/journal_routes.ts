import { Request, Response, Router } from "express";
import db from "../models/sequelize";
import { authenticateToken } from "../funcs/authenticateJWT";

const router = Router();
const JournalModel = db.Journals;
const UserModel = db.Users;
const CategoryModel = db.Categories;

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

interface Journal {
  journalId: string;
  title?: string;
  owner?: string;
  content: string;
  category: string;
}

interface AuthenticatedRequest extends Request {
  signUser?: User;
}

router.post(
  "/create_journal",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { title, owner, content, category } = req.body;

    const journal_details = {
      title,
      owner,
      content,
      category,
    };

    if (!title || !content || !category || !owner) {
      return res.status(400).json({
        status: "error",
        message: "Fill in all the fields",
      });
    }

    try {
      const existingCategory = await CategoryModel.findOne({
        where: { categoryName: category },
      });

      if (!existingCategory) {
        const new_category = {
          categoryName: category,
          owner: owner,
        };
        await CategoryModel.create(new_category);
      }

      const newJournal = await JournalModel.create(journal_details);
      return res.status(200).json({
        status: "success",
        journal: newJournal,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
);

router.post(
  "/get_journal",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const journalId = req.body.journalId;

    try {
      if (!journalId) {
        res.status(400).json({
          status: "error",
          message: "Journal Id must be provided",
        });
      }

      const journal = await JournalModel.findOne({
        where: { journalId: journalId },
      });
      if (!journal) {
        res.status(404).json({
          status: "error",
          message: "Journal not found!",
        });
      } else {
        res.status(200).json({
          status: "success",
          journal: journal,
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
  "/get_user_journals",
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
        const journals = await JournalModel.findAll({
          where: { owner: user.username },
        });
        if (journals.length == 0) {
          res.status(404).json({
            status: "error",
            message: "User does not have journals",
          });
        } else {
          res.status(200).json({
            status: "success",
            journals: journals,
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
  "/get_all_journals",
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
          const journals = await JournalModel.findAll();
          if (!journals) {
            res.status(404).json({
              status: "error",
              message: "No journals found",
            });
          } else {
            res.status(200).json({
              status: "success",
              journals: journals,
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

// Route to get journals by category name
router.post(
  "/get_journals_by_category",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { categoryName } = req.body; // Assuming you're passing categoryName in the request body
    const userId = req.signUser?.userId;

    try {
      // Find the user making the request
      const user = await UserModel.findOne({ where: { userId } });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      // Check if the user owns the category
      const ownedCategory = await JournalModel.findOne({
        where: { owner: user.username, category: categoryName },
      });

      if (!ownedCategory) {
        return res.status(404).json({
          status: "error",
          message: "No categories found!",
        });
      }

      // Fetch journals for the specified category
      const journals = await JournalModel.findAll({
        where: { category: categoryName },
      });

      if (!journals || journals.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No journals found for the specified category",
        });
      }

      return res.status(200).json({
        status: "success",
        journals: journals,
      });
    } catch (error) {
      console.error("Error fetching journals:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch journals",
      });
    }
  }
);

router.post(
  "/edit_journal",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;
    const journalId = req.body.journalId;

    if (!journalId) {
      res.status(400).json({
        status: "error",
        message: "Journal Id must be provided",
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
        const journal = await JournalModel.findOne({
          where: { journalId: journalId },
        });

        if (!journal) {
          return res.status(404).json({
            status: "error",
            message: "Journal not found",
          });
        } else {
          console.log("journa");
          const isUserJournal = journal.owner === user.username;
          if (!isUserJournal) {
            return res.status(403).json({
              status: "error",
              message: "Unauthorized, user is not journal owner",
            });
          } else {
            const { title, content, category } = req.body;

            if (!title || !content || !category) {
              return res.status(400).json({
                status: "error",
                message: "Fill in all the fields",
              });
            }

            const journal_details = {
              title,
              content,
              category,
            };
            await JournalModel.update(journal_details, {
              where: { journalId: journalId },
            });
            res.status(200).json({
              status: "success",
              message: "Journal updated successfully",
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
  "/delete_journal",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;
    const journalId = req.body.journalId;

    if (!journalId) {
      res.status(400).json({
        status: "error",
        message: "Journal Id must be provided",
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
        const journal = await JournalModel.findOne({
          where: { journalId: journalId },
        });

        if (!journal) {
          return res.status(404).json({
            status: "error",
            message: "Journal not found",
          });
        } else {
          const isUserJournal = journal.owner === user.username;
          if (!isUserJournal) {
            return res.status(403).json({
              status: "error",
              message: "Unauthorized, user is not journal owner",
            });
          } else {
            await JournalModel.destroy({ where: { journalId: journalId } });
            res.status(200).json({
              status: "success",
              message: "Journal Deleted Successfully",
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
