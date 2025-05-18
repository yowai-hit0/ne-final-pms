import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";
import ServerResponse from "../utils/ServerResponse";

/**
 * Validates req[property] against the provided DTO class.
 * property: "body" (default) | "query" | "params"
 */
export function validateRequest(
  DTO: ClassConstructor<object>,
  property: "body" | "query" | "params" = "body"
): RequestHandler {
  return async (req, res, next) => {
    const instance = plainToInstance(DTO, req[property]);
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      const messages = errors
        .flatMap((err) => Object.values(err.constraints || {}))
        .join(", ");
      ServerResponse.error(res, messages, null, 400);
      return;
    }
    // replace with validated instance
    (req as any)[property] = instance;
    next();
  };
}
