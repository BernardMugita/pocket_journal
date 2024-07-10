import Router, { Request, Response } from "express";
import { authenticateToken } from "../funcs/authenticateJWT";
import db from "../models/sequelize";

interface User {
  fullname: string;
  username: string;
  password: string;
  salt: string;
  userId: string;
  role: string;
}

interface Journal {
  journalId: string;
  title?: string;
  owner?: string;
  content: string;
  category: string;
  createdAt?: Date;
  updateAt?: Date;
}

interface AuthenticatedRequest extends Request {
  signUser?: User;
}

const router = Router();
const Journals = db.Journals;
const UserModel = db.Users;

router.post(
  "/journal_summary",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.signUser?.userId;
    try {
      const user = await UserModel.findOne({ where: { userId: userId } });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      }

      const userJournals = await Journals.findAll({
        where: { owner: user.username },
      });

      if (!userJournals || userJournals.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "User not found or no journals found!",
        });
      }

      // Get current date
      const now = new Date();

      // Calculate the date ranges
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastWeekDate = new Date(now.setDate(now.getDate() - 7));
      const yesterdayDate = new Date(now.setDate(now.getDate() - 1));

      // Filter journals for last month
      const lastMonthJournals = (userJournals as Journal[]).filter(
        (journal) => {
          const journalDate = journal.createdAt;
          return (
            journalDate &&
            journalDate.getMonth() === lastMonthDate.getMonth() &&
            journalDate.getFullYear() === lastMonthDate.getFullYear()
          );
        }
      );

      // Filter journals for last week
      const lastWeekJournals = (userJournals as Journal[]).filter((journal) => {
        const journalDate = journal.createdAt;
        return journalDate && journalDate > lastWeekDate;
      });

      // Filter journals for yesterday
      const yesterdayJournals = (userJournals as Journal[]).filter(
        (journal) => {
          const journalDate = journal.createdAt;
          return (
            journalDate &&
            journalDate.getDate() === yesterdayDate.getDate() &&
            journalDate.getMonth() === yesterdayDate.getMonth() &&
            journalDate.getFullYear() === yesterdayDate.getFullYear()
          );
        }
      );

      // Get current month and year
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Filter journals of the current month
      const currentMonthJournals = (userJournals as Journal[]).filter(
        (journal) => {
          const journalDate = journal.createdAt;
          return (
            journalDate &&
            journalDate.getMonth() === currentMonth &&
            journalDate.getFullYear() === currentYear
          );
        }
      );

      if (currentMonthJournals.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No journals found for the current month!",
        });
      }

      // Count journals by day
      const journalCountsByDay = currentMonthJournals.reduce((acc, journal) => {
        const day = journal.createdAt!.getDate();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      // Find the day with the most journal uploads
      const dayWithMostJournalUploads = Object.keys(journalCountsByDay).reduce(
        (a, b) =>
          journalCountsByDay[parseInt(a)] > journalCountsByDay[parseInt(b)]
            ? a
            : b
      );

      const dayWithMostJournalUploadsNumber = parseInt(
        dayWithMostJournalUploads
      );

      // Create the formatted date string
      const mostUploadsDate = new Date(
        currentYear,
        currentMonth,
        dayWithMostJournalUploadsNumber
      );
      const dayOfWeek = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(mostUploadsDate);
      const day = mostUploadsDate.getDate();
      const month = mostUploadsDate.toLocaleString("en-US", {
        month: "long",
      });
      const formattedDate = `${dayOfWeek} ${day}${getOrdinalSuffix(
        day
      )}, ${currentYear}`;

      // Calculate the most popular month
      const journalCountsByMonth = userJournals.reduce((acc, journal) => {
        const month = journal.createdAt!.getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      const mostPopularMonthIndex = Object.keys(journalCountsByMonth).reduce(
        (a, b) =>
          journalCountsByMonth[parseInt(a)] > journalCountsByMonth[parseInt(b)]
            ? a
            : b
      );

      const mostPopularMonth = new Date(
        currentYear,
        parseInt(mostPopularMonthIndex)
      ).toLocaleString("en-US", { month: "long" });

      // Calculate the most popular category
      const journalCountsByCategory = userJournals.reduce((acc, journal) => {
        const category = journal.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const mostPopularCategory = Object.keys(journalCountsByCategory).reduce(
        (a, b) =>
          journalCountsByCategory[a] > journalCountsByCategory[b] ? a : b
      );

      // Calculate the number of unique categories
      const uniqueCategories = Object.keys(journalCountsByCategory).length;

      return res.status(200).json({
        status: "success",
        stats: {
          total_user_journals: userJournals.length,
          most_popular_day: formattedDate,
          journal_count: journalCountsByDay[dayWithMostJournalUploadsNumber],
          most_popular_month: mostPopularMonth,
          most_popular_category: mostPopularCategory,
          unique_categories: uniqueCategories,
          last_month_journals: lastMonthJournals.length,
          last_week_journals: lastWeekJournals.length,
          yesterday_journals: yesterdayJournals.length,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
);

// Function to get the ordinal suffix for a number
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

module.exports = router;
