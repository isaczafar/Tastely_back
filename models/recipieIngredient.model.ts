import { Sequelize, DataTypes } from "sequelize";
import { RecipieIngredientModel } from "./types";

export default (seq: Sequelize) =>
    seq.define<RecipieIngredientModel>("recipieIngredient", {
        unit: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.INTEGER,
        },
    });
