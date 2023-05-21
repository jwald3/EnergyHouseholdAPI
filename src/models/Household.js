import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class Household extends Model {}

Household.init(
    {
        household_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        provider_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        street_address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Household",
        tableName: "households",
        timestamps: false,
    }
);

export default Household;
