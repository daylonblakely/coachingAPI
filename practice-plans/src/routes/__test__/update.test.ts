import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

it("returns a 400 if not authenticated", async () => {
  // Generate a mock mongo id
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/practice-plans/${id}`).send().expect(401);
});

it("returns a 404 if the plan is not found", async () => {
  // Generate a mock mongo id
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/practice-plans/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "afdsfas",
      date: new Date(),
      comments: "affdjasfklj",
    })
    .expect(404);
});

it("returns a 401 if the user does not own the plan", async () => {
  const title = "test practice";
  const date = new Date();
  const comments = "this is a test";

  // Create a plan with a random user
  const response = await request(app)
    .post("/api/practice-plans")
    .set("Cookie", global.signin())
    .send({
      title,
      date,
      comments,
    });

  // attempt to edit the plan with a different user
  await request(app)
    .put(`/api/practice-plans/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "afdsfas",
      date: new Date(),
      comments: "affdjasfklj",
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or date", async () => {
  // save user's cookie
  const cookie = global.signin();

  // create the plan
  const response = await request(app)
    .post("/api/practice-plans")
    .set("Cookie", cookie)
    .send({
      title: "afdsfas",
      date: new Date(),
      comments: "affdjasfklj",
    });

  // try update with invalid title
  await request(app)
    .put(`/api/practice-plans/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      date: new Date(),
    })
    .expect(400);

  // try update with invalid date
  await request(app)
    .put(`/api/practice-plans/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "adafa",
    })
    .expect(400);
});

it("updates the plan if the plan is found and has valid inputs", async () => {
  const title = "test practice";
  const date = new Date();
  const comments = "this is a test";

  const signinCookie = global.signin();

  //   create plan
  const response = await request(app)
    .post("/api/practice-plans")
    .set("Cookie", signinCookie)
    .send({
      title: "fasfasd",
      date,
      comments: "afwuefu",
    })
    .expect(201);

  // edit the plan
  await request(app)
    .put(`/api/practice-plans/${response.body.id}`)
    .set("Cookie", signinCookie)
    .send({ title, date, comments })
    .expect(200);

  // get updated
  const planResponse = await request(app)
    .get(`/api/practice-plans/${response.body.id}`)
    .set("Cookie", signinCookie)
    .send();

  expect(planResponse.body.title).toEqual(title);
  expect(planResponse.body.comments).toEqual(comments);
});
