import { Publisher, Subjects, DrillCreatedEvent } from '@db-coaching/common';

export class DrillCreatedPublisher extends Publisher<DrillCreatedEvent> {
  readonly subject = Subjects.DrillCreated;
  // or
  // subject: Subjects.DrillCreated = Subjects.DrillCreated
}
