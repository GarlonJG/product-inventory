import { Injectable, NestMiddleware } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly helmetMiddleware: ReturnType<typeof helmet>;
  private readonly limiter: ReturnType<typeof rateLimit>;

  constructor() {
    this.helmetMiddleware = helmet();
    this.limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: (req) => {
        // Be more permissive with POST requests
        if (req.method === 'POST') return 100; // 100 POST requests per 15 minutes
        return 40; // 40 requests for other methods
      },
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again after 15 minutes',
      skip: (req) => ['/health', '/status', '/api/items/import'].some(path => req.path.startsWith(path)),
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Apply rate limiting first
    this.limiter(req, res, () => {
      this.helmetMiddleware(req, res, next);
    });
  }
}