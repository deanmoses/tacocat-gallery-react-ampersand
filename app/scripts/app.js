//
// The actual javascript invoked by the HTML page
//

var Router = require('./routes/routes.js');
var User = require('./models/user.js');

// Create and fire up the router
var router = new Router();
router.history.start();

// Get the user's info, if any, by fetching a user object
User.fetchUser();