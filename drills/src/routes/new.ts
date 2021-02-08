import express, { Request, Response } from "express";
import { requireAuth } from "@dbticketsudemy/common";
import { drillSchema } from "../models/drillValidationSchema";
import { validateSchema } from "../middlewares/joiValidateSchema";

import { Drill } from "../models/drill";

const router = express.Router();

router.post(
  "/api/drills",
  requireAuth,
  validateSchema(drillSchema),
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      category,
      minutes,
      startTime,
      comments,
      practicePlanId,
    } = req.body;

    // TODO check for valid practicePlanId if exists

    const drill = Drill.build({
      title,
      description,
      category,
      minutes,
      startTime,
      comments,
      practicePlanId,
      userId: req.currentUser!.id,
    });

    await drill.save();

    res.status(201).send(drill);
  }
);

export { router as createDrillRouter };
