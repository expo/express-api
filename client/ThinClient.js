let fetch = require('cross-fetch');

let pkg = require('./package');

let version = pkg.version;

class ThinClient {
  clientAgentString() {
    let name = this.constructor.name || 'ThinClient';
    return name + ';' + pkg.name + '/' + version;
  }

  clientSimpleMethods() {
    return [];
  }

  constructor(url, context, opts) {
    this._url = url || 'http://localhost:8080/';
    this._context = context || {
      agent: this.clientAgentString(),
    };
    this._opts = Object.assign({}, opts);

    // Install simple methods
    for (let method of this.clientSimpleMethods()) {
      this[method + 'Async'] = async (...args) => {
        return await this.callAsync(method, ...args);
      };
    }
  }

  clientDidReceiveData(data) {}

  clientDidReceiveCommands(commands) {}

  async callAsync(method, ...args) {
    let response = await fetch(this._url, {
      method: 'POST',
      body: JSON.stringify({
        context: this._context,
        method,
        args,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let r;
    let responseText;
    try {
      responseText = await response.text();
      r = JSON.parse(responseText);
    } catch (e) {
      console.error(responseText);
      let err = new Error("Didn't understand response from server");
      err.ServerError = true;
      err.responseText = responseText;
      throw err;
    }

    if (r.error) {
      let err = new Error(r.error.message);
      Object.assign(err, r.error);
      err.ApiError = true;
      throw err;
    }

    if (r.clientError) {
      let err = new Error(r.clientError.message);
      Object.assign(err, r.clientError);
      err.ClientError = true;
      throw err;
    }

    if (r.data) {
      this.clientDidReceiveData(r.data);
    }

    // Handle commands
    if (r.commands) {
      this.clientDidReceiveCommands(r.commands);
    }

    return r.result;
  }
}

module.exports = ThinClient;
