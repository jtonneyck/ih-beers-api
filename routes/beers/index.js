var express = require('express');
var router = express.Router();

router.use(require("./delete"));
router.use(require("./random")); 
router.use(require("./beers")); // get /beers
router.use(require("./detail")); // get /beers/:id
router.use(require("./new")); 
router.use(require("./search")); 

module.exports = router;