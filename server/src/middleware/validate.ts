import { Request, Response, NextFunction } from 'express';

type ValidationSchema = {
  [key: string]: {
    required?: boolean;
    type?: string;
    maxLength?: number;
    enum?: string[];
  };
};

export function validateBody(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field}은(는) 필수 항목입니다`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field}의 타입이 올바르지 않습니다`);
        }
        if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
          errors.push(`${field}은(는) ${rules.maxLength}자 이내여야 합니다`);
        }
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field}의 값이 올바르지 않습니다`);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join(', ') });
      return;
    }

    next();
  };
}
