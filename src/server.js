require("dotenv").config()

const app = require("./app")
const mongoose = require("mongoose")

const PORT = process.env.PORT || 4000
const MONGOURL = process.env.MONGOURL

mongoose.connect(MONGOURL)
    .then(e => {
        // connect to database is done
        console.log("Connected to Database Successfuly")

        // server listening
        app.listen(PORT, () => {
            console.log(`Server is running successfuly on port: ${PORT}`)
        });
    })
    .catch(error => {
        console.log(error.message)
    })