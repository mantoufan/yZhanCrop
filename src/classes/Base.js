export default class Base {
  constructor ({ ctx, x = 0, y = 0, width, height, angle = 0 }) {
    Object.assign(this, {
      ctx, x, y, width, height, angle
    })
  }
}
