import EnergyUsage from "../models/EnergyUsage.js";
import { Op } from 'sequelize';

export const getAllEnergyUsages = async (req, res) => {
    try {
        const { household_id, date, year, month } = req.query;

        const energyUsages = await getBaseQuery(household_id, date,  year, month, null, null);

        res.json(energyUsages);
    } catch (error) {
        handleError(res, error, "Error receiving energy usage readings");
    }
}

export const getDailyEnergyUsages = async (req, res) => {
    try {
        const { household_id, date, year } = req.query;

        const energyUsages = await getBaseQuery(household_id, date, null, year, null, null);

        const aggregatedData = aggregateByTime(energyUsages);

        res.json(aggregatedData);
    } catch (error) {
        handleError(res, error, "Error receiving daily energy usage readings");
    }
}

export const totalDailyEnergyUsages = async (req, res) => {
    try {
        const { household_id, date, year } = req.query;

        const energyUsages = await getBaseQuery(household_id, date, null, year, null, null);

        const totalUsage = totalEnergyUsage(energyUsages);

        const responseData = {
            "date": date,
            "energy_usage": totalUsage
        }

        res.json(responseData);
        
    } catch (error) {
        handleError(res, error, "Error receiving daily energy usage readings");
    }
}

export const getWeeklyEnergyUsages = async (req, res) => {
    try {
        const { household_id, year, week } = req.query;

        // first day of the year (in UTC)
        let firstDayOfYear = new Date(Date.UTC(year, 0, 1));

        // find the first Sunday of the year (in UTC)
        while (firstDayOfYear.getUTCDay() !== 0) {
            firstDayOfYear.setUTCDate(firstDayOfYear.getUTCDate() + 1);
        }

        let startOfWeek = new Date(firstDayOfYear.getTime());
        startOfWeek.setUTCDate(firstDayOfYear.getUTCDate() + (week - 1) * 7);
        let endOfWeek = new Date(startOfWeek.getTime());
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);

        console.log("startOfWeek:", startOfWeek.toISOString()); // Log the startOfWeek
        console.log("endOfWeek:", endOfWeek.toISOString()); // Log the endOfWeek

        const energyUsages = await getBaseQuery(household_id, null, year, null, startOfWeek, endOfWeek);

        res.json(energyUsages);
    } catch (error) {
        handleError(res, error, "Error receiving weekly energy usage readings");
    }
}

export const totalWeeklyEnergyUsages = async (req, res) => {
    try {
        const { household_id, year, week } = req.query;

        // first day of the year (in UTC)
        let firstDayOfYear = new Date(Date.UTC(year, 0, 1));

        // find the first Sunday of the year (in UTC)
        while (firstDayOfYear.getUTCDay() !== 0) {
            firstDayOfYear.setUTCDate(firstDayOfYear.getUTCDate() + 1);
        }

        let startOfWeek = new Date(firstDayOfYear.getTime());
        startOfWeek.setUTCDate(firstDayOfYear.getUTCDate() + (week - 1) * 7);
        let endOfWeek = new Date(startOfWeek.getTime());
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);

        console.log("startOfWeek:", startOfWeek.toISOString()); // Log the startOfWeek
        console.log("endOfWeek:", endOfWeek.toISOString()); // Log the endOfWeek

        const energyUsages = await getBaseQuery(household_id, null, year, null, startOfWeek, endOfWeek);

        const totalUsage = totalEnergyUsage(energyUsages);

        const responseData = {
            "week": week,
            "year": year,
            "energy_usage": totalUsage
        }

        res.json(responseData);

    } catch (error) {
        handleError(res, error, "Error receiving weekly energy usage readings");
    }
}

export const getMonthlyEnergyUsages = async (req, res) => {
    try {
        const { household_id, month, year } = req.query;

        const energyUsages = await getBaseQuery(household_id, null, year, month, null, null);

        const aggregatedData = aggregateByDay(energyUsages);

        res.json(aggregatedData);
    } catch (error) {
        handleError(res, error, "Error receiving monthly energy usage readings");
    }
}

export const totalMonthlyEnergyUsages = async (req, res) => {
    try {
        const { household_id, month, year } = req.query;

        const energyUsages = await getBaseQuery(household_id, null, year, month, null, null);

        const totalUsage = totalEnergyUsage(energyUsages);

        const responseData = {
            "month": month,
            "year": year,
            "energy_usage": totalUsage
        }

        res.json(responseData);

    } catch (error) {
        handleError(res, error, "Error receiving monthly energy usage readings");
    }
}

