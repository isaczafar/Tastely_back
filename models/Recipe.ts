import { Sequelize, Model, DataTypes } from 'sequelize';
import { Database } from '../src/database';

export class Recipe extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public ingredients!: string[];
  public instructions!: string[];
}

export function initializeRecipeModel(database: Database): void {
  const sequelize = database.getSequelizeInstance();

  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      instructions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Recipe',
    }
  );
}
