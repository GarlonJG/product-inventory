import { Injectable, NestMiddleware } from '@nestjs/common';
import xss from 'xss-clean';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private xssMiddleware;
  private helmetMiddleware;
  private limiter;

  constructor() {
    // Initialize the middleware from the libraries
    this.xssMiddleware = xss();
    this.helmetMiddleware = helmet();
    this.limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: (req) => {
        // Be more permissive with POST requests
        if (req.method === 'POST') return 100; // 100 POST requests per 15 minutes
        return 40; // 40 requests for other methods
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: 'Too many requests from this IP, please try again after 15 minutes',
      skip: (req) => ['/health', '/status', '/api/items/import'].some(path => req.path.startsWith(path)),
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.helmetMiddleware(req, res, () => {
      this.xssMiddleware(req, res, () => {
        this.limiter(req, res, next);
      });
    });
  }
}