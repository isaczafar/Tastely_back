import { Sequelize, DataTypes } from "sequelize";
import { RecipeModel } from "./types";

export default (seq: Sequelize) =>
    seq.define<RecipeModel>("recipie", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        instructions: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },

        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dificulty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        time: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });
