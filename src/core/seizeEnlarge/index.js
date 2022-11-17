/**
 * 放大预览 (占位元素，适用于其他)
 */
import Enlarge from "../enlarge";
import { removeCss } from "../../utils";
import Mask from "../mask";

export default class SeizeEnlarge extends Enlarge {

  static seizeMap = new Map()

  sourceDom = null

  constructor(source) {
    super(source)
  }

  onLoad() {
    SeizeEnlarge.setEmptyBlock(this.config)
    this.sourceDom = this.config.el
    super.onLoad()
  }


  // 开始放大预览
  onWillMount() {
    const div = SeizeEnlarge.seizeMap.get(this.sourceDom)
    // 重新赋值占位元素
    this.sourceDom.parentNode.insertBefore(div, this.sourceDom)
  }

  // 放大预览完成
  onMounted() {
    Mask.show()
  }


  // 占位模式不确定具体预览时机, 不注册原dom事件
  initEvent() {
    const { $el } = this.config
    this.registerEvents($el, this.cloneDomEvents)
  }

  setEndConfig() {
    Mask.hide()
  }

  setEndCallback(dom) {
    dom.parentNode.removeChild(dom)
    const empty = SeizeEnlarge.seizeMap.get(this.sourceDom)
    empty.parentNode.removeChild(empty)
    // 清除定位样式
    this.clearCss()
  }


  clearCss() {
    const attrs = ['position', 'left', 'top']
    attrs.forEach(k => removeCss(this.sourceDom, k))
  }

  createContainer() {
    return this.sourceDom
  }

  insertDom() {
    document.body.appendChild(this.layout.dom)
  }


  // 创建占位div
  static setEmptyBlock(source) {
    const { el } = source
    if (!SeizeEnlarge.seizeMap.get(el)) {
      SeizeEnlarge.seizeMap.set(el, SeizeEnlarge.createSeizeContainer(el))
    }
  }

  static createSeizeContainer(el) {
    const div = el.cloneNode(true)
    const { height, width } = el.getBoundingClientRect()
    div.style.height = height + 'px'
    div.style.width = width + 'px'
    div.style.opacity = 0
    return div
  }
}
