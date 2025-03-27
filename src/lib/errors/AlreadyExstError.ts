class AlreadyExstError extends Error {
  constructor(modelName) {
    super(`${modelName} already exists`);
    this.name = 'AlreadyExstError';
  }
}

export default AlreadyExstError;
