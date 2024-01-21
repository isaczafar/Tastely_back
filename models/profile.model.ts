import { Sequelize, DataTypes } from "sequelize";
import { ProfileModel } from "./types";
export default (seq: Sequelize) =>
    seq.define<ProfileModel>("profile", {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
        },
        avatar: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        first_name: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        last_name: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        bd_year: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        bd_month: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        bd_day: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        info_text: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
    });
