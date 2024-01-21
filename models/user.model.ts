import { Sequelize, DataTypes, type ModelStatic, type Model } from "sequelize";
import { UserModel } from "./types";
export default (seq: Sequelize) =>
    seq.define<UserModel>("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: { args: [5], msg: "Min length is 5 characters" },
            },
        },
        password: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        email: {
            unique: true,
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                is: /.*\@.*\..*/,
            },
        },
    });
