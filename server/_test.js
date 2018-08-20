let express = require('express');
let bodyParser = require('body-parser');

let handler = require('./handler');

class ExampleApi {
  addAsync(...args) {
    let sum = 0;
    for (let x of args) {
      sum += x;
    }
    return sum;
  }
}

async function mainAsync() {
  let app = express();
  let port = process.env.PORT || 8080;
  app.use(bodyParser.json());

  app.post('/', handler(ExampleApi));

  app.listen(port, () => {
    console.log('Listening on port ' + port);
  });
}

module.exports = mainAsync;
Object.assign(module.exports, {
  ExampleApi,
  mainAsync,
});

if (require.main === module) {
  mainAsync();
}
