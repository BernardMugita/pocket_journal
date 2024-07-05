import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";

// Attributes for the Category model
interface CategoryAttributes {
  categoryId: string;
  categoryName?: string;
  owner?: string;
}

// Type for Category creation attributes
interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "categoryId"> {}

//  Category model
class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public categoryId!: string;
  public categoryName!: string;
  public owner!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Category model
const categoryModel = (sequelize: Sequelize) => {
  Category.init(
    {
      categoryId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4,
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Categories",
      timestamps: true,
    }
  );

  // Set the UUID to each Category before creation
  Category.beforeCreate(async (category: Category) => {
    category.categoryId = uuidv4();
  });

  return Category;
};

export {
  CategoryAttributes,
  CategoryCreationAttributes,
  categoryModel,
  Category,
};
