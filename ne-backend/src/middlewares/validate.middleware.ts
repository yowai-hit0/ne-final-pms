import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import ServerResponse from "../utils/ServerResponse";

/**
 * Validate req[property] (default 'body') against the given DTO class.
 * On error, sends 400 and stops the chain.
 */
export function validateRequest(
  DTO: ClassConstructor<object>,
  property: "body" | "query" | "params" = "body"
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const instance = plainToInstance(DTO, req[property]);
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .flatMap(err => Object.values(err.constraints || {}))
        .join(", ");
      ServerResponse.error(res, messages, null, 400);
      return;
    }

    // Replace with validated instance
    (req as any)[property] = instance;
    next();
  };
}
