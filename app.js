const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const port = 3000;

// Connect to MongoDB
// 'mongodb://<docker_service_name>:port/database?options...'
mongoose.connect("mongodb://mongo:27017/assignmentDB");

// Define a simple model with coordinates as GeoJSON
const Item = mongoose.model("Item", {
  _id: String,
  name: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number], // <lng, lat>
    },
  },
});

app.use(express.json());

// Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// endpoint for import file
app.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const jsonData = JSON.parse(req.file.buffer.toString());

    for (const item of jsonData) {
      const newItem = new Item({
        _id: item._id,
        name: item.name,
        location: {
          type: "Point",
          coordinates: [item.longitude, item.latitude],
        },
      });
      await newItem.save();
    }

    res.status(200).send("Data imported successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// endpoint for querying nearby locations
app.get("/nearby", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required." });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];

    const nearbyLocations = await Item.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates,
          },
          $maxDistance: 5000,
        },
      },
    });

    res.json(nearbyLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handling 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
