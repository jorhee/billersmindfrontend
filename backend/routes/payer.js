//payer routes
//[dependencies and modules]
const express = require("express");

const payerController = require("../controllers/payer");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;


//[routing component]
const router = express.Router();



// routes/payerRoutes.js

// Route for adding a payer
router.post('/add-payer', verify, isLoggedIn, verifyAdmin, payerController.addPayer);

// Route to retrieve all payers
router.get('/all', verify, isLoggedIn, verifyAdmin, payerController.getAllPayers);

// Route to update a payer by ID
router.put('/update/:id', verify, isLoggedIn, verifyAdmin, payerController.updatePayer);

// Route to delete a payer
router.delete('/delete/:id', verify, isLoggedIn, verifyAdmin, payerController.deletePayer);

//[export route system]
module.exports = router;