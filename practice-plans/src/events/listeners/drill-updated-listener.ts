import { Message } from 'node-nats-streaming';
import { Listener, DrillUpdatedEvent, Subjects } from '@db-coaching/common';
import { queueGroupName } from './queue-group-name';
import { Drill } from '../../models/drill';

export class DrillUpdatedListener extends Listener<DrillUpdatedEvent> {
  subject: Subjects.DrillUpdated = Subjects.DrillUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: DrillUpdatedEvent['data'], msg: Message) {
    const drill = await Drill.findByEvent(data);

    if (!drill) {
      throw new Error('Drill not found');
    }
    const { title, description, category, comments } = data;
    drill.set({ title, description, category, comments });
    await drill.save();

    // tell nats streaming server that the message has been succesfully processed
    msg.ack();
  }
}
