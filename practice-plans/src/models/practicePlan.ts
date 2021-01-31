import mongoose from "mongoose";

// an interface that describes the properties
// required to create a new PracticePlan
interface PracticePlanAttrs {
  title: string;
  date: Date;
  minutes?: number; //length in minutes
  seasonId?: string;
  practiceNumber?: number;
  comments?: string;
  userId: string;
}

// an interface that describes the properties
// that a PracticePlan document has
interface PracticePlanDoc extends mongoose.Document {
  title: string;
  date: Date;
  minutes?: number; //length in minutes
  seasonId?: string;
  practiceNumber?: number;
  comments?: string;
  userId: string;
}

// an interface that describes the properties
// that a practicePlan model has
interface PracticePlanModel extends mongoose.Model<PracticePlanDoc> {
  build(attrs: PracticePlanAttrs): PracticePlanDoc;
}

const practicePlanSchema = new mongoose.Schema(
  {
    title: {
      type: String, //global js String constructor
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    minutes: {
      type: Number,
      required: false,
    },
    seasonId: {
      type: String,
      required: false,
    },
    practiceNumber: {
      type: Number,
      required: false,
    },
    comments: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    // modify response obj of creating a PracticePlan
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

practicePlanSchema.statics.build = (attrs: PracticePlanAttrs) => {
  return new PracticePlan(attrs);
};

const PracticePlan = mongoose.model<PracticePlanDoc, PracticePlanModel>(
  "PracticePlan",
  practicePlanSchema
);

export { PracticePlan };
