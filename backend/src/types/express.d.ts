export {};

declare global {
  namespace Express {
    interface Request {
      admin?: { adminId: number; email: string };
    }
  }
}
