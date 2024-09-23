// Import required modules
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const InverterData = require("./models/InverterData");  // Ensure this path is correct
const MONGO_URL = "mongodb+srv://ritiksom122:ritiksom122@cluster0.jg7w9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0s"
// Initialize the Express app
const app = express();

// MongoDB connection URL from environment variables
const URL = MONGO_URL;

// Check if MongoDB URL is set
if (!URL) {
    console.error("MongoDB URL is not defined in environment variables");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data

// Helper function to parse data string
const parseDataString = (dataString) => {
    const dataArray = dataString.split('$');
    
    if (dataArray.length !== 12) {
        throw new Error('Invalid data format. Expected 12 parts.');
    }

    return {
        imei: dataArray[0],
        timestamp: new Date(dataArray[2]),  // Parsing timestamp
        data1: parseFloat(dataArray[3]),
        data2: parseFloat(dataArray[4]),
        data3: parseFloat(dataArray[5]),
        data4: parseFloat(dataArray[6]),
        data5: parseFloat(dataArray[7]),
        data6: parseFloat(dataArray[8]),
        faultStatus: dataArray[9],  // No parsing needed for string
        data7: parseFloat(dataArray[10]),
        data8: parseFloat(dataArray[11])
    };
};

// Route to store inverter data
app.get('/storeData', async (req, res) => {
    try {
        // Log the request body and headers for debugging
        console.log("Request body:", req.body);
        console.log("Headers:", req.headers);

        // Check if the 'gs' query parameter exists
        const dataString = req.query.gs;
        if (!dataString) {
            return res.status(400).json({ error: "'gs' parameter is missing in the query string" });
        }

        // Parse the data string
        const parsedData = parseDataString(dataString);

        // Create a new inverter data object
        const newData = new InverterData(parsedData);

        // Save the data to the MongoDB database
        const result = await newData.save();
        
        // Send success response
        res.status(200).json({ message: 'Data saved successfully', result });
    } catch (error) {
        console.error("Error:", error); 
        res.status(500).json({ error: 'Error saving data', details: error.message });
    }
});

// Route to get inverter data by IMEI
app.get('/get-data/:imei', async (req, res) => {
    try {
        // Find data in the database by IMEI
        const data = await InverterData.find({ imei: req.params.imei });
        
        if (data.length === 0) {
            return res.status(404).json({ error: 'No data found for the given IMEI' });
        }

        // Send found data as the response
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error fetching data', details: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
