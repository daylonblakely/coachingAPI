import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { PracticePlan } from '../../models/practicePlan';
import { natsWrapper } from '../../nats-wrapper';
import { Drill } from '../../models/drill';

it('has a route handler listening to /api/practice-plans for post requests', async () => {
  const response = await request(app).post('/api/practice-plans').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/practice-plans').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title: '',
      minutes: 45,
      date: new Date(),
      practiceNumber: 1,
      comments: '',
    })
    .expect(400);

  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      minutes: 45,
      date: new Date(),
      practiceNumber: 1,
      comments: '',
    })
    .expect(400);
});

it('returns an error if an invalid minutes is provided', async () => {
  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title: 'ageaegawg',
      minutes: 'dsafsadf',
      date: new Date(),
      practiceNumber: 1,
      comments: '',
    })
    .expect(400);
});

it('returns an error if an invalid date is provided', async () => {
  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title: 'ageaegawg',
      minutes: 45,
      date: '',
      practiceNumber: 1,
      comments: '',
    })
    .expect(400);

  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title: 'ageaegawg',
      minutes: 45,
      practiceNumber: 1,
      comments: '',
    })
    .expect(400);
});

it('returns an error if an invalid practiceNumber is provided', async () => {
  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title: 'ageaegawg',
      minutes: 45,
      date: new Date(),
      practiceNumber: 'aallllasdk',
      comments: '',
    })
    .expect(400);
});

it('creates a plan with valid inputs', async () => {
  // get all plans in the collection,
  // should be 0 because we clear the collections before running tests
  let plans = await PracticePlan.find({});
  expect(plans.length).toEqual(0);

  const drill1 = Drill.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    description: 'test',
    category: 'Offense',
    comments: 'test',
    userId: 'aaaa',
  });

  const drill2 = Drill.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    description: 'test',
    category: 'Offense',
    comments: 'test',
    userId: 'aaaa',
  });
  await drill1.save();
  await drill2.save();

  const title = 'Test plan title';

  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title,
      minutes: 45,
      date: new Date(),
      practiceNumber: 10,
      comments: 'comment',
      drills: [
        { drill: drill1.id, duration: 20 },
        { drill: drill2.id, comments: 'test' },
      ],
    })
    .expect(201);

  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title,
      date: new Date(),
      seasonId: 'afadsf',
      comments: 'comment',
      drills: [
        { drill: drill1.id, duration: 20 },
        { drill: drill2.id, comments: 'test' },
      ],
    })
    .expect(201);

  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title,
      date: new Date(),
    })
    .expect(201);

  plans = await PracticePlan.find({});
  expect(plans.length).toEqual(3);
  expect(plans[0].practiceNumber).toEqual(10);
  expect(plans[0].title).toEqual(title);
});

it('publishes a plan created event', async () => {
  await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title: 'Test plan title',
      minutes: 45,
      date: new Date(),
      practiceNumber: 10,
      comments: 'comment',
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
