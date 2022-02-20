const test = require('basictap');
const failmenot = require('../');
const failmenotCurried = require('../curried');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('works first time', t => {
  t.plan(2);

  failmenot({
    maximumAttempts: 10,
    maximumTime: 1000
  }, function () {
    t.pass();
    return 123;
  }).then(result => {
    t.equal(result, 123, 'returned value');
  });
});

test('currying works first time', async t => {
  t.plan(2);

  const applyRetry = failmenotCurried({
    maximumAttempts: 10,
    maximumTime: 1000
  });

  const runner = applyRetry(function (arg) {
    t.equal(arg, 'testarg');
    return 123;
  });

  const result = await runner('testarg');

  t.equal(result, 123, 'returned value');
});

test('works after maximum attempts', t => {
  t.plan(1);

  let attemptNumber = 1;
  failmenot({
    maximumAttempts: 3
  }, function () {
    if (attemptNumber < 3) {
      attemptNumber = attemptNumber + 1;
      throw new Error('should fail this attempt');
    }

    t.pass();
  });
});

test('fails after maximum attempts', t => {
  t.plan(1);

  let attemptNumber = 1;
  failmenot({
    maximumAttempts: 3
  }, function () {
    attemptNumber = attemptNumber + 1;
    throw new Error('should fail this attempt');
  }).catch(error => {
    t.equal(error.message, 'should fail this attempt');
  });
});

test('works after maximum time', t => {
  t.plan(1);
  t.timeout(500);

  const startTime = Date.now();
  failmenot({
    maximumTime: 250
  }, function () {
    if (Date.now() - startTime < 250) {
      throw new Error('should fail this attempt');
    }

    t.pass();
  });
});

test('works with promise', t => {
  t.plan(1);
  t.timeout(500);

  const startTime = Date.now();
  failmenot({
    maximumTime: 250
  }, async function () {
    await sleep(1);
    if (Date.now() - startTime < 250) {
      throw new Error('should fail this attempt');
    }

    t.pass();
  });
});

test('fails after maximum time', t => {
  t.plan(2);
  t.timeout(500);

  const startTime = Date.now();
  failmenot({
    maximumTime: 250
  }, function () {
    throw new Error('should fail this attempt');
  }).catch(error => {
    const timeTaken = Date.now() - startTime;
    t.ok(timeTaken < 300, 'failed after time');
    t.equal(error.message, 'should fail this attempt');
  });
});
