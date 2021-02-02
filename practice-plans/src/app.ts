import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@dbticketsudemy/common";

import { createPlanRouter } from "./routes/new";
import {showPlanRouter} from "./routes/show";

const app = express();
app.set("trust proxy", true); //because of ingress nginx proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //HTTPS
  })
);

// Middleware
app.use(currentUser);

// Routes
app.use(createPlanRouter);
app.use(showPlanRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
