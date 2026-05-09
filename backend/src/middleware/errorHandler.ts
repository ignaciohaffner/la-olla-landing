import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      fields: err.issues.map((e: ZodIssue) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  } else {
    console.error('Internal error:', (err as Error)?.message);
  }

  res.status(500).json({ error: 'Internal server error' });
}
