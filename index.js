const defaultOptions = {
  maximumAttempts: null,
  maximumTime: null,
  retryDelay: 0
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function failmenot (options, fn) {
  if (!fn) {
    return (fn) => failmenot(options, fn);
  }

  options = Object.assign({}, defaultOptions, options);

  let attempts = 0;
  const startTime = Date.now();

  async function attempt () {
    attempts = attempts + 1;

    try {
      return await fn();
    } catch (error) {
      if (options.maximumAttempts && attempts > options.maximumAttempts) {
        error['failmenot:attempts'] = attempts;
        throw error;
      }

      const timeTaken = Date.now() - startTime;
      if (options.maximumTime && timeTaken > options.maximumTime) {
        error['failmenot:timeTaken'] = timeTaken;
        throw error;
      }

      await sleep(options.retryDelay);
      return attempt();
    }
  }

  return attempt();
}

module.exports = failmenot;
