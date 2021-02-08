import Joi from "joi";

export const drillSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().valid(
    "Offense",
    "Defense",
    "Rebounding",
    "Transition",
    "Passing",
    "Ball Handling",
    "Shooting",
    "Other"
  ),
  minutes: Joi.number().integer().positive(),
  startTime: Joi.date(),
  comments: Joi.string(),
  practicePlanId: Joi.string(),
  userId: Joi.string(),
});
