import Joi from 'joi';

export const drillSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().valid(
    'Offense',
    'Defense',
    'Rebounding',
    'Transition',
    'Passing',
    'Ball Handling',
    'Shooting',
    'Other'
  ),
  comments: Joi.string(),
  userId: Joi.string(),
});
