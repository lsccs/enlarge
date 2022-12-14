import { addCss, removeCss } from '../../utils'
import Enlarge from "../enlarge/index";
import ImageControl from "../../components/image_control/index";

/**
 * 放大预览 (克隆元素，适用于图片)
 */
export default class CloneEnlarge extends Enlarge {

  clickStart(e) {
    // 每次关闭或者打开都重新计算原图位置, 有可能滚动条滚动位置发生变化
    this.setCurrentRect(this.config.el.getBoundingClientRect())
    super.clickStart(e);
  }

  onWillMount() {
    addCss(this.config.el, { opacity: 0 }, false)
  }

  onMounted() {
    ImageControl.show(this.config)
  }

  createContainer(el) {
    return el.cloneNode(true)
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
