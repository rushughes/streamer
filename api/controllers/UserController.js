/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
	 * `UserController.signup()`
	 */
	signup: function (req, res) {
	  User.create(req.params.all()).exec(function (err, user) {
			sails.log.debug("New user created: ", user);
	    if (err) {
				sails.log.error("User.create failed: ", err);
				return res.negotiate(err);
			}
	    req.login(user, function (err){
	      if (err) {
					sails.log.error("req.login failed: ", err);
					return res.negotiate(err);
				}
	      return res.redirect('/upload');
	    });
	  });
	}
};
