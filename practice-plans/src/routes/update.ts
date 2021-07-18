import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@db-coaching/common';

import { PracticePlan } from '../models/practicePlan';

const router = express.Router();

router.put(
  '/api/practice-plans/:id',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('A title is required when creating a practice plan'),
    body('date').not().isEmpty().withMessage('A valid date is required'),
    body('minutes') // optional
      .if(body('minutes').exists())
      .isFloat({ gt: 0 })
      .withMessage('Practice length (in minutes) must be greater than 0'),
    body('practiceNumber') // optional
      .if(body('practiceNumber').exists())
      .isFloat({ gt: 0 })
      .withMessage('Practice number must be greater than 0'),
    body('comments')
      .if(body('comments').exists())
      .isString()
      .withMessage('Comments must be a valid string'), // optional
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, date, minutes, practiceNumber, comments, drills } = req.body;

    const plan = await PracticePlan.findById(req.params.id).populate(
      'drills.drill'
    );

    if (!plan) {
      throw new NotFoundError();
    }

    //   check that user owns the plan
    if (plan.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // update the plan
    plan.set({
      title,
      date,
      minutes,
      practiceNumber,
      comments,
      drills,
    });
    await plan.save();

    res.send(plan);
  }
);

export { router as updatePlanRouter };
