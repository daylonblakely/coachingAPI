import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Drill } from '../../models/drill';

const createPlan = async (cookie: string[]) => {
  const drill = Drill.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    description: 'test',
    category: 'Offense',
    comments: 'test',
    userId: 'aaaa',
  });
  await drill.save();

  return request(app)
    .post('/api/practice-plans')
    .set('Cookie', cookie)
    .send({
      title: 'afdsfas',
      date: new Date(),
      comments: 'affdjasfklj',
      drills: [{ drill: drill.id, duration: 15, comments: '' }],
    });
};

it('returns a 401 if not authenticated', async () => {
  await request(app).get('/api/practice-plans').send().expect(401);
});

it('can fetch a list of users practice plans', async () => {
  const userCookie = global.signin();

  await createPlan(userCookie);
  await createPlan(userCookie);
  await createPlan(userCookie);

  const response = await request(app)
    .get('/api/practice-plans')
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});
