import { Response } from 'express';

interface SuccessResponseArgs {
  res: Response;
  status?: number;
  data?: unknown;
  message?: string;
}

interface ErrorResponseArgs {
  res: Response;
  error?: unknown;
  status?: number;
  message?: string;
}

const MESSAGE_ERROR_DEFAULT = 'Internal server error';

export const successResponse = ({ res, status = 200, data, message }: SuccessResponseArgs) =>
  res.status(status).json({ data, error: false, message, success: true });

export const errorResponse = ({
  res,
  error,
  status = 500,
  message = MESSAGE_ERROR_DEFAULT
}: ErrorResponseArgs) => {
  if(error instanceof Error) return res.status(status).json({ error: true, message: error.message, success: false });

  return res.status(status).json({ error: true, message, success: false });
};