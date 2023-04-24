import { Router } from "express";
import {
    getAllHouseholds,
    getHouseholdById,
    createHousehold,
    updateHousehold,
    deleteHousehold,
} from "../controllers/householdController.js";

const router = Router();

router.get("/", getAllHouseholds);
router.get("/:household_id", getHouseholdById);
router.post("/", createHousehold);
router.put("/:household_id", updateHousehold);
router.delete("/:household_id", deleteHousehold);

export default router;
