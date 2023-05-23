import EnergyUsage from "../models/EnergyUsage.js";
import { Op } from 'sequelize';

export const getAllEnergyUsages = async (req, res) => {
    try {
        const { household_id, date, aggregateByDay, aggregateByTime, month } = req.query;

        let whereClause = {};

        if (household_id) {
            whereClause.household_id = household_id;
        }

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0); // Set the time to start of the day
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999); // Set the time to end of the day

            whereClause.reading_time = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            };
        }

        const energyUsages = await EnergyUsage.findAll({ where: whereClause });

        // Convert the string to a number
        const filterMonth = Number(month);

        let filteredEnergyUsages = energyUsages;

        if (month && !isNaN(filterMonth) && filterMonth >= 1 && filterMonth <= 12) {
            filteredEnergyUsages = energyUsages.filter(usage => {
                const usageMonth = new Date(usage.get().reading_time).getMonth() + 1;
                return usageMonth === filterMonth;
            });
        }

        if (aggregateByTime === 'true') {
            const aggregatedData = filteredEnergyUsages.reduce((acc, usage) => {
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
            const aggregatedData = filteredEnergyUsages.reduce((acc, usage) => {
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
            const processedData = filteredEnergyUsages.map(usage => ({
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
