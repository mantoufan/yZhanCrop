import YZhanCrop from './yzhancrop'
import { jest, test, expect } from '@jest/globals'
const { createCanvas } = require('canvas')
const canvas = createCanvas(800, 600)
canvas.addEventListener = jest.fn()
canvas.style = {}
const yZhanCrop = new YZhanCrop({ canvas })
const tempPath = 'static/images/temp/'
const unit = Math.PI / 180
const imgList = [
  { src: tempPath + '1.jpg', width: 300, height: 145, x: 100, y: 100, angle: -30 * unit },
  { src: tempPath + '2.jpg', width: 300, height: 145, x: 200, y: 200, angle: 116 * unit },
  { src: tempPath + '3.jpg', x: 300, y: 300, angle: 0 }
]
const { layers } = yZhanCrop
test('add Image', done => {
  let count = 0
  layers.eventbus.on('add', obj => {
    if (++count === 3) {
      done()
    }
  })
  imgList.forEach(img => yZhanCrop.add(img))
  expect(count).toBe(3)
})
