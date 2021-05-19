const YZhanCrop = require('./yzhancrop')
const yZhanCrop = new YZhanCrop()

test('get to equal 100', () => {
  expect(yZhanCrop.get()).toBe(100)
})
