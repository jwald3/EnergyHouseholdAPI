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
        provider_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        region_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
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
