class ExpressError extends Error {
  constructor(message: string , status: number) {
    super();
    this.message = message;
    this.status = status;
  }
}

/** 404 Not Found Error */
class NotFoundError extends ExpressError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

/** 401 Unauthorized Error */
class UnauthorizedError extends ExpressError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/** 400 Bad Request Error */
class BadRequestError extends ExpressError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

/** 403 Bad Request Error */
class ForbiddenError extends ExpressError {
  constructor(message = 'Bad Request') {
    super(message, 403);
  }
}

 export {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
};
