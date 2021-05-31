import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { DrillCategories } from '@db-coaching/common';

// an interface that describes the properties
// required to create a new Drill
interface DrillAttrs {
  id: string;
  title: string;
  description?: string;
  category?: DrillCategories;
  comments?: string;
  userId: string;
}

// an interface that describes the properties
// that a Drill document has
export interface DrillDoc extends mongoose.Document {
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
  findByEvent(event: { id: string; version: number }): Promise<DrillDoc | null>;
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

// Static Methods

/**
 * find a ticket when processing an event
 * find by id and the version before the event was recieved
 * this forces events to be processed in order
 */
drillSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Drill.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

drillSchema.statics.build = (attrs: DrillAttrs) => {
  return new Drill({
    _id: attrs.id, //allows to replicate id's accross services
    ...attrs,
  });
};

const Drill = mongoose.model<DrillDoc, DrillModel>('Drill', drillSchema);

export { Drill };
