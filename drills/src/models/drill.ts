import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { DrillCategories } from '@db-coaching/common';

// an interface that describes the properties
// required to create a new Drill
interface DrillAttrs {
  title: string;
  description?: string;
  category?: DrillCategories;
  comments?: string;
  userId: string;
}

// an interface that describes the properties
// that a Drill document has
interface DrillDoc extends mongoose.Document {
  title: string;
  description?: string;
  category?: DrillCategories;
  comments?: string;
  userId: string;
  version: number;
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
    // modify response obj of creating a Drill
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// track version of drill
drillSchema.set('versionKey', 'version');
drillSchema.plugin(updateIfCurrentPlugin);

drillSchema.statics.build = (attrs: DrillAttrs) => {
  return new Drill(attrs);
};

const Drill = mongoose.model<DrillDoc, DrillModel>('Drill', drillSchema);

export { Drill };
