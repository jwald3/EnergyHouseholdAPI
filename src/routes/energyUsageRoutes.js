import { Router } from "express";
import {
    getAllEnergyUsages,
    getEnergyUsageById,
    createEnergyUsage,
    updateEnergyUsage,
    deleteEnergyUsage,
    getDailyEnergyUsages,
    getWeeklyEnergyUsages,
    getMonthlyEnergyUsages,
    getYearlyEnergyUsages,
    totalWeeklyEnergyUsages,
    totalMonthlyEnergyUsages,
    totalYearlyEnergyUsages,
    totalDailyEnergyUsages
} from "../controllers/energyUsageController.js";

const router = Router();

router.get("/totals/daily", totalDailyEnergyUsages);
router.get("/totals/weekly", totalWeeklyEnergyUsages);
router.get("/totals/monthly", totalMonthlyEnergyUsages);
router.get("/totals/yearly", totalYearlyEnergyUsages)

router.get("/daily", getDailyEnergyUsages);
router.get("/weekly", getWeeklyEnergyUsages);
router.get("/monthly", getMonthlyEnergyUsages);
router.get("/yearly", getYearlyEnergyUsages);

router.get("/", getAllEnergyUsages);
router.get("/:usage_id", getEnergyUsageById);
router.post("/", createEnergyUsage);
router.put("/:usage_id", updateEnergyUsage);
router.delete("/:usage_id", deleteEnergyUsage);

export default router;
