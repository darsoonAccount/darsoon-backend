const mysql = require('mysql'); 

 const connectToDB = async () => {

    
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "darsoon2021dev",
        database: "darsoontest"
    });
    
    // con.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    // });
 
    return con;
}

module.exports = {connectToDB}
    