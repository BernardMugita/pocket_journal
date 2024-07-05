import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { userModel, User } from "./user";
import { journalModel, Journal } from "./journal";
import { categoryModel, Category } from "./category";

dotenv.config();

const database = process.env.DB_NAME!;
const username = process.env.DB_USER!;
const password = process.env.DB_PASS!;
const host = process.env.DB_HOST!;

if (!database || !username || !password || !host) {
  throw new Error("Missing required environment variables");
}

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error! " + err);
  });

interface Db {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  Users: typeof User;
  Journals: typeof Journal;
  Categories: typeof Category;
}

const db: Partial<Db> = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};

// Initialize the models and add them to the db object
db.Users = userModel(sequelize);
db.Journals = journalModel(sequelize);
db.Categories = categoryModel(sequelize);

// sync db with the new model data
db.sequelize?.sync({force: false}).then(() =>  {
    console.log("Database re-sync complete")
})

// export the db to use for initializing sequelize
export default db as Db;
