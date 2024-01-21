import { DataTypes, Sequelize } from "sequelize";
import { RoleModel } from "./types";

export default (seq: Sequelize) =>
    seq.define<RoleModel>("role", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    });
