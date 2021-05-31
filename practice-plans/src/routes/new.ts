import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@db-coaching/common';

import { PracticePlan } from '../models/practicePlan';
// events
import { natsWrapper } from '../nats-wrapper';
import { PlanCreatedPublisher } from '../events/publishers/plan-created-publisher';

const router = express.Router();

router.post(
  '/api/practice-plans',
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

    const plan = PracticePlan.build({
      title,
      date,
      minutes,
      practiceNumber,
      comments,
      drills,
      userId: req.currentUser!.id,
    });

    await plan.save();

    // publish plan created event
    new PlanCreatedPublisher(natsWrapper.client).publish({
      id: plan.id,
      title: plan.title,
    });

    res.status(201).send(plan);
  }
);

export { router as createPlanRouter };
