const app = require ("./app");
const PORT = process.env.PORT || 8080;


// set port, listen for requests
const startApp = () =>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
}





startApp();