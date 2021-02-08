import { CustomError } from "@dbticketsudemy/common";
import { ValidationError } from "joi";

// error for joi validation to match the custom RequestValidationError for the express-validator
export class JoiRequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public error: ValidationError) {
    super("Invalid request parameters");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, JoiRequestValidationError.prototype);
  }

  serializeErrors() {
    return this.error.details.map((err) => {
      return { message: err.message, field: err.context?.label };
    });
  }
}
