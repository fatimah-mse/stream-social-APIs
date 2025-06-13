const jwt = require("jsonwebtoken");

const token = jwt.verify(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzM1MGMwYzBkNmIxMjdkZWYyODc4NCIsImVtYWlsIjoic2FtZXJyYW1pQGdtYWlsLmNvbSIsImlhdCI6MTc0ODE5MzQ3Mn0.ELUin__XCo5vkZUSiLiYAvfexJpXuul8bmClj42ruW4", 
    "8391a04fc9d9d2071be926059948782554532ff66c34dd30a0c2cf9c42b6a0a0");

console.log(token)