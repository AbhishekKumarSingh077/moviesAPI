/*********************************************************************************
* WEB422 – Assignment 1 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: ABHISHEK KUMAR SINGH Student ID: 133410209 Date: 1_/09/2022
* Cyclic Link: _______________________________________________________________ 
* ********************************************************************************/

const express = require("express");
const app = express();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const cors = require("cors");
const HTTP_PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());
require('dotenv').config();
app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
})


app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body).then(function () {
        res.status(201).json(`The movie has been added successfully.`);
    }).catch(function (err) {
        res.status(204).json({ message: "Some error occured!" });
    })
})


app.get("/api/movies", (req, res) => {
    if (!req.query.page || !req.query.perPage) {
        res.status(400).json({ message: "Required parameters are missing!" })
    }
    else {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then(function (data) {
            res.status(200).json(data);
        }).catch(function (err) {
            res.status(404).json({ message: "Requested Content not found" });
        })
    }
})


app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id).then(function (data) {
        res.status(200).json(data);
    }).catch(function (err) {
        res.status(404).json({ message: "Requested Content not found" });
    })
})


app.put("/api/movies/:id", (req, res) => {
    db.updateMovieById(req.body, req.params.id).then(function () {
        res.status(200).json({ message: "This movie has been updated" })
    }).catch(function (err) {
        res.status(404).json({ message: "Requested content not found!" });
    })
})


app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id).then(() => {
        res.status(200).json({ message: "This movie has been deleted" });
    }).catch((err) => {
        res.status(500).json({ message: "Unable to delete the movie!" });
    })
})

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});