/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	upload: function (req, res) {

		//sails.log.debug(req.file('file')._files);

    req.file('file').upload({
      adapter: require('skipper-s3'),
      key: sails.config.s3.key,
      secret: sails.config.s3.secret,
      bucket: sails.config.s3.bucket
    }, function (err, filesUploaded) {
			sails.log.debug(err);
			sails.log.debug(filesUploaded);
      if (err) return res.negotiate(err);
      return res.ok({
        files: filesUploaded,
        textParams: req.params.all()
      });
    });
  }

};
