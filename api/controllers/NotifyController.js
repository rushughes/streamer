/**
 * NotifyController
 *
 * @description :: Server-side logic for managing notifies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var request = require('request');

 module.exports = {

 	notify: function (req, res) {

 		sails.log.debug(req.body);

		switch (req.body.Type) {
			case 'SubscriptionConfirmation':
				sails.log.debug('Requesting URL: ' . req.body.SubscribeURL);
				request.get({
  				url: req.body.SubscribeURL
				}, function(error, response, body) {
  				if (error) {
    				sails.log.error(error);
  				} else {
    				sails.log.info(response);
    				sails.log.info(body);
  				}
				});
				break;
				case 'Notification':
					sails.log.info(req.body.Subject);
					sails.log.info(JSON.parse(req.body.Message));
				break;
			default:
				sails.log.error('Unhandleable Amazon SNS Message: ', req.body);
		}
		return res.ok({});
   }

 };
