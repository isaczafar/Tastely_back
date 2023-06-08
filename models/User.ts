import { Sequelize, Model, DataTypes } from 'sequelize';
import { Database } from '../src/database';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  public logout!: () => Promise<void>;
}

export function initializeUserModel(sequelize: Sequelize): void {
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
      sequelize,
      modelName: 'User',
    }
  );

  User.prototype.logout = async function () {
    await this.save();
  };
}
