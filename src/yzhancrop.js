import Img from './classes/Img'
import Cursor from './classes/Cursor'
import Layers from './classes/Layers'
import Eventbus from './classes/Eventbus'
import point from './utils/point'
import transform from './utils/transform'
export default class YZhanCrop {
  constructor ({ canvas }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.layers = new Layers()
    this.addEvent()
    this.cursor = new Cursor({ canvas })
    this.eventbus = new Eventbus()
  }

  add ({ src, x, y, width, height, angle }) {
    const { ctx } = this
    const obj = new Img({ ctx, src, x, y, width, height, angle, cb: () => this.draw() })
    this.layers.add(obj)
  }

  addEvent () {
    const { canvas } = this
    const { offsetTop, offsetLeft } = canvas
    const mouseDownInfo = { isMouseDown: false, callback () {} }
    canvas.addEventListener('mousemove', e => {
      const { clientX: left, clientY: top } = e
      if (mouseDownInfo.isMouseDown === false) {
        const [{ type, index }, angle] = [point.getType(left - offsetLeft, top - offsetTop), point.getAngle()]
        this.cursor.set({ type, angle: index === -1 ? 0 : angle, left, top })
      } else {
        this.cursor.set({ left, top })
        mouseDownInfo.callback(left, top)
        this.draw()
      }
    })
    canvas.addEventListener('mouseenter', () => this.cursor.show())
    canvas.addEventListener('mouseleave', () => this.cursor.hide())
    canvas.addEventListener('mousedown', e => {
      const { clientX: left, clientY: top } = e
      const [{ type, index }, angle, points] = [
        point.getType(left - offsetLeft, top - offsetTop),
        point.getAngle(),
        point.getRotate()
      ]
      const { x, y, width, height } = point.obj
      const baseParams = { obj: point.obj, x, y, width, height, angle }
      mouseDownInfo.isMouseDown = index !== -1
      let [mode, getDistance, basePoints, basePointIndex, changeWidth, changeHeight] = ['', () => {}, [], -1, false, false]
      switch (type) {
        case 'move':
          mode = 'move'
          basePoints = [[left, top]]
          break
        case 'nw-resize': // ↘
          mode = 'resize'
          getDistance = point.getDistance.point2point
          basePointIndex = index === 0 ? 4 : 0
          basePoints = [points[index], points[basePointIndex]]
          changeWidth = changeHeight = true
          break
        case 'ne-resize': // ↙
          mode = 'resize'
          getDistance = point.getDistance.point2point
          basePointIndex = index === 2 ? 6 : 2
          basePoints = [points[index], points[basePointIndex]]
          changeWidth = changeHeight = true
          break
        case 's-resize': // ↑
          mode = 'resize'
          getDistance = point.getDistance.point2line
          basePointIndex = index === 1 ? 4 : 0
          basePoints = [points[index], points[basePointIndex], points[index === 1 ? 6 : 2]]
          changeHeight = true
          break
        case 'w-resize': // →
          mode = 'resize'
          getDistance = point.getDistance.point2line
          basePointIndex = index === 3 ? 0 : 2
          basePoints = [points[index], points[basePointIndex], points[index === 3 ? 7 : 4]]
          changeWidth = true
          break
        case 'rotate':
          mode = 'rotate'
          basePoints = [points[9], points[8]]
          break
        default:
      }
      if (mode) {
        mouseDownInfo.callback = transform[mode]({
          ...baseParams,
          getDistance,
          basePoints,
          basePointIndex,
          changeWidth,
          changeHeight
        })
      }
      if (!mode || mode === 'move') {
        const { layers } = this
        layers.selectByPoint([left, top])
        this.draw()
      }
    })
    document.addEventListener('mouseup', () => {
      mouseDownInfo.isMouseDown = false
    })
  }

  clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  draw () {
    const { layers, eventbus } = this
    this.clear()
    layers.list.forEach(obj => {
      if (obj.isLoaded) {
        obj.draw()
        if (point.obj === obj) {
          point.draw()
          obj.rect.draw()
        }
      }
    })
    if (point.isRect(point.obj)) {
      point.obj.draw()
      point.draw()
    }
    eventbus.emit('draw', { obj: point.obj })
  }

  utils () {
    return { point }
  }
}
