import { Request, Response, NextFunction } from "express"

const wrapAsyncMiddleware =
  (fn: (...args: [Request, Response, NextFunction]) => Promise<void>) =>
  (...args: [Request, Response, NextFunction]) =>
    fn(...args).catch(args[2])

export default wrapAsyncMiddleware
