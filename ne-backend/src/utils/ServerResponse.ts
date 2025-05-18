import { Response } from "express";

export default class ServerResponse {
  static success<T = any>(
    res: Response,
    message = "Success",
    data?: T
  ): void {
    res.status(200).json({ status: "success", message, data });
  }

  static created<T = any>(
    res: Response,
    message = "Created",
    data?: T
  ): void {
    res.status(201).json({ status: "success", message, data });
  }

  static error(
    res: Response,
    message = "Error",
    data: any = null,
    code = 500
  ): void {
    res.status(code).json({ status: "error", message, data });
  }

  static notFound(
    res: Response,
    message = "Not Found"
  ): void {
    res.status(404).json({ status: "error", message });
  }
}
