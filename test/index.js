const test = require('basictap');
const failmenot = require('../');

test('works first time', t => {
  t.plan(2);

  failmenot(function () {
    t.pass();
    return 123;
  }, {
    maximumAttempts: 10,
    maximumTime: 1000
  }).then(result => {
    t.equal(result, 123, 'returned value');
  });
});

test('works after maximum attempts', t => {
  t.plan(1);

  let attemptNumber = 1;
  failmenot(function () {
    if (attemptNumber < 3) {
      attemptNumber = attemptNumber + 1;
      throw new Error('should fail this attempt');
    }

    t.pass();
  }, {
    maximumAttempts: 3
  });
});

test('fails after maximum attempts', t => {
  t.plan(1);

  let attemptNumber = 1;
  failmenot(function () {
    attemptNumber = attemptNumber + 1;
    throw new Error('should fail this attempt');
  }, {
    maximumAttempts: 3
  }).catch(error => {
    t.equal(error.message, 'should fail this attempt');
  });
});

test('works after maximum time', t => {
  t.plan(1);
  t.timeout(500);

  const startTime = Date.now();
  failmenot(function () {
    if (Date.now() - startTime < 250) {
      throw new Error('should fail this attempt');
    }

    t.pass();
  }, {
    maximumTime: 250
  });
});

test('fails after maximum time', t => {
  t.plan(2);
  t.timeout(500);

  const startTime = Date.now();
  failmenot(function () {
    throw new Error('should fail this attempt');
  }, {
    maximumTime: 250
  }).catch(error => {
    const timeTaken = Date.now() - startTime;
    t.ok(timeTaken < 300, 'failed after time');
    t.equal(error.message, 'should fail this attempt');
  });
});
