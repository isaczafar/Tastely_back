import {
    Sequelize,
    DataTypes,
    type ModelStatic,
    Model,
    UUIDV4,
    ModelCtor,
} from "sequelize";
import config from "../config/auth.config";
import { type TokenModel } from "./types";
import { v4 as uuidv4 } from "uuid";

interface TokenStatic extends ModelStatic<TokenModel> {
    verifyExp: (token: TokenModel) => boolean;
}
export default (seq: Sequelize) => {
    const Token = seq.define<TokenModel>("token", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
        expDate: {
            type: DataTypes.DATE,
            defaultValue: new Date().setSeconds(
                new Date().getSeconds() + config.jwtRefresh,
            ),
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
    }) as TokenStatic;
    Token.verifyExp = (token) => {
        const isValid = token.expDate.getTime() > Date.now();
        return isValid;
    };

    return Token;
};
