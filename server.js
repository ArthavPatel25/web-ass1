/****************************************************************************
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Assignment: 2247 / 1
* Student Name: Arthav Patel
* Student Email: acpatel23@myseneca.ca
* Course/Section: WEB422/ZAA
* Vercel URL: 
*
*****************************************************************************/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ListingsDB = require('./modules/listingsDB.js');
const db = new ListingsDB();
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 8080;

// Get method to confirm the server is running
app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

// create new listings
app.post('/api/listings', async (req, res) => {
    try {
        let newListing = await db.addNewListing(req.body);
        res.status(201).json(newListing); // give new listing
    } catch (err) {
        res.status(500).json({ error: 'failed'});
    }
});

// get all listing based on query
app.get('/api/listings', async (req, res) => {
    let { page, perPage, name } = req.query;
    try {
        const listings = await db.getAllListings(page, perPage, name);
        res.status(200).json(listings);
    } catch (err) {
        res.status(500).json({ error: 'ffailed listings loading'});
    }
});

// return specific list accr.. to ID
app.get('/api/listings/:id', async (req, res) => {
    let { _id } = req.params; // take id
    try {
        const listing = await db.getListingById(_id);
        if (listing) {
            res.status(200).json(listing);
        } else {
            res.status(404).json({ error: 'listing not found!!!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'failed to retrieve listing'});
    }
});

// check for change
app.put('/api/listings/:id', async (req, res) => {
    let { id } = req.params;
    let new_Data = req.body;
    try {
        let solution = await db.updateListingById(new_Data, id);
        if (solution.matchedCount > 0) {
            res.status(200).json({ message: 'Listing updated' });
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'failed to update'});
    }
});

// delete
app.delete('/api/listings/:id', async (req, res) => {
    const { _id } = req.params; // for taking id
    try {
        const solution = await db.deleteListingById(_id);
        if (solution.deletedCount > 0) {
            res.status(204).send(); // send nothing 
        } else {
            res.status(404).json({ error: 'nothing found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failing in delete listing' });
    }
});

// Start server and connect to database
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
}).catch((err) => {
    console.error("Connection failed", err);
});

