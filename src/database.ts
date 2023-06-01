import { Sequelize, Model, DataTypes } from 'sequelize';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';


export class Database {
  private sequelize: Sequelize;


  constructor() {
    this.sequelize = new Sequelize(process.env.DATABASEURL!, {
      dialect: 'postgres',
    });
  }


  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Connected to the database');


      this.defineModels();


      await this.sequelize.sync();
      console.log('Models synced with the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }


  private defineModels() {
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
        sequelize: this.sequelize,
        modelName: 'Recipe',
      }
    );


    User.init(
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        servings: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cookTime: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        creator: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
      },
      {
        sequelize: this.sequelize,
        modelName: 'User',
      }
    );
  }


  getSequelizeInstance() {
    return this.sequelize;
  }
}
