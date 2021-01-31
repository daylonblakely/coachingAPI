import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@dbticketsudemy/common";

import { PracticePlan } from "../models/practicePlan";

const router = express.Router();

router.post(
  "/api/practice-plans",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("A title is required when creating a practice plan"),
    body("date").not().isEmpty().withMessage("A valid date is required"),
    body("minutes")
      .if(body("minutes").exists())
      .isFloat({ gt: 0 })
      .withMessage("Practice length (in minutes) must be greater than 0"),
    body("seasonId").if(body("seasonId").exists()).isString(),
    body("practiceNumber")
      .if(body("practiceNumber").exists())
      .isFloat({ gt: 0 })
      .withMessage("Practice number must be greater than 0"),
    body("comments").if(body("comments").exists()).isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      date,
      minutes,
      seasonId,
      practiceNumber,
      comments,
    } = req.body;

    const plan = PracticePlan.build({
      title,
      date,
      minutes,
      seasonId,
      practiceNumber,
      comments,
      userId: req.currentUser!.id,
    });

    await plan.save();

    res.status(201).send(plan);
  }
);

export { router as createPlanRouter };
