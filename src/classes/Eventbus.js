export default class Eventbus {
  constructor () {
    this.fns = []
  }

  emit (type, ...args) {
    const fns = this.fns[type]
    if (fns) fns.forEach(fn => fn.apply(this, args))
  }

  on (type, fn) {
    const fns = this.fns[type]
    fns ? fns.push(fn) : (this.fns[type] = [fn])
  }
}
