import Base from './Base'
export default class Rect extends Base {
  constructor ({ ctx, x, y, width, height, angle }) {
    super({ ctx, x, y, width, height, angle })
  }

  draw () {
    const { ctx, angle, x, y, width, height } = this
    const [translateX, translateY] = [x + width / 2, y + height / 2]
    ctx.save()
    ctx.translate(translateX, translateY)
    ctx.rotate(angle)
    ctx.translate(-translateX, -translateY)
    ctx.lineWidth = 2
    ctx.strokeStyle = 'pink'
    ctx.strokeRect(x, y, width, height)
    ctx.restore()
  }
}
