const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the Car model
const Car = require("./models/car.js");

// GET /cars/new
app.get("/cars/new", (req, res) => {
    res.render("cars/new.ejs");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});

// MIDDLEWARE
app.use(morgan('dev'));
app.use(methodOverride("_method")); // new
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// GET
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// POST /cars
app.post("/cars", async (req, res) => {
    if (req.body.isFourWheelDrive === "on") {
        req.body.isFourWheelDrive = true;
    } else {
        req.body.isFourWheelDrive = false;
    }
    await Car.create(req.body);
    res.redirect("/cars"); // redirect to index cars
});

app.get("/cars", async (req, res) => {
    const allCars = await Car.find();
    res.render("cars/index.ejs", { cars: allCars });
});

app.get("/cars/:carId", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render("cars/show.ejs", { car: foundCar });
});

app.delete("/cars/:carId", async (req, res) => {
    await Car.findByIdAndDelete(req.params.carId);
    res.redirect("/cars");
});

app.get("/cars/:carId/edit", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render("cars/edit.ejs", {
        car: foundCar,
    });
});

app.put("/cars/:carId", async (req, res) => {
    // Handle the 'isFourWheelDrive' checkbox data
    if (req.body.isFourWheelDrive === "on") {
        req.body.isFourWheelDrive = true;
    } else {
        req.body.isFourWheelDrive = false;
    }

    // Update the car in the database
    await Car.findByIdAndUpdate(req.params.carId, req.body);

    // Redirect to the car's show page to see the updates
    res.redirect(`/cars/${req.params.carId}`);
});
