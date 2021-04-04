import {
  Publisher,
  Subjects,
  PracticePlanCreatedEvent,
} from '@db-coaching/common';

export class PlanCreatedPublisher extends Publisher<PracticePlanCreatedEvent> {
  readonly subject = Subjects.PracticePlanCreated;
  // or
  // subject: Subjects.PracticePlanCreated = Subjects.PracticePlanCreated
}
