"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRecipeModel = exports.Recipe = void 0;
const sequelize_1 = require("sequelize");
class Recipe extends sequelize_1.Model {
}
exports.Recipe = Recipe;
function initializeRecipeModel(database) {
    const sequelize = database.getSequelizeInstance();
    Recipe.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        ingredients: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
        },
        instructions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Recipe',
    });
}
exports.initializeRecipeModel = initializeRecipeModel;
