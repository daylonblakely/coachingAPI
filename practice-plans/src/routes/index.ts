import express, { Request, Response } from 'express';
import { requireAuth } from '@db-coaching/common';
import { PracticePlan } from '../models/practicePlan';

const router = express.Router();

router.get(
  '/api/practice-plans',
  requireAuth,
  async (req: Request, res: Response) => {
    // get all plans for a signed in user
    const plans = await PracticePlan.find({
      userId: req.currentUser!.id,
    }).populate('drills.drill');

    res.send(plans);
  }
);

export { router as indexPlanRouter };
