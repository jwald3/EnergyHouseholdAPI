import EnergyUsage from "../models/EnergyUsage.js";
import { startOfWeek, endOfWeek, setWeek, formatISO } from 'date-fns';
import { Op } from 'sequelize';

export const getAllEnergyUsages = async (req, res) => {
    try {
        const { household_id, date, aggregateByDay, aggregateByTime, aggregateByWeek, aggregateByWeekDay, month, page, limit, week, year, rollingWindow } = req.query;

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

        if (year) {
            const startOfYear = new Date(year, 0, 1);  // Start of the specified year
            const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);  // End of the specified year

            whereClause.reading_time = {
                [Op.gte]: startOfYear,
                [Op.lte]: endOfYear
            };
        }

        // Convert page and limit to integers and calculate offset
        const currentPage = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const offset = (currentPage - 1) * pageSize;

        const energyUsages = await EnergyUsage.findAll({ 
            where: whereClause,
            offset: offset,
            limit: limit 
        });

        // Convert the string to a number
        const filterMonth = Number(month);

        let filteredEnergyUsages = energyUsages;

        if (month && !isNaN(filterMonth) && filterMonth >= 1 && filterMonth <= 12) {
            filteredEnergyUsages = energyUsages.filter(usage => {
                const usageMonth = new Date(usage.get().reading_time).getMonth() + 1;
                return usageMonth === filterMonth;
            });
        }

        // ... your existing code for other aggregations ...

        if (rollingWindow === 'true') {
            // Group by day
            const dailyEnergyUsages = {};
            energyUsages.forEach(usage => {
                const day = usage.get().reading_time.toISOString().split('T')[0];  // Get the day
                if (!dailyEnergyUsages[day]) {
                    dailyEnergyUsages[day] = {
                        date: day,
                        total_energy_usage: 0,
                        count: 0
                    };
                }
                dailyEnergyUsages[day].total_energy_usage += Number(usage.get().energy_usage);
                dailyEnergyUsages[day].count += 1;
            });

            const dailyEnergyUsagesArray = Object.values(dailyEnergyUsages);

            // The time window for the rolling average
            const timeWindow = 15;

            // Create an array to store the moving averages
            const movingAverages = [];

            // Calculate moving averages
            for(let i = 0; i <= dailyEnergyUsagesArray.length - timeWindow; i++) {
                const windowData = dailyEnergyUsagesArray.slice(i, i + timeWindow);
                const sum = windowData.reduce((sum, dataPoint) => sum + dataPoint.total_energy_usage, 0);
                const average = sum / windowData.length;

                movingAverages.push({
                    start_date: windowData[0].date,
                    end_date: windowData[windowData.length - 1].date,
                    average_energy_usage: average
                });
            }

            res.json(movingAverages);
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
