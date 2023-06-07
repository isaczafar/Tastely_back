import { Sequelize, Model, DataTypes } from 'sequelize';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';

export class Database {
  private sequelize: Sequelize;

  constructor() {
    const url = new URL(process.env.DATABASEURL!);
    const database = url.pathname.substr(1);
    const username = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = parseInt(url.port);

    this.sequelize = new Sequelize(database, username, password, {
      dialect: 'postgres',
      host,
      port,
      ssl: true,
      dialectOptions: {
        ssl: true,
      },
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
