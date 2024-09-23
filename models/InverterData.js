const mongoose = require('mongoose');

const inverterDataSchema = new mongoose.Schema({
    imei: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,  // Default to the current date/time if not provided
    },
    data1: {
        type: Number,
        required: true,
    },
    data2: {
        type: Number,
        required: true,
    },
    data3: {
        type: Number,
        required: true,
    },
    data4: {
        type: Number,
        required: true,
    },
    data5: {
        type: Number,
        required: true,
    },
    data6: {
        type: Number,
        required: true,
    },
    faultStatus: {
        type: String,
        required: true,
    },
    data7: {
        type: Number,
        required: true,
    },
    data8: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

const InverterData = mongoose.model('InverterData', inverterDataSchema);
module.exports = InverterData;
