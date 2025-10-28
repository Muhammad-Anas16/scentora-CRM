
const helperFunction = (status, data = null, error = false, message = "") => {
    return Response.json({
        success: !error,
        message,
        data,
        error
    },
        { status }
    )
}

export default helperFunction;
