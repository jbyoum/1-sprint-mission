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
import EnvVarError from '../lib/errors/EnvVarError';
import CommonError from '../lib/errors/CommonError';

export function defaultNotFoundHandler(_req: Request, res: Response, next: NextFunction) {
  res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(err: unknown, _req: Request, res: Response, next: NextFunction) {
  /** From superstruct or application error */
  if (err instanceof StructError) {
    res.status(400).send({ message: err.message });
  } else if (
    /** From express.json middleware, bad prisma data */
    (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    res.status(400).send({ message: 'Invalid JSON' });
  } else if (err instanceof FileExtError) {
    /** From imageController */
    res.status(400).send({ message: 'Make sure you are uploading an image type.' });
  } else if (err instanceof EmptyUploadError) {
    /** From imageController */
    res.status(400).send({ message: 'No file uploaded.' });
  } else if (err instanceof multer.MulterError) {
    /** From imageController */
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).send({ message: 'File size exceeds the 5MB limit.' });
    } else res.status(500).send({ message: 'File upload failed.' });
  } else if (err instanceof UnauthError) {
    /** From userService */
    res.status(401).send({ message: 'Unauthorized' });
  } else if (err instanceof ForbiddenError) {
    /** From ~~Auth */
    res.status(403).send({ message: err.message });
  } else if (
    /** Application error */
    err instanceof NotFoundError
  ) {
    res.status(404).send({ message: err.message });
  } else if (
    /** Prisma contraint error */
    err instanceof Prisma.PrismaClientKnownRequestError &&
    (err.code === 'P2001' || err.code === 'P2025')
  ) {
    res.status(404).send({ message: 'Not Found' });
  } else if (
    /** From ~~Service */
    err instanceof AlreadyExstError
  ) {
    res.status(422).send({ message: err.message });
  } else if (
    /** Prisma contraint error */
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    res.status(422).send({ message: 'Already Exist' });
  } else if (err instanceof EnvVarError) {
    /** Env Variable error */
    res.status(500).send({ message: 'Missing Environment Variable' });
  } else if (err instanceof CommonError) {
    res.status(err.status).send({ message: err.message });
  } else if (err instanceof Error && 'code' in err) {
    /** Prisma error codes */
    if (process.env.NODE_ENV !== 'test') console.error(err);
    res.status(500).send({ message: 'Failed to process data' });
  } else {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    res.status(500).send({ message: 'Internal server error' });
  }
}
