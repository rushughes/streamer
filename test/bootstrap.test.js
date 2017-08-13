var sails = require('sails');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(30000);

  sails.lift({
    log: {
        /**
         * for debugging:
         * level: 'error'
         */
         level: 'error'
        /**
         * for running full tests without sails console errors
         * level: 'silent'
         */
        //level: 'silent'
      },
    // configuration for testing purposes
  }, function(err) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
