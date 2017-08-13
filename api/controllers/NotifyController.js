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
          //for now we assuem all messages are from Transcoder
          var message = JSON.parse(req.body.Message);
          Video.update({key: message.input.key}, {
            outputKeyPrefix: outputKeyPrefix,
            thumbnailPattern: message.outputs[0].thumbnailPattern,
            segmentDuration: message.outputs[0].segmentDuration,
            duration: message.outputs[0].duration,
            width: message.outputs[0].width,
            height: message.outputs[0].height,
            playlist: message.playlists[0].name
          }).exec(function afterwards(err, video){
            if (err) {
              sails.log.err("Failed updating transcoded video: ", err);
            } else {
              sails.log.debug("Finished transcoding: ", video);
            }
          });
				break;
			default:
				sails.log.error('Unhandleable Amazon SNS Message: ', req.body);
		}
		return res.ok({});
   }

 };

/*
2017-08-13T13:46:26.996150+00:00 app[web.1]: { Type: 'Notification',
2017-08-13T13:46:26.996165+00:00 app[web.1]:   MessageId: '1a6ab517-067e-5bc0-b219-e71d5c0c2754',
2017-08-13T13:46:26.996166+00:00 app[web.1]:   TopicArn: 'arn:aws:sns:us-west-2:724139252277:streamer',
2017-08-13T13:46:26.996168+00:00 app[web.1]:   Subject: 'Amazon Elastic Transcoder has finished transcoding job 1502631977930-rabioh.',
2017-08-13T13:46:26.996170+00:00 app[web.1]:   Message: '{\n  "state" : "COMPLETED",\n  "version" : "2012-09-25",\n  "jobId" : "1502631977930-rabioh",\n  "pipelineId" : "1502609200466-80khou",\n  "input" : {\n    "key" : "video/97f0fc90-4f75-4c03-a3a2-1f8ee76892cd.mp4"\n  },\n  "inputCount" : 1,\n  "outputKeyPrefix" : "HLS/97f0fc90-4f75-4c03-a3a2-1f8ee76892cd-1502631977694",\n  "outputs" : [ {\n    "id" : "1",\n    "presetId" : "1351620000001-200055",\n    "key" : "/output/400k",\n    "thumbnailPattern" : "thumbs-97f0fc90-4f75-4c03-a3a2-1f8ee76892cd-{count}",\n    "segmentDuration" : 10.0,\n    "status" : "Complete",\n    "duration" : 6,\n    "width" : 400,\n    "height" : 228\n  } ],\n  "playlists" : [ {\n    "name" : "/97f0fc90-4f75-4c03-a3a2-1f8ee76892cd-master-playlist",\n    "format" : "HLSv4",\n    "outputKeys" : [ "/output/400k" ],\n    "status" : "Complete"\n  } ]\n}',
2017-08-13T13:46:26.996171+00:00 app[web.1]:   Timestamp: '2017-08-13T13:46:26.652Z',
2017-08-13T13:46:26.996172+00:00 app[web.1]:   SignatureVersion: '1',
2017-08-13T13:46:26.996173+00:00 app[web.1]:   Signature: 'hEBxX2JNto6ng8eja4eohgXYCKcAZThydZdMWGaeWCuz5k4x8bkMq6aZn7r4w9VXKv0YB013800Ni4ydGknPVGYxFtmCj4awXB+7IPTgGhZnGBy3CpeJvOy4Pz3klyyTg+dfUJdaepOVrgUaLsf4qEuXiCfSJRvVD06TGYxd8LeQXAp5/N5v3MNI71rkrx7mjK05+t5ZJ8aGs6Z1VwpPrRD+xQkdyB2U4KC9/G1fExFsH7aPrPJAPRvlykuDYWTh+6OGyjTpccamTFplmDjCC5+S4xOpT4QXapijVSEe+wEkRj8rjJaSGEXYMubS6gLPuu5KGJc7uNUUOE4jjESC2w==',
2017-08-13T13:46:26.996175+00:00 app[web.1]:   SigningCertURL: 'https://sns.us-west-2.amazonaws.com/SimpleNotificationService-b95095beb82e8f6a046b3aafc7f4149a.pem',
2017-08-13T13:46:26.996176+00:00 app[web.1]:   UnsubscribeURL: 'https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:724139252277:streamer:f9309d21-cdca-4794-90a6-b9e674dcaa53' }
2017-08-13T13:46:26.996271+00:00 app[web.1]: Amazon Elastic Transcoder has finished transcoding job 1502631977930-rabioh.
2017-08-13T13:46:26.997292+00:00 app[web.1]: { state: 'COMPLETED',
2017-08-13T13:46:26.997294+00:00 app[web.1]:   version: '2012-09-25',
2017-08-13T13:46:26.997295+00:00 app[web.1]:   jobId: '1502631977930-rabioh',
2017-08-13T13:46:26.997295+00:00 app[web.1]:   pipelineId: '1502609200466-80khou',
2017-08-13T13:46:26.997296+00:00 app[web.1]:   input: { key: 'video/97f0fc90-4f75-4c03-a3a2-1f8ee76892cd.mp4' },
2017-08-13T13:46:26.997297+00:00 app[web.1]:   inputCount: 1,
2017-08-13T13:46:26.997298+00:00 app[web.1]:   outputKeyPrefix: 'HLS/97f0fc90-4f75-4c03-a3a2-1f8ee76892cd-1502631977694',
2017-08-13T13:46:26.997298+00:00 app[web.1]:   outputs:
2017-08-13T13:46:26.997299+00:00 app[web.1]:    [ { id: '1',
2017-08-13T13:46:26.997300+00:00 app[web.1]:        presetId: '1351620000001-200055',
2017-08-13T13:46:26.997300+00:00 app[web.1]:        key: '/output/400k',
2017-08-13T13:46:26.997301+00:00 app[web.1]:        thumbnailPattern: 'thumbs-97f0fc90-4f75-4c03-a3a2-1f8ee76892cd-{count}',
2017-08-13T13:46:26.997302+00:00 app[web.1]:        segmentDuration: 10,
2017-08-13T13:46:26.997303+00:00 app[web.1]:        duration: 6,
2017-08-13T13:46:26.997302+00:00 app[web.1]:        status: 'Complete',
2017-08-13T13:46:26.997303+00:00 app[web.1]:        width: 400,
2017-08-13T13:46:26.997304+00:00 app[web.1]:        height: 228 } ],
2017-08-13T13:46:26.997304+00:00 app[web.1]:   playlists:
2017-08-13T13:46:26.997305+00:00 app[web.1]:    [ { name: '/97f0fc90-4f75-4c03-a3a2-1f8ee76892cd-master-playlist',
2017-08-13T13:46:26.997305+00:00 app[web.1]:        format: 'HLSv4',
2017-08-13T13:46:26.997306+00:00 app[web.1]:        outputKeys: [Object],
2017-08-13T13:46:26.997307+00:00 app[web.1]:        status: 'Complete' } ] }
*/
