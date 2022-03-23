
import { isHttpError } from "http-errors";

export const expressErrorHandler = () => {
    return (err, req, res, next) => {
        if (!isHttpError(err)) {
            err.name = 'InternalServerError';
            err.message = 'Internal Server Error';
            err.statusCode = 500;
        }

        const response = {
            error: err.name,
            statusCode: err.statusCode || err.errorCode || err.status || 500,
            message: err.message,
            code: err.code
        };

        res.status(response.statusCode);
        res.json(response);
        res.end();
    };
};
