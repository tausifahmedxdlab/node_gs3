const express = require('express');
const router = express.Router();
const InverterData = require("../models/InverterData.js");

// Middleware to parse URL-encoded data
router.use(express.urlencoded({ extended: true }));

// POST request to store data from query parameter
router.get('/storeData', async (req, res) => {
    try {
        const { gs } = req.query;  // Access 'gs' from the query string

        // Ensure that 'gs' exists in the query string
        if (!gs) {
            return res.status(400).json({ error: "'gs' parameter is missing in the query string" });
        }

        // Split the string on the "$" delimiter
        const dataParts = gs.split('$');

        // Validate that the data string contains the expected number of parts (12)
        if (dataParts.length !== 12) {
            return res.status(400).json({ error: 'Invalid data format. Expected 12 parts.' });
        }

        // Parse the data and create a new instance of InverterData
        const newData = new InverterData({
            imei: dataParts[0],                      // IMEI
            timestamp: new Date(dataParts[2]),        // Timestamp
            data1: parseFloat(dataParts[3]),          // Voltage 1
            data2: parseFloat(dataParts[4]),          // Current 1
            data3: parseFloat(dataParts[5]),          // Power 1
            data4: parseFloat(dataParts[6]),          // Voltage 2
            data5: parseFloat(dataParts[7]),          // Current 2
            data6: parseFloat(dataParts[8]),          // Power 2
            faultStatus: dataParts[9],                // Fault status (string)
            data7: parseFloat(dataParts[10]),         // Miscellaneous data 1
            data8: parseFloat(dataParts[11])          // Miscellaneous data 2
        });

        // Save the data to MongoDB
        const result = await newData.save();

        // Send success response with the saved data
        res.status(200).json({ message: 'Data saved successfully', data: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error saving data' });
    }
});

// GET request to retrieve data by IMEI
router.get('/get-data/:imei', async (req, res) => {
    try {
        const { imei } = req.params;

        // Ensure IMEI exists in the request
        if (!imei) {
            return res.status(400).json({ error: "IMEI parameter is missing" });
        }

        // Retrieve data from MongoDB using the IMEI
        const data = await InverterData.findOne({ imei });

        if (!data) {
            return res.status(404).json({ error: "No data found for the given IMEI" });
        }

        // Send the retrieved data as a response
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

module.exports = router;
