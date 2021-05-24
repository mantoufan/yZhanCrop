export default class Cursor {
  constructor ({ canvas }) {
    canvas.style.cursor = 'none'
    this.img = document.createElement('img')
    const { img } = this
    img.style.cssText = 'position: absolute; top:0; left: 0; width: 24px; height: 24px; pointer-events: none'
    document.body.appendChild(this.img)
  }

  set ({ type = this.type, left, top, angle = this.angle }) {
    const { img } = this
    this.type = type
    this.angle = angle
    img.src = `./static/images/cursor/${type}.png`
    img.style.transform = `translate(${left - 8}px, ${top - 8}px) rotate(${(angle || 0) * 180 / Math.PI}deg)`
  }

  hide () {
    const { img } = this
    img.style.visibility = 'hidden'
  }

  show () {
    const { img } = this
    img.style.visibility = 'visible'
  }
}
