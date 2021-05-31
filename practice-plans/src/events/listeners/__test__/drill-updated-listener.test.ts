import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { DrillUpdatedEvent } from '@db-coaching/common';
import { DrillUpdatedListener } from '../drill-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Drill } from '../../../models/drill';

const setup = async () => {
  // create an instance of the listener
  const listener = new DrillUpdatedListener(natsWrapper.client);

  //   create and save a drill
  const drill = Drill.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'shooting',
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await drill.save();

  // create a fake data event
  const data: DrillUpdatedEvent['data'] = {
    version: drill.version + 1,
    id: drill.id,
    title: 'passing',
    userId: drill.userId,
  };

  // create a fake message object
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, drill, msg };
};

it('finds, updates, and saves a drill', async () => {
  const { listener, data, drill, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a drill was updated
  const updatedDrill = await Drill.findById(drill.id);

  expect(updatedDrill!.title).toEqual(data.title);
  expect(updatedDrill!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack was called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped a version number', async () => {
  const { listener, data, drill, msg } = await setup();

  // bump the event data version
  data.version = 10;

  // onMessage should throw an error if the version number is off
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
