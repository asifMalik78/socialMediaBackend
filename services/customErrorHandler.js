class customErrorHandler extends Error{
    constructor(status , msg){
        super();
        this.status = status;
        this.msg = msg;
    }

    static alreadyExist(message){
        return new customErrorHandler(409 , message);
    }

    static wrongCredentials(message = "email or password is wrong"){
        return new customErrorHandler(401 , message);
    }

    static unAuthorized(message = "unAuthorized"){
        return new customErrorHandler(401 , message);
    }

    static notFound(message = "404 not found"){
        return new customErrorHandler(404 , message);
    }

    static serverError(message = "internal server error"){
        return new customErrorHandler(500 , message);
    }
}

export default customErrorHandler;