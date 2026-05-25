function validate (schema){
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch(err){
            res.status(400).json({
                success : false,
                message : "Validation error",
                errors : err.errors
            })
        }
    }
}

export default validate;