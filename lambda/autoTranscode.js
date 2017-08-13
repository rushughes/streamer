var aws = require('aws-sdk');
var elastictranscoder = new aws.ElasticTranscoder();

// return filename without extension
function baseName(path) {
   return path.split('/').reverse()[0].split('.')[0];
}

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var key = event.Records[0].s3.object.key;
    var outputPrefix = baseName(key) + '-' + Date.now().toString();

    var params = {
      Input: {
        Key: key
      },
      PipelineId: '1502609200466-80khou', /*Your Elastic Transcoder Pipeline Id*/
      OutputKeyPrefix: 'HLS/' + outputPrefix,
      Outputs: [
        {
          Key: '/output/400k',
          PresetId: '1351620000001-200055', // HLS v3 and v4 (Apple HTTP Live Streaming), 400 kilobits/second, Video-only
          SegmentDuration: '10',
          ThumbnailPattern: 'thumbs-' + baseName(key) + '-{count}',
        }
      ],
      Playlists: [
        {
            Format: 'HLSv4',
            Name:  '/' + baseName(key) + '-master-playlist',
            OutputKeys: [ '/output/400k']
        }
      ]
    };
    console.log('Starting Job');
    elastictranscoder.createJob(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
      context.succeed('Job well done');
    });
};
