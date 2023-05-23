import EnergyUsage from "../models/EnergyUsage.js";
import { Op } from 'sequelize';
import sequelize from "../utils/database.js";

export const getAllEnergyUsages = async (req, res) => {
    try {
        const { household_id, date, month, aggregateByDay, aggregateByTime } = req.query;

        let whereClause = {};

        if (household_id) {
            whereClause.household_id = household_id;
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999); // Set the time to end of the day
            endDate.setMilliseconds(endDate.getMilliseconds() - 1); // Subtract 1 millisecond to exclude midnight
        
            whereClause.reading_time = {
                [Op.between]: [startDate, endDate]
            };
        }

        if (month) {
            const monthInt = parseInt(month, 10);
            whereClause[Op.and] = sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('"month"'), sequelize.col('reading_time')), monthInt);
        }

        const energyUsages = await EnergyUsage.findAll({ where: whereClause });

        if (aggregateByTime === 'true') {
            const aggregatedData = energyUsages.reduce((acc, usage) => {
                const timeKey = usage.get().reading_time.toISOString().split('T')[1].split('.')[0];
                if (!acc[timeKey]) {
                    acc[timeKey] = {
                        time: timeKey,
                        total_energy_usage: 0,
                        count: 0
                    };
                }
                acc[timeKey].total_energy_usage += Number(usage.get().energy_usage);
                acc[timeKey].count += 1;
                return acc;
            }, {});

            const aggregatedDataArray = Object.values(aggregatedData);
            res.json(aggregatedDataArray);
        } else if (aggregateByDay === 'true') {
            const aggregatedData = energyUsages.reduce((acc, usage) => {
                const dateKey = usage.get().reading_time.toISOString().split('T')[0];
                if (!acc[dateKey]) {
                    acc[dateKey] = {
                        date: dateKey,
                        total_energy_usage: 0,
                        count: 0
                    };
                }
                acc[dateKey].total_energy_usage += Number(usage.get().energy_usage);
                acc[dateKey].count += 1;
                return acc;
            }, {});

            const aggregatedDataArray = Object.values(aggregatedData);
            res.json(aggregatedDataArray);
        } else {
            const processedData = energyUsages.map(usage => ({
                ...usage.get(),
                usage_id: Number(usage.get().usage_id),
                energy_usage: Number(usage.get().energy_usage)
            }));

            res.json(processedData);
        }
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: "Error retrieving EnergyUsages" });
    }
};



export const getEnergyUsageById = async (req, res) => {
    try {
        const energyUsage = await EnergyUsage.findByPk(req.params.usage_id);
        if (!energyUsage)
            return res.status(404).json({ message: "EnergyUsage not found." });
        res.json(energyUsage);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error retrieving EnergyUsage." });
    }
};

export const createEnergyUsage = async (req, res) => {
    try {
        const energyUsage = await EnergyUsage.create(req.body);
        res.status(201).json(energyUsage);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error creating EnergyUsage." });
    }
};

export const updateEnergyUsage = async (req, res) => {
    try {
        const [updatedRows] = await EnergyUsage.update(req.body, {
            where: { usage_id: req.params.usage_id },
        });

        if (!updatedRows)
            return res.status(404).json({ message: "EnergyUsage not found." });
        res.json({ message: "EnergyUsage updated." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error updating EnergyUsage." });
    }
};

export const deleteEnergyUsage = async (req, res) => {
    try {
        const deletedRows = await EnergyUsage.destroy({
            where: { usage_id: req.params.usage_id },
        });

        if (!deletedRows)
            return res.status(404).json({ message: "EnergyUsage not found." });
        res.json({ message: "EnergyUsage deleted." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error deleting EnergyUsage." });
    }
};
