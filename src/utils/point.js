import { POINTSTYPE } from '../classes/Consts.js'
export default {
  obj: Object.create(null),
  select (obj = Object.create(null)) {
    this.obj = obj
    return this
  },
  get () {
    const { x, y, width, height } = this.obj
    return [
      [x, y],
      [x + width / 2, y],
      [x + width, y],
      [x + width, y + height / 2],
      [x + width, y + height],
      [x + width / 2, y + height],
      [x, y + height],
      [x, y + height / 2],
      [x + width / 2, y - 50],
      [x + width / 2, y + height / 2]
    ]
  },
  rotate (x, y, xCenter, yCenter, angle) {
    return [
      (x - xCenter) * Math.cos(angle) - (y - yCenter) * Math.sin(angle) + xCenter,
      (x - xCenter) * Math.sin(angle) + (y - yCenter) * Math.cos(angle) + yCenter
    ]
  },
  getRotate () {
    const { x, y, width, height, angle } = this.obj
    const xCenter = x + width / 2
    const yCenter = y + height / 2
    return this.get().map(point => {
      const [x, y] = point
      return this.rotate(x, y, xCenter, yCenter, angle)
    })
  },
  draw () {
    const { ctx, x, y, width, height, angle } = this.obj
    const points = this.get()
    const [translateX, translateY] = [x + width / 2, y + height / 2]
    ctx.save()
    ctx.translate(translateX, translateY)
    ctx.rotate(angle)
    ctx.translate(-translateX, -translateY)
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'skyblue'
    ctx.rect(x, y, width, height)
    ctx.closePath()
    const [[startX, startY], [endX, endY]] = [points[1], points[8]]
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    points.forEach(point => {
      const [x, y] = point
      ctx.beginPath()
      ctx.fillStyle = 'skyblue'
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
    })
    ctx.restore()
    return this
  },
  getType (x, y) {
    const points = this.getRotate()
    for (let i = 0; i < points.length; i++) {
      const [_x, _y] = points[i]
      if (Math.abs(x - _x) <= 15 && Math.abs(y - _y) <= 15) return { index: i, type: POINTSTYPE[i < 8 ? i % 4 : 4] }
    }
    if (this.locate.isPointInPoints([x, y], points.slice(0, -2))) return { index: 10, type: POINTSTYPE[5] }
    return { index: -1, type: POINTSTYPE[6] }
  },
  getAngle () {
    const { angle } = this.obj
    return angle
  },
  getDistance: {
    point2point (point, point0) {
      const [[x, y], [x0, y0]] = [point, point0]
      return Math.sqrt((x - x0) ** 2 + (y - y0) ** 2)
    },
    point2line (point, point1, point2) {
      const [[x, y], [x1, y1], [x2, y2]] = [point, point1, point2]
      const A = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2)
      const B = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2)
      const C = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
      const P = A + B + C >> 1
      return Math.sqrt(P * (P - A) * (P - B) * (P - C)) * 2 / C
    }
  },
  locate: {
    isPointInPoints (point, points) {
      const [x, y] = point
      let isInside = false
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i]
        const [xj, yj] = points[j]
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) isInside = !isInside
      }
      return isInside
    },
    isPointInLine (point, point1, point2) {
      const [x, y] = point
      const [x1, y1] = point1
      const [x2, y2] = point2
      const tmp = (y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1
      return tmp > 0 ? 1 : (tmp === 0 ? 0 : -1) // 1 - right of line, 0 - inline, -1 - left of line
    }
  },
  clear () {
    this.obj = Object.create(null)
  },
  isRect (obj) {
    return obj.constructor && obj.constructor.name === 'Rect'
  }
}
