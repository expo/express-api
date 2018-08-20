let fetch = require('node-fetch');

class Client {
  constructor(url, context) {
    this._url = url || 'http://localhost:8080/';
    this._context = context || {
      client: 'ExampleClient',
    };
  }

  handleData(data) {

  }

  handleCommands() {

  }

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

    // Handle data stuff
    this.handleData(r.data);

    // Handle commands
    this.handleCommands(r.commands);

    return r.result;
  }
}

module.exports = Client;