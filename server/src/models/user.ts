import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";

// Attributes for the User model
interface UserAttributes {
  userId: string;
  role?: string;
  profile?: string;
  fullname: string;
  email: string;
  username: string;
  password: string;
  salt: string;
}

// Type for User creation attributes
interface UserCreationAttributes extends Optional<UserAttributes, "userId"> {}

// User model
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public userId!: string;
  public role!: string;
  public profile!: string;
  public fullname!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public salt!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the User model
const userModel = (sequelize: Sequelize) => {
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
      profile: {
        type: DataTypes.STRING,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Users",
      timestamps: true,
    }
  );

  // Set the UUID to each user before creation
  User.beforeCreate(async (user: User) => {
    user.userId = uuidv4();
  });

  return User;
};

export { UserAttributes, UserCreationAttributes, userModel, User };