export const getYearlyEnergyUsages = async (req, res) => {
    try {
        const { household_id, year } = req.query;

        const energyUsages = await getBaseQuery(household_id, null, year, null, null, null);

        const aggregatedData = aggregateByDaysWithWindow(energyUsages);

        res.json(aggregatedData);

    } catch (error) {
        handleError(res, error, "Error receiving yearly energy usage readings")
    } 
}

export const totalYearlyEnergyUsages = async (req, res) => {
    try {
        const { household_id, year } = req.query;

        const energyUsages = await getBaseQuery(household_id, null, year, null, null, null);

        const totalUsage = totalEnergyUsage(energyUsages);

        const responseData = {
            "year": year,
            "energy_usage": totalUsage
        }

        res.json(responseData);

    } catch (error) {
        handleError(res, error, "Error receiving yearly energy usage readings")
    } 
}

const totalEnergyUsage = (energyUsages) => {
    return energyUsages?.reduce((a, b) => a + Number(b.energy_usage), 0);
}


const getBaseQuery = async (household_id = null, date = null, year = null, month = null, startOfWeek = null, endOfWeek = null) => {
    const whereClause = constructWhereClause(household_id, date, year, month, startOfWeek, endOfWeek);

    return await EnergyUsage.findAll({ where: whereClause });
}

const constructWhereClause = (household_id, date, year, month, startOfWeek, endOfWeek) => {
    let whereClause = {};

    if (household_id) {
        whereClause.household_id = household_id;
    }

    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        whereClause.reading_time = {
            [Op.gte]: startDate,
            [Op.lte]: endDate
        };
    }

    if (startOfWeek && endOfWeek) {
        whereClause.reading_time = {
            [Op.gte]: startOfWeek,
            [Op.lte]: endOfWeek
        };
    } else if (year) {
        if (month) {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    
            whereClause.reading_time = {
                [Op.gte]: startOfMonth,
                [Op.lte]: endOfMonth
            };
        } else {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

            whereClause.reading_time = {
                [Op.gte]: startOfYear,
                [Op.lte]: endOfYear
            };
        }
        
    }

    return whereClause;
}

const aggregateByTime = (energyUsages) => {
    const aggregatedObject = energyUsages.reduce((acc, usage) => {
        const timeKey = usage.get().reading_time.toISOString().split('.')[0];
        if (!acc[timeKey]) {
            acc[timeKey] = {
                time: timeKey,
                energy_usage: 0,
                count: 0,
                household_id: usage.household_id
            };
        }

        acc[timeKey].energy_usage += Number(usage.get().energy_usage);
        acc[timeKey].count += 1;

        return acc;
    }, {});

    // Convert the object to an array
    const aggregatedArray = Object.values(aggregatedObject);

    // Sort the array by time
    aggregatedArray.sort((a, b) => a.time.localeCompare(b.time));

    return aggregatedArray;
}

const aggregateByDay = (energyUsages) => {
    const aggregatedObject = energyUsages.reduce((acc, usage) => {
        const timeKey = usage.get().reading_time.toISOString().split('T')[0];
        if (!acc[timeKey]) {
            acc[timeKey] = {
                time: timeKey,
                energy_usage: 0,
                count: 0,
                household_id: usage.household_id
            };
        }

        acc[timeKey].energy_usage += Number(usage.get().energy_usage);
        acc[timeKey].count += 1;

        return acc;
    }, {});

    // Convert the object to an array
    const aggregatedArray = Object.values(aggregatedObject);

    // Sort the array by time
    aggregatedArray.sort((a, b) => a.time.localeCompare(b.time));

    return aggregatedArray;
}

const aggregateByDaysWithWindow = (energyUsages) => {
    const dailyData = aggregateByDay(energyUsages);

    let rollingWindowLength = 6;

    let movingAverages = [];

    for (let i = 0; i <= dailyData.length - rollingWindowLength; i++) {
        let windowData = dailyData.slice(i, i + rollingWindowLength);

        let totalEnergyUsageSum = 0;
        let totalCount = 0;

        for (let dataPoint of windowData) {
            totalEnergyUsageSum += dataPoint.energy_usage;
            totalCount += dataPoint.count;
        }

        let energy_usage = totalEnergyUsageSum / rollingWindowLength;

        let entry = {
            start_date: windowData[0].time,
            end_date: windowData[windowData.length - 1].time,
            energy_usage: energy_usage,
            count: rollingWindowLength
        };

        movingAverages.push(entry);
    }

    return movingAverages;
}


const handleError = (res, error, errorMessage) => {
    console.error("Error Details: ", error);
    res.status(500).json({ message: errorMessage});
}

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
