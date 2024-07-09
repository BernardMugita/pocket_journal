import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Define the attributes for the Journal model
interface JournalAttributes {
  journalId: string;
  title?: string;
  owner?: string;
  content: string;
  category: string;
}

// Define a type for Journal creation attributes
interface JournalCreationAttributes extends Optional<JournalAttributes, 'journalId'> {}

// Define the Journal model
class Journal extends Model<JournalAttributes, JournalCreationAttributes> implements JournalAttributes {
  public journalId!: string;
  public title!: string;
  public owner!: string;
  public content!: string;
  public category!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Journal model
const journalModel = (sequelize: Sequelize) => {
  Journal.init(
    {
      journalId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "uncategorized"
      },
    },
    {
      sequelize,
      tableName: 'Journals',
      timestamps: true,
    }
  );

  // Set the UUID to each Journal before creation
  Journal.beforeCreate(async (journal: Journal) => {
    journal.journalId = uuidv4();
  });

  return Journal;
};

export { JournalAttributes, JournalCreationAttributes, journalModel, Journal };
