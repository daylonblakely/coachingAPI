import express, { Request, Response } from 'express';
import { requireAuth } from '@db-coaching/common';
import { drillSchema } from '../models/drillValidationSchema';
import { validateSchema } from '@db-coaching/common';

import { Drill } from '../models/drill';
import { natsWrapper } from '../nats-wrapper';
import { DrillCreatedPublisher } from '../events/publishers/drill-created-publisher';

const router = express.Router();

router.post(
  '/api/drills',
  requireAuth,
  validateSchema(drillSchema),
  async (req: Request, res: Response) => {
    const { title, description, category, comments } = req.body;

    // TODO check for valid practicePlanId if exists

    const drill = Drill.build({
      title,
      description,
      category,
      comments,
      userId: req.currentUser!.id,
    });

    await drill.save();

    // emit drill created event
    new DrillCreatedPublisher(natsWrapper.client).publish({
      id: drill.id,
      version: drill.version,
      title: drill.title,
      description: drill.description,
      category: drill.category,
      comments: drill.comments,
      userId: drill.userId,
    });

    res.status(201).send(drill);
  }
);

export { router as createDrillRouter };
