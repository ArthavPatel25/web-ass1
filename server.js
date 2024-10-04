/****************************************************************************
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Assignment: 2247 / 1
* Student Name: ABHI MANSUKHBHAI CHAKRANI
* Student Email: amchakrani@myseneca.ca
* Course/Section: WEB422/ZAA
* Deployment URL:
*
*****************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ListingsDB = require("./modules/listingsDB");
const db = new ListingsDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: `API Listening` });
});


app.post("/api/listings", async (req, res) => {
   
    try {
      const result = await db.addNewListing(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

app.get("/api/listings", async (req, res) => {
    
    try {
      const { page, perPage, name } = req.query;
     
      const listings = await db.getAllListings(page, perPage, name);
      if (listings.length === 0) {
        res.status(404).json({ error: "No listings found" });
      } else {
        res.status(200).json(listings);
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve listings" });
    }
  });




app.get("/api/listings/:id", async (req, res) => {
    
    try {
      const listing = await db.getListingById(req.params.id);
      if (!listing) {

        res.status(404).json({ error: " Not found" });
      } else {
        res.status(200).json(listing);
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve listing" });
    }
  });



app.put("/api/listings/:id", async (req, res) => {
    try {
      const result = await db.updateListingById(req.body, req.params.id);
      if (!result) {
        res.status(404).json({ error: " Not found" });
      } else {
        res.status(200).json({ message: "Updated successfully" });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to update " });
    }
  });


app.delete("/api/listings/:id", async (req, res) => {
    try {
      const result = await db.deleteListingById(req.params.id);
      if (!result) {
        res.status(404).json({ error: "Not Found" });
      } else {
        res.status(204).send();       }
    } catch (err) {
      res.status(500).json({ error: "Failed to Delete " });
    }
  });

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
  console.log(`server listening on: ${HTTP_PORT}`);
  });
 }).catch((err)=>{
  console.log(err);
 });

// app.get("/", (req, res) => {
//   res.json({ message: "API Listening" });
// });
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });