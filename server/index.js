class Api {
  addAsync(...args) {
    let sum = 0;
    for (let x of args) {
      sum += x;
    }
    return sum;
  }
}

module.exports = (impl) => {
  let handler = (req, res) => {
    

  };
};
