import props from "./props";
import createLayout from "../../src/components/layout";
import {addCss, removeCss} from "../../src/utils";

/**
 * 放大逻辑抽象类
 */
export default class Enlarge {

  isStart = false
  layout = null

  config = null
  originRect = null
  currentRect = null

  originDomEvents = [['click', 'clickStart']]
  cloneDomEvents = [['transitionend', 'transitionend']]


  constructor(source) {
    const defaultProps = { ...props }
    this.config = Object.assign(defaultProps, source)
  }

  onLoad() {
    this.initProps()
    // 初始化事件
    this.initEvent()
    // 求出最终定位
    this.initLastRect()
  }


  initProps() {
    this.config.$el = this.createContainer ? this.createContainer(this.config.el) : this.config.el
    // 设置原始宽高
    this.currentRect = this.config.el.getBoundingClientRect()
    const currentRect = { width: this.currentRect.width, height: this.currentRect.height }
    this.originRect = Object.assign(currentRect, this.config.targetRect)
    this.layout = createLayout()
  }


  initLastRect() {
    const { width, height } = document.body.getBoundingClientRect()
    const { width: elOriginWidth, height: elOriginHeight } = this.originRect
    this.originRect.left = (width - elOriginWidth) / 2
    this.originRect.top = (height - elOriginHeight) / 2
  }

  initEvent() {
    const { maskClose, $el, el } = this.config
    // 原生dom只需要绑定点击事件
    this.registerEvents(el, this.originDomEvents)
    this.registerEvents($el, this.cloneDomEvents)
    if (maskClose) this.registerEvents(this.layout.mask, this.originDomEvents)
  }

  registerEvents(el, events) {
    events.forEach(events => {
      const [name, cb] = events
      el.addEventListener(name, this[cb].bind(this))
    })
  }


  clickStart(e) {
    e.stopPropagation()
    if (this.isStart) {
      this.endPreview()
    } else {
      this.startPreview()
    }
  }


  startPreview() {
    const { $el, el } = this.config
    // 点击重新计算
    this.currentRect = el.getBoundingClientRect()
    // 设置初始态
    this.setInitialCss($el)
    // 第一阶段钩子触发
    this.onWillMount && this.onWillMount()

    this.insertDom($el)
    // 重新触发回流，否则无法触发动画
    const _ = $el.clientHeight
    addCss($el, this.originRect)

    // 第二阶段钩子触发
    this.isStart = true
    this.onMounted && this.onMounted()
  }


  endPreview(e) {
    const { $el } = this.config
    const { left, top, width, height } = this.currentRect
    // 先清除其他属性
    this.clearAttrs($el)
    addCss($el, { left, top, width, height })
    this.isStart = false
    this.setEndConfig && this.setEndConfig()
  }


  insertDom(dom) {
    this.layout.dom.appendChild(dom)
    document.body.appendChild(this.layout.dom)
  }

  setTargetAndRect({ el, targetRect }) {
    this.config.$el = el
    this.config.originRect = targetRect
    this.registerEvents(el, this.cloneDomEvents)
  }

  setInitialCss($el) {
    const { left, top, width, height } = this.currentRect
    addCss($el, {
      transition: 'all .3s',
      position: 'fixed',
      'z-index': '1000',
      left, top, width, height
    })
  }

  setCurrentRect(rect) {
    this.currentRect = rect
  }

  clearAttrs(el) {
    Object.keys(this.originRect).forEach(key => {
      if (!(key in this.currentRect)) {
        removeCss(el, key)
      }
    })
  }

  // 动画结束回调
  transitionend(e) {
    // 需要在关闭并且动画结束时销毁克隆元素
    const { $el } = this.config
    if (!this.isStart && e.target === $el) {
      const { dom } = this.layout
      if (dom && dom.parentNode) {
        // 清除样式
        this.setEndCallback && this.setEndCallback(dom)
      }
    }
  }
}
