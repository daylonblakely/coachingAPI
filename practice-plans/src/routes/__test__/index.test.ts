import request from "supertest";
import { app } from "../../app";

const createPlan = (cookie: string[]) => {
  return request(app).post("/api/practice-plans").set("Cookie", cookie).send({
    title: "afdsfas",
    date: new Date(),
    comments: "affdjasfklj",
  });
};

it("returns a 400 if not authenticated", async () => {
  await request(app).get("/api/practice-plans").send().expect(401);
});

it("can fetch a list of users practice plans", async () => {
  const userCookie = global.signin();

  await createPlan(userCookie);
  await createPlan(userCookie);
  await createPlan(userCookie);

  const response = await request(app)
    .get("/api/practice-plans")
    .set("Cookie", userCookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});
