"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sequelize_1 = require("sequelize");
const Recipe_1 = require("../models/Recipe");
class Database {
    constructor() {
        this.sequelize = new sequelize_1.Sequelize(process.env.DATABASEURL, {
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
        }
        catch (error) {
            console.error('Error connecting to the database', error);
        }
    }
    defineModels() {
        Recipe_1.Recipe.init({
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
            sequelize: this.sequelize,
            modelName: 'Recipe',
        });
    }
    getSequelizeInstance() {
        return this.sequelize;
    }
}
exports.Database = Database;
