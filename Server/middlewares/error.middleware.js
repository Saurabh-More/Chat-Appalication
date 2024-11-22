const errorMiddleware = (err,req,res,next) =>
{
    err.message=err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code===11000)
    {
        const error=Object.keys(err.keyPattern);
        err.message=`Duplicate Field - ${error}`
        err.statusCode=400;
    }

    if(err.name==="CastError")
    {
        err.statusCode=400;
        err.message=`Invalid format of ${err.path}`;
    }

    const response = {
        success:false,
        message:err.message,
    };
   
    if(process.env.NODE_ENV === "DEVELOPMENT")
    {
        response.error = err;
    }

    return res.status(err.statusCode).json(response);
};

export { errorMiddleware };
