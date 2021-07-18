import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Drill } from '../../models/drill';

it('returns a 400 if not authenticated', async () => {
  // Generate a mock mongo id
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/practice-plans/${id}`).send().expect(401);
});

it('returns a 404 if the plan is not found', async () => {
  // Generate a mock mongo id
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/practice-plans/${id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404);
});

it('returns a 401 if the user does not own the plan', async () => {
  const title = 'test practice';
  const date = new Date();
  const comments = 'this is a test';

  // Create a plan with a random user
  const response = await request(app)
    .post('/api/practice-plans')
    .set('Cookie', global.signin())
    .send({
      title,
      date,
      comments,
    });

  // attempt to edit the plan with a different user
  await request(app)
    .get(`/api/practice-plans/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title,
      date,
      comments,
    })
    .expect(401);
});

it('returns the plan if the plan is found', async () => {
  const title = 'test practice';
  const date = new Date();
  const comments = 'this is a test';
  const drill1 = Drill.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    description: 'test',
    category: 'Offense',
    comments: 'test',
    userId: 'aaaa',
  });
  await drill1.save();

  const signinCookie = global.signin();

  //   create plan
  const response = await request(app)
    .post('/api/practice-plans')
    .set('Cookie', signinCookie)
    .send({
      title,
      date,
      comments,
      drills: [{ drill: drill1.id }],
    })
    .expect(201);

  const planResponse = await request(app)
    .get(`/api/practice-plans/${response.body.id}`)
    .set('Cookie', signinCookie)
    .send()
    .expect(200);

  expect(planResponse.body.title).toEqual(title);
  expect(planResponse.body.comments).toEqual(comments);
  expect(planResponse.body.drills[0].drill.id).toEqual(drill1.id);
});
