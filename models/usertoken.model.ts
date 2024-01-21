import { DataTypes, Sequelize } from "sequelize";
import type { UserTokenModel } from "./types";
export default (seq: Sequelize) =>
    seq.define<UserTokenModel>("userToken", {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "user",
                key: "id",
            },
        },
        token_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "token",
                key: "id",
            },
        },
    });
