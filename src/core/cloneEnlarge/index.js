import { addCss, removeCss } from '../../utils'
import Enlarge from "../enlarge";
import ImageControl from "../../components/imageControl";

/**
 * 放大预览 (克隆元素，适用于图片)
 */
export default class CloneEnlarge extends Enlarge {
  static handle = null

  constructor(source) {
    super(source)
    CloneEnlarge.handle = source.handle
  }

  createContainer(el) {
    return el.cloneNode(true)
  }

  onMounted() {
    const { el } = this.config
    ImageControl.show(CloneEnlarge.handle)
    addCss(el, { opacity: 0 }, false)
  }

  setEndConfig() {
    ImageControl.hide()
  }

  setEndCallback(dom) {
    const { el } = this.config
    dom.parentNode.removeChild(dom)
    removeCss(el, 'opacity')
  }

}
