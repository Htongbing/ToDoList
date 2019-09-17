module.exports = {
  createRandomCode(len = 6) {
    const arr = new Array(len).fill('')
    return arr.map(() => Math.floor(Math.random() * 10)).join('')
  }
}