import Eventbus from './Eventbus'
import point from '../utils/point'
export default class Layers {
  constructor () {
    this.list = []
    this.eventbus = new Eventbus()
  }

  add (obj) {
    const { list, eventbus } = this
    list.push(obj)
    eventbus.emit('add', obj)
  }

  findIndex (obj) {
    return this.list.findIndex(o => o === obj || o.rect === obj)
  }

  del (obj) {
    const { list, eventbus } = this
    const index = this.findIndex(obj)
    if (index > -1) {
      const obj = list[index]
      list.splice(index, 1)
      eventbus.emit('del', obj)
    }
  }

  select (obj) {
    const { list, eventbus } = this
    const index = this.findIndex(obj)
    if (index > -1) {
      list.push(list[index])
      list.splice(index, 1)
      point.select(obj)
      eventbus.emit('select', list[list.length - 1])
      return obj
    }
    eventbus.emit('select', null)
    return null
  }

  selectByPoint ([x, y]) {
    const { list, eventbus } = this
    const select = obj => {
      point.select(obj)
      const points = point.getRotate()
      point.clear()
      if (point.locate.isPointInPoints([x, y], points.slice(0, -2))) return this.select(obj)
      return null
    }
    const pointObj = point.isRect(point.obj) ? point.obj : point.obj.rect
    if (select(pointObj)) return pointObj
    for (let i = list.length; i--;) {
      if (select(list[i])) return list[i]
    }
    eventbus.emit('select', null)
  }
}
