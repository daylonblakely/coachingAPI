import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@dbticketsudemy/common";

import { PracticePlan } from "../models/practicePlan";

const router = express.Router();

router.get(
  "/api/practice-plans/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const plan = await PracticePlan.findById(req.params.id);

    if (!plan) {
      throw new NotFoundError();
    }

    //   check that user owns the plan
    if (plan.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(plan);
  }
);

export { router as showPlanRouter };
