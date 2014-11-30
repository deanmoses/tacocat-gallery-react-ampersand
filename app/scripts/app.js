//
// The actual javascript invoked by the HTML page
//

var Router = require('./routes/routes.js');

// Create and fire up the router
var router = new Router();
router.history.start();