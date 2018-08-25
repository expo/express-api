let ThinClient = require('./ThinClient');

class ExampleClient extends ThinClient {
  clientDidReceiveCommands(commands) {
    console.log('Received commands: ' + JSON.stringify(commands));
  }

  clientDidReceiveData(data) {
    console.log('Received data: ' + JSON.stringify(data));
  }

  clientSimpleMethods() {
    return ['add'];
  }
}

module.exports = new ExampleClient();
