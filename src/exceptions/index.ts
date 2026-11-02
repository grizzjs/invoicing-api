export class NotFoundException extends Error {
  constructor(model: string, id: string) {
    super(`Entity [${model}] with id ${id} was not found.`);
  }
}

export class UnprocessableEntityException extends Error {
  constructor(model: string, message?: string) {
    super(`Failed to process entity [${model}] generation. ${message}`);
  }
}
