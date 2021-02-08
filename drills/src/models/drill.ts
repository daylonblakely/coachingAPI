import mongoose from "mongoose";

// an interface that describes the properties
// required to create a new Drill
interface DrillAttrs {
  title: string;
  description?: string;
  category?:
    | "Offense"
    | "Defense"
    | "Rebounding"
    | "Transition"
    | "Passing"
    | "Ball Handling"
    | "Shooting"
    | "Other";
  minutes?: number; //length in minutes
  startTime?: Date;
  comments?: string;
  practicePlanId?: string;
  userId: string;
}

// an interface that describes the properties
// that a Drill document has
interface DrillDoc extends mongoose.Document {
  title: string;
  description?: string;
  category?:
    | "Offense"
    | "Defense"
    | "Rebounding"
    | "Transition"
    | "Passing"
    | "Ball Handling"
    | "Shooting"
    | "Other";
  minutes?: number; //length in minutes
  startTime?: Date;
  comments?: string;
  practicePlanId?: string;
  userId: string;
}

// an interface that describes the properties
// that a Drill model has
interface DrillModel extends mongoose.Model<DrillDoc> {
  build(attrs: DrillAttrs): DrillDoc;
}

const drillSchema = new mongoose.Schema(
  {
    title: {
      type: String, //global js String constructor
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    minutes: {
      type: Number,
      required: false,
    },
    startTime: {
      type: Date,
      required: false,
    },
    comments: {
      type: String,
      required: false,
    },
    practicePlanId: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    // modify response obj of creating a Drill
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

drillSchema.statics.build = (attrs: DrillAttrs) => {
  return new Drill(attrs);
};

const Drill = mongoose.model<DrillDoc, DrillModel>("Drill", drillSchema);

export { Drill };
