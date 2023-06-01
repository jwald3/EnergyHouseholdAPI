import { Router } from "express";
import {
    getAllEnergyUsages,
    getEnergyUsageById,
    createEnergyUsage,
    updateEnergyUsage,
    deleteEnergyUsage,
    getDailyEnergyUsages
} from "../controllers/energyUsageController.js";

const router = Router();

router.get("/daily", getDailyEnergyUsages);

router.get("/", getAllEnergyUsages);
router.get("/:usage_id", getEnergyUsageById);
router.post("/", createEnergyUsage);
router.put("/:usage_id", updateEnergyUsage);
router.delete("/:usage_id", deleteEnergyUsage);

export default router;
