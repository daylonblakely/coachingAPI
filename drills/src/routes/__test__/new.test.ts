import request from 'supertest';
import { app } from '../../app';
import { Drill } from '../../models/drill';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/drills for post requests', async () => {
  const response = await request(app).post('/api/drills').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/drills').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({
      title: '',
      comments: '',
    })
    .expect(400);

  await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({
      comments: '',
    })
    .expect(400);
});

it('returns an error if an invalid category is provided', async () => {
  await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({
      title: 'ageaegawg',
      category: 'nothing',
      comments: '',
    })
    .expect(400);
});

// TODO test for valid practice plan ID

it('creates a plan with valid inputs', async () => {
  // get all drills in the collection,
  // should be 0 because we clear the collections before running tests
  let drills = await Drill.find({});
  expect(drills.length).toEqual(0);

  const title = 'Test title';

  await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({
      title,
      description: 'aldkjasljf',
      category: 'Offense',
      comments: 'comment',
    })
    .expect(201);

  await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({
      title,
      category: 'Defense',
    })
    .expect(201);

  await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({
      title,
    })
    .expect(201);

  drills = await Drill.find({});
  expect(drills.length).toEqual(3);
  expect(drills[0].title).toEqual(title);
});

it('emits a drill created event', async () => {
  await request(app)
    .post('/api/drills')
    .set('Cookie', global.signin())
    .send({
      title: 'passing',
      userId: 'alkjflakj',
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
