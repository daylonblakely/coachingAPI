import { Drill } from '../drill';

it('implements optimistic concurrency control', async (done) => {
  // create an instance of a drill
  const drill = Drill.build({
    title: 'shooting',
    userId: 'ajflkjas;l',
  });

  // save the drill to the db
  await drill.save();

  // fetch the drill twice
  const firstInstance = await Drill.findById(drill.id);
  const secondInstance = await Drill.findById(drill.id);

  // make two separate changes to the drills we fetched
  firstInstance?.set({ description: 'first' });
  secondInstance?.set({ description: 'second' });

  // save the first fetched drill
  await firstInstance?.save();

  // save the second fetched drill and expect an error
  try {
    await secondInstance?.save();
  } catch (error) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const drill = Drill.build({
    title: 'shooting',
    userId: 'ajflkjas;l',
  });

  await drill.save();
  expect(drill.version).toEqual(0);
  await drill.save();
  expect(drill.version).toEqual(1);
});
