import { Sequelize, DataTypes } from "sequelize";
import { IngredientModel } from "./types";
export default (seq: Sequelize) =>
    seq.define<IngredientModel>("ingredient", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
