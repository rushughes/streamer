/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	upload: function (req, res) {

		//sails.log.debug(req.file('file')._files);

    req.file('file').upload({
      adapter: require('skipper-s3'),
      key: sails.config.s3.key,
      secret: sails.config.s3.secret,
      bucket: sails.config.s3.bucket,
			dirname: sails.config.s3.dirname
    }, function (err, filesUploaded) {
			sails.log.debug(err);
			sails.log.debug(filesUploaded);
      if (err) return res.negotiate(err);

			var v = {
				fd: filesUploaded[0].fd,
				size: filesUploaded[0].size,
				type: filesUploaded[0].type,
				filename: filesUploaded[0].filename,
				status: filesUploaded[0].status,
				field: filesUploaded[0].field,
				location: filesUploaded[0].extra.Location,
				bucket: filesUploaded[0].extra.Bucket,
				key: filesUploaded[0].extra.Key,
				etag: filesUploaded[0].extra.ETag,
				extraSize: filesUploaded[0].extra.size,
				owner: req.session.passport.user
			};

			sails.log.debug("video: ", v);


			Video.create(v).exec(function (err, video) {
				sails.log.debug("New video created: ", video);
		    if (err) {
					sails.log.error("Video.create failed: ", err);
					return res.negotiate(err);
				}
				return res.redirect('/videos');
	    });

	  });
  },

	getAll: function (req, res) {
		Video.find({}).exec(function (err, videos) {
			if (err) {
				sails.log.error('video.find error: ', err);
			} else {
				sails.log.debug('found videos: ', videos);
				res.view('videos', { videos: videos });
			}
		})
	},

	play: function (req, res) {
		var videoid = req.param('videoid');
		sails.log.debug('Looking for video with id: '. videoid);
		Video.find({id: videoid}).exec(function (err, video) {
			if (err) {
				sails.log.error('video.find error: ', err);
			} else {
				sails.log.debug('found video: ', video);
				res.view('play', { video: video[0] });
			}
		})
	}
};
