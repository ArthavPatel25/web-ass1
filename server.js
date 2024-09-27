/****************************************************************************
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Assignment: 2247 / 1
* Student Name: [Your Name]
* Student Email: [Your Email]
* Course/Section: WEB422/ZAA
* Deployment URL: https://www.your.assignment.com
*
*****************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ListingsDB = require('./modules/listingsDB');

dotenv.config();

const app = express();
const db = new ListingsDB();
const PORT = process.env.PORT || 8080; // Default port 8080 if not specified in .env

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
  });

// Root route to check server status
app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});

// API Routes
app.post('/api/listings', async (req, res) => {
  try {
    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

app.get('/api/listings', async (req, res) => {
  try {
    const { page, perPage, name } = req.query;
    const listings = await db.getAllListings(page, perPage, name);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve listings' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
    } else {
      res.json(listing);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve listing' });
  }
});

app.put('/api/listings/:id', async (req, res) => {
  try {
    const updatedListing = await db.updateListingById(req.body, req.params.id);
    if (updatedListing.nModified === 0) {
      res.status(404).json({ error: 'Listing not found' });
    } else {
      res.status(200).json({ message: 'Listing updated successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    const deletedListing = await db.deleteListingById(req.params.id);
    if (!deletedListing.deletedCount) {
      res.status(404).json({ error: 'Listing not found' });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});
