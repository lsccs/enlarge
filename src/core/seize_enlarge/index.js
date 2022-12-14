/**
 * 放大预览 (占位元素，适用于其他)
 */
import Enlarge from "../enlarge/index";
import { removeCss } from "../../utils";
import CommonControl from "../../components/common_control/index";

export default class SeizeEnlarge extends Enlarge {

  static seizeMap = new Map()

  sibling = null
  sourceDom = null

  constructor(source) {
    super(source)
  }


  clickStart(e) {
    // 每次关闭或者打开都重新计算原图位置, 有可能滚动条滚动位置发生变化
    let div = SeizeEnlarge.seizeMap.get(this.sourceDom)
    if (!this.isStart) {
      div = this.config.el
    }
    this.setCurrentRect(div.getBoundingClientRect())
    super.clickStart(e);
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
    CommonControl.show()
  }


  // 占位模式不确定具体预览时机, 不注册原dom事件
  initEvent() {
    const { $el } = this.config
    this.registerEvents($el, this.cloneDomEvents)
  }

  setEndConfig() {
    CommonControl.hide()
  }

  setEndCallback(dom) {
    const { el } = this.config;
    dom.parentNode.removeChild(dom);
    const empty = SeizeEnlarge.seizeMap.get(this.sourceDom);
    empty.parentNode.removeChild(empty);
    this.sibling.parent.insertBefore(el, this.sibling.node);
    // 清除定位样式
    this.clearCss();
  }


  clearCss() {
    const attrs = ['position', 'left', 'top']
    attrs.forEach(k => removeCss(this.sourceDom, k))
  }

  createContainer() {
    return this.sourceDom
  }

  insertDom(dom) {
    this.sibling = {
      node: dom.nextSibling,
      parent: dom.parentNode,
    }
    super.insertDom(dom)
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
