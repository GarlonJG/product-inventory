// src/common/middleware/sanitization.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Setup jsdom window environment for DOMPurify to work server-side
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

@Injectable()
export class SanitizationMiddleware implements NestMiddleware {
  // Recursive sanitizer for any object/array/string fields
  sanitize(value: any): any {
    if (typeof value === 'string') return DOMPurify.sanitize(value.trim());
    if (Array.isArray(value)) return value.map((v) => this.sanitize(v));
    
    if (value && typeof value === 'object') {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          value[key] = this.sanitize(value[key]);
        }
      }
      return value;
    }
    return value;
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.body) req.body = this.sanitize(req.body);
    if (req.query) req.query = this.sanitize(req.query);
    if (req.params) req.params = this.sanitize(req.params);
    next();
  }
}