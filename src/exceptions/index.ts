export class NotFoundException extends Error {
  constructor(id: string) {
    super(`Entity with id ${id} was not found.`);
  }
}
