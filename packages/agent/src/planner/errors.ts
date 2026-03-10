export class PlannerModelResponseError extends Error {
  public readonly rawText?: string;

  public constructor(message: string, rawText?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PlannerModelResponseError";
    this.rawText = rawText;
    Object.setPrototypeOf(this, PlannerModelResponseError.prototype);
  }
}

export class PlannerOutputParseError extends Error {
  public readonly rawText: string;

  public constructor(message: string, rawText: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PlannerOutputParseError";
    this.rawText = rawText;
    Object.setPrototypeOf(this, PlannerOutputParseError.prototype);
  }
}

export class PlannerOutputValidationError extends Error {
  public readonly rawText: string;
  public readonly validationError: Error;

  public constructor(
    message: string,
    rawText: string,
    validationError: Error
  ) {
    super(message, { cause: validationError });
    this.name = "PlannerOutputValidationError";
    this.rawText = rawText;
    this.validationError = validationError;
    Object.setPrototypeOf(this, PlannerOutputValidationError.prototype);
  }
}
