# failmenot
Run a failing function many times until it eventually passes or reaches execution limits.

## Options
```javascript
{
  maximumAttempts: null,
  maximumTime: null,
  retryDelay: 0
}
```

## Example
```javascript
const failmenot = require('failmenot');

let attemptNumber = 1;
const successAttemptNumber = await failmenot(
  function () {
    if (attemptNumber < 3) {
      attemptNumber = attemptNumber + 1;
      throw new Error('should fail this attempt');
    }

    return 'worked on ' + attemptNumber;
  },
  {
    maximumAttempts: 3
  }
);

// successAttemptNumber === 'worked on 3';
```
