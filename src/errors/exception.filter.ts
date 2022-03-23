import {NextFunction, Request, Response} from "express";
import {IExceptionFilter} from "./exception.filter.interface";
import {HTTPError} from "./http-error.class";
import {inject, injectable} from "inversify";
import {ILogger} from "../logger/logger.interface";
import {TYPES} from "../types";
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.logger = logger;
        this.logger.log('Exception filter is registered')
    }

    catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
        if (err instanceof HTTPError) {
            this.logger.error(`[${err.context}] Error: ${err.statusCode} ${err.message}`);
            res.status(err.statusCode).send({err: err.message});
        } else {
            this.logger.error(`${err.message}`)
            res.status(500).send({err: err.message});
        }
    }
}