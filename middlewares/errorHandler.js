import Joi from "joi";
import customErrorHandler from "../services/customErrorHandler.js";

const {ValidationError} = Joi;

const errorHandler = (err , req , res , next) => {
    let statusCode = 500;
    let data = {
        message:"internal server error",
        originalError:err.message,
    }

    if(err instanceof ValidationError){
        statusCode = 422;
        data = {
            message : err.message
        }
    }

    if(err instanceof customErrorHandler){
        statusCode = err.status;
        data = {
            message : err.msg
        }
    }

    return res.status(statusCode).json(data);
}

export default errorHandler;