import { addCss, removeCss } from '../../src/utils'
import Enlarge from "../enlarge";

/**
 * 放大预览 (克隆元素，适用于图片)
 */
export default class CloneEnlarge extends Enlarge {

  constructor(source) {
    super(source)
  }

  createContainer(el) {
    return el.cloneNode(true)
  }

  onMounted() {
    const { el } = this.config
    this.layout.show()
    addCss(el, { opacity: 0 }, false)
  }

  setEndConfig() {
    this.layout.hide()
  }

  setEndCallback(dom) {
    const { el } = this.config
    dom.parentNode.removeChild(dom)
    removeCss(el, 'opacity')
  }

}
