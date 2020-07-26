const express = require("express");
const app = express();
const request = require("request");
const pool = require("./dbPool.js");

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get("/", async function (req, res) {

    let imageUrlArray = await getRandomImage("", 1);
    res.render("index", { "imageUrlArray": imageUrlArray });

});

app.get("/search", async function (req, res) {

    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }

    let imageUrlArray = await getRandomImage(keyword, 9);
    console.log(`imageUrlArray: ${imageUrlArray}`);
    res.render("results", { "imageUrlArray": imageUrlArray });


});

app.get("/api/updateFavorites", function (req, res) {
    let sql;
    let sqlParams;
    switch (req.query.action) {
        case "add": sql = "INSERT INTO favorites (imageUrl, keyword) VALUES (?,?)";
            sqlParams = [req.query.imageUrl, req.query.keyword];
            break;
        case "delete": sql = "DELETE FROM favorites WHERE imageUrl = ?";
            sqlParams = [req.query.imageUrl];
            break;
    }//switch
    pool.query(sql, sqlParams, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.send(rows.affectedRows.toString());
    });

});//api/updateFavorites

app.get("/getKeywords", function (req, res) {
    let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
    let imageUrlArray = ["img/favorite.png"];
    pool.query(sql, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.render("favorites", { "imageUrlArray": imageUrlArray, "rows": rows });
    });
});//getKeywords

app.get("/api/getFavorites", function (req, res) {
    let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
    let sqlParams = [req.query.keyword];
    pool.query(sql, sqlParams, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });

});//api/getFavorites



function getRandomImage(keyword, count) {
    return new Promise(function (resolve, reject) {

        let requestUrl = `https://api.unsplash.com/photos/random/?count=${count}&client_id=0CCjrWKZGr_JtjEqj2fiDcUOjea4Uj3hBiFwzyxcyqk&featured=true&orientation=landscape&query=${keyword}`;

        request(requestUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsedData = JSON.parse(body);

                let imageUrlArray = [];
                for (let i = 0; i < count; i++) {
                    imageUrlArray.push(parsedData[i]["urls"]["regular"]);
                }

                resolve(imageUrlArray);
            } else {
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                reject(error);
            }
        });

    });
    d
}

app.listen(process.env.PORT, process.env.IP,
    function () {
        console.log("Express server is running");
    });