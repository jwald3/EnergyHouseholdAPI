import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class EnergyUsage extends Model {}

EnergyUsage.init(
    {
        usage_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        household_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reading_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        energy_usage: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "EnergyUsage",
        tableName: "energy_usage",
        timestamps: false,
    }
);

export default EnergyUsage;
