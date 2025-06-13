class Helpers {
    
    responseSuccess = (message, data = null) => {
        return {
            state: "success",
            message,
            data
        };
    }

    responseError = (message, data = null) => {
        return {
            state: "error",
            message,
            data
        };
    }
}

module.exports = new Helpers();
