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


   
    res.status(err.statusCode).json(
    {
        success:false,
        message: process.env.NODE_ENV === "DEVELOPMENT" ? err : err.message,
    });
};

export { errorMiddleware };
