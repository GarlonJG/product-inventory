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
    // Body is modifiable, not query or params
    if (req.body) req.body = this.sanitize(req.body);

    // Sanitize each query parameter individually
    if (req.query) {
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                req.query[key] = this.sanitize(req.query[key]);
            }
        }
    }

    // Sanitize each param individually
    if (req.params) {
        for (const key in req.params) {
            if (Object.prototype.hasOwnProperty.call(req.params, key)) {
                req.params[key] = this.sanitize(req.params[key]);
            }
        }
    }
    next();
  }
}