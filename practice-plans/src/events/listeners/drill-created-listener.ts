import { Message } from 'node-nats-streaming';
import { Listener, DrillCreatedEvent, Subjects } from '@db-coaching/common';
import { queueGroupName } from './queue-group-name';
import { Drill } from '../../models/drill';

export class DrillCreatedListener extends Listener<DrillCreatedEvent> {
  subject: Subjects.DrillCreated = Subjects.DrillCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: DrillCreatedEvent['data'], msg: Message) {
    const { id, title, description, category, comments, userId } = data;
    const drill = Drill.build({
      id,
      title,
      description,
      category,
      comments,
      userId,
    });
    await drill.save();

    // tell nats streaming server that the message has been succesfully processed
    msg.ack();
  }
}
