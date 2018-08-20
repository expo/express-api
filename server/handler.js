let time = require('@expo/time');

module.exports = (apiImplementationClass) => {
  return async (req, res) => {
    let tk = time.start();

    let r = {
      data: null,
      error: null,
      clientError: null,
      result: null,
      commands: null,
    };

    let { method, args, context } = req.body;
    let api = new apiImplementationClass();
    api._context = context;
    let m = api[method + 'Async'];
    if (!m) {
      let err = {
        message: 'No such method: `' + method + '`',
        type: 'API_ERROR',
        code: 'NO_SUCH_METHOD',
      };
      r.error = err;
    } else {
      try {
        r.result = await m(...args);
      } catch (e) {
        let err = {
          ...e,
          message: e.message,
          type: e.type,
          code: e.code,
        };
        if (e.isClientError) {
          r.clientError = err;
        } else {
          r.error = err;
        }
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(r);
    time.end(tk, 'api', {
      threshold: 0,
      message: method + JSON.stringify(args),
    });
  };
};
