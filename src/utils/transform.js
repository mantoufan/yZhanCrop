import point from './point'
export default {
  move ({ obj, x, y, basePoints }) {
    return function (left, top) {
      const [[left0, top0]] = basePoints
      obj.x = x + left - left0
      obj.y = y + top - top0
      return { obj }
    }
  },
  resize ({ obj, width, height, getDistance, basePoints, basePointIndex, changeWidth, changeHeight }) {
    return function (left, top) {
      const ratio = getDistance([left, top], ...basePoints.slice(1)) /
                    getDistance(...basePoints) || 0.01
      if (changeWidth) obj.width = width * ratio
      if (changeHeight) obj.height = height * ratio
      const points = point.getRotate()
      const pointRotate = points[basePointIndex]
      obj.x += basePoints[1][0] - pointRotate[0]
      obj.y += basePoints[1][1] - pointRotate[1]
      return { obj }
    }
  },
  rotate ({ obj, angle, basePoints }) {
    return function (left, top) {
      const [[xCenter, yCenter], [xRotate, yRotate]] = basePoints
      const [xRotate2xCenter, yCenter2yRotate] = [xRotate - xCenter, yCenter - yRotate]
      const [left2xCenter, yCenter2top] = [left - xCenter, yCenter - top]
      const tmp = Math.sqrt(xRotate2xCenter ** 2 + yCenter2yRotate ** 2) * Math.sqrt(left2xCenter ** 2 + yCenter2top ** 2)
      const rotate = tmp === 0 ? -1 : Math.acos((xRotate2xCenter * left2xCenter + yCenter2yRotate * yCenter2top) / tmp)
      const isPointInLine = point.locate.isPointInLine([left, top], ...basePoints)
      if (isPointInLine === 1) obj.angle = angle + rotate
      else if (isPointInLine === -1) obj.angle = angle + 2 * Math.PI - rotate
      return { obj }
    }
  }
}
