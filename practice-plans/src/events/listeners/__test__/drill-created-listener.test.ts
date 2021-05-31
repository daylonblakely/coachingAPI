import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { DrillCreatedEvent } from '@db-coaching/common';
import { DrillCreatedListener } from '../drill-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Drill } from '../../../models/drill';

const setup = async () => {
  // create an instance of the listener
  const listener = new DrillCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: DrillCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    description: 'test',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a drill', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const drill = await Drill.findById(data.id);

  expect(drill).toBeDefined();
  expect(drill!.title).toEqual(data.title);
  expect(drill!.description).toEqual(data.description);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack was called
  expect(msg.ack).toHaveBeenCalled();
});
