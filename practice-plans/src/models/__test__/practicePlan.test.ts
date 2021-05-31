import { PracticePlan } from '../practicePlan';

it('implements optimistic concurrency control', async (done) => {
  // create an instance of a plan
  const plan = PracticePlan.build({
    title: 'shooting',
    userId: 'ajflkjas;l',
    date: new Date(),
  });

  // save the plan to the db
  await plan.save();

  // fetch the plan twice
  const firstInstance = await PracticePlan.findById(plan.id);
  const secondInstance = await PracticePlan.findById(plan.id);

  // make two separate changes to the plans we fetched
  firstInstance?.set({ description: 'first' });
  secondInstance?.set({ description: 'second' });

  // save the first fetched plan
  await firstInstance?.save();

  // save the second fetched plan and expect an error
  try {
    await secondInstance?.save();
  } catch (error) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const plan = PracticePlan.build({
    title: 'shooting',
    userId: 'ajflkjas;l',
    date: new Date(),
  });

  await plan.save();
  expect(plan.version).toEqual(0);
  await plan.save();
  expect(plan.version).toEqual(1);
});
