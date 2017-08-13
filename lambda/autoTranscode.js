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
          Key: '/output/2M',
          PresetId: '1351620000001-200015', // HLS v3 and v4 (Apple HTTP Live Streaming), 2 megabits/second, Video-only
          SegmentDuration: '10',
          ThumbnailPattern: 'thumbs-' + baseName(key) + '-{count}',
        },
        {
          Key: '/output/15M',
          PresetId: '1351620000001-200025', // HLS v3 and v4 (Apple HTTP Live Streaming), 1.5 megabits/second, Video-only
          SegmentDuration: '10',
        },
        {
          Key: '/output/1M',
          PresetId: '1351620000001-200035', // HLS v3 and v4 (Apple HTTP Live Streaming), 1 megabit/second, Video-only
          SegmentDuration: '10',
        },
        {
          Key: '/output/600k',
          PresetId: '1351620000001-200045', // HLS v3 and v4 (Apple HTTP Live Streaming), 600 kilobits/second, Video-only
          SegmentDuration: '10',
        },
        {
          Key: '/output/400k',
          PresetId: '1351620000001-200055', // HLS v3 and v4 (Apple HTTP Live Streaming), 400 kilobits/second, Video-only
          SegmentDuration: '10',
        },
        {
          Key: '/output/aud',
          PresetId: '1351620000001-200060', // AUDIO ONLY: HLS v3 and v4 Audio, 160 k
          SegmentDuration: '10',
        }
      ],
      Playlists: [
        {
            Format: 'HLSv4',
            Name:  '/' + baseName(key) + '-master-playlist',
            OutputKeys: [ '/output/2M', '/output/15M', '/output/1M','/output/600k', '/output/400k', '/output/aud']
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
