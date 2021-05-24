import Base from './Base'
import Rect from './Rect'
export default class Img extends Base {
  constructor ({ ctx, src, x, y, width, height, angle, cb = () => {} }) {
    super({ ctx, x, y, width, height, angle })
    this.src = src
    this.image = null
    this.isLoaded = false
    this.cb = cb
    this.id = Date.now() + (Math.random() * 10000).toString().substring(0, 4)
    this.rect = Object.create(null)
    this.load()
  }

  load () {
    const img = new window.Image()
    img.src = this.src
    img.onload = () => {
      this.image = img
      if (!this.width) this.width = this.image.width
      if (!this.height) this.height = this.image.height
      const { ctx, x, y, width, height, angle } = this
      const [stepX, stepY] = [width / 10, height / 10]
      this.rect = new Rect({ ctx, x: x + stepX, y: y + stepY, width: width - stepX * 2, height: height - stepY * 2, angle })
      this.isLoaded = true
      this.cb()
    }
  }

  draw () {
    const { ctx, image, angle, x, y, width, height } = this
    const [translateX, translateY] = [x + width / 2, y + height / 2]
    ctx.save()
    ctx.translate(translateX, translateY)
    ctx.rotate(angle)
    ctx.translate(-translateX, -translateY)
    ctx.drawImage(image, x, y, width, height)
    ctx.restore()
  }

  preview ({ canvas }) {
    const ctx = canvas.getContext('2d')
    const rotate = (translateX, translateY, angle) => {
      ctx.translate(translateX, translateY)
      ctx.rotate(angle)
      ctx.translate(-translateX, -translateY)
    }
    const drawRect = (rect) => {
      const { angle, width, height } = rect
      const [translateX, translateY] = [width / 2, height / 2]
      rotate(translateX, translateY, angle)
      ctx.rect(maxLength * 0.2, maxLength * 0.2, width, height)
    }
    const drawImg = (img, rect) => {
      const { angle, width, height, image, isLoaded } = img
      if (!isLoaded) return
      const [x, y] = [img.x - rect.x + maxLength * 0.2, img.y - rect.y + maxLength * 0.2]
      console.log(x, y)
      const [translateX, translateY] = [x + width / 2, y + height / 2]
      rotate(translateX, translateY, angle)
      ctx.drawImage(image, x, y, width, height)
    }
    const { rect } = this
    const maxLength = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 1.5
    canvas.width = canvas.height = maxLength
    ctx.save()
    drawRect(rect)
    ctx.restore()
    ctx.clip()
    ctx.save()
    drawImg(this, rect)
    ctx.restore()
  }
}
