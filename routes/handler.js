
 const express = require('express');
 
const router = express.Router();

// Controllers
const enviControllers = require("../controllers/compose.js");

 router.post("/upload_design", enviControllers.UploadDesign);
  router.get("/make_zip", enviControllers.makeZipFile);
 router.get("/dowinload", enviControllers.Dowinload);
  
module.exports = router;