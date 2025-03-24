class ForbiddenError extends Error {
  constructor() {
    super();
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
