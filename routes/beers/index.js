var express = require('express');
var router = express.Router();

router.use(require("./beers")); // get /beers
router.use(require("./delete"));
router.use(require("./random")); 
router.use(require("./search")); 
router.use(require("./detail")); // get /beers/:id
router.use(require("./new")); 

module.exports = router;