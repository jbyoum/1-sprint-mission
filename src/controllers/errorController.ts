import { StructError } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import AlreadyExstError from '../lib/errors/AlreadyExstError';
import UnauthError from '../lib/errors/UnauthError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import FileExtError from '../lib/errors/FileExtError';
import EmptyUploadError from '../lib/errors/EmptyUploadError';
import multer from 'multer';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export function defaultNotFoundHandler(
  req: Request | RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(
  err: unknown,
  req: Request | RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  /** From superstruct or application error */
  if (err instanceof StructError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware, bad prisma data */
  if (
    (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  /** From imageController */
  if (err instanceof FileExtError) {
    return res.status(400).send({ message: 'Make sure you are uploading an image type.' });
  }

  /** From imageController */
  if (err instanceof EmptyUploadError) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  /** From imageController */
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send({ message: 'File size exceeds the 5MB limit.' });
    } else return res.status(500).send({ message: 'File upload failed.' });
  }

  /** From userService */
  if (err instanceof UnauthError) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  /** From ~~Auth */
  if (err instanceof ForbiddenError) {
    return res.status(403).send({ message: 'Forbidden' });
  }

  /** From ~~Service */
  if (
    err instanceof AlreadyExstError ||
    (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
  ) {
    return res.status(422).send({ message: 'Already Exist' });
  }

  /** Prisma error codes */
  if (err instanceof Error && 'code' in err) {
    console.error(err);
    return res.status(500).send({ message: 'Failed to process data' });
  }

  /** Application error */
  if (
    err instanceof NotFoundError ||
    (err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === 'P2001' || err.code === 'P2025'))
  ) {
    return res.status(404).send({ message: 'Not Found' });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}
