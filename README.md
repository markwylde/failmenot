# failmenot
Run a failing function many times until it eventually passes or reaches execution limits.

## Installation
```
npm install --save failmenot
```

## Options
```javascript
{
  maximumAttempts: null,
  maximumTime: null,
  retryDelay: 0
}
```

## Signature
```
failmenot -> options -> function -> result
```

## Example
### Basic Usage
```javascript
const failmenot = require('failmenot');

let attemptNumber = 1;
const successAttemptNumber = await failmenot(
  {
    maximumAttempts: 3
  },

  function () {
    if (attemptNumber < 3) {
      attemptNumber = attemptNumber + 1;
      throw new Error('should fail this attempt');
    }

    return 'worked on ' + attemptNumber;
  }
);

// successAttemptNumber === 'worked on 3';
```

### Curried
```javascript
const failmenot = require('failmenot');

let attemptNumber = 1;

const runner = failmenot({
  maximumAttempts: 3
});

const successAttemptNumber = await runner(
  function () {
    if (attemptNumber < 3) {
      attemptNumber = attemptNumber + 1;
      throw new Error('should fail this attempt');
    }

    return 'worked on ' + attemptNumber;
  }
);

// successAttemptNumber === 'worked on 3';
```
