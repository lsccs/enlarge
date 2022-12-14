import props from "./props";
import createLayout from "../../components/layout/index";
import {addCss, getImageNatural, removeCss} from "../../utils";
import Mask from "../../components/common_control/mask/index";
import Close from "../../components/common_control/close";
import Events from '../../aspect/event';

/**
 * 放大逻辑抽象类
 */
export default class Enlarge {

  isStart = false
  layout = null
  mask = null

  config = null
  originRect = null
  currentRect = null

  originDomEvents = [['click', 'clickStart']]
  cloneDomEvents = [['transitionend', 'enlargeDestroy']]

  clearEventNames = ['click']
  eventPool = new Map()


  constructor(source) {
    const defaultProps = { ...props }
    this.config = Object.assign(defaultProps, source)
  }

  onLoad() {
    this.initProps()
    this.initLayout()
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
    // 尝试获取图片原始大小
    const natural = getImageNatural(this.config.el)
    this.originRect = {
      ...currentRect,
      ...(natural.width ? natural : {}),
      ...this.config.targetRect
    }
  }

  initLayout() {
    this.layout = createLayout()
  }

  initLastRect() {
    const { width, height } = document.body.getBoundingClientRect()
    const { width: elOriginWidth, height: elOriginHeight } = this.originRect
    this.originRect.left = (width - elOriginWidth) / 2
    this.originRect.top = (height - elOriginHeight) / 2
  }

  initEvent() {
    const { $el, el } = this.config
    // 原生dom只需要绑定点击事件
    this.registerEvents(el, this.originDomEvents)
    this.registerEvents($el, this.cloneDomEvents)
  }

  registerEvents(el, events) {
    events.forEach(events => {
      const [name, cb] = events
      const method = (...arg) => {
        this[cb](...arg)
      }
      this.eventPool.set(el, { method, name })
      el.addEventListener(name, method)
    })
  }

  // 清除事件的原因：
  // 在切换图片的时候, 没有重新生成 mask,
  // 所以, 会存在上一个图片的点击事件,
  // 这时, 关闭预览时, 会触发上一个图片的逻辑
  clearEvents(el) {
    const map = this.eventPool.get(el)
    const { method, name } = map || {}
    if (this.clearEventNames.includes(name)) {
      el.removeEventListener(name, method)
    }
  }


  clickStart(e) {
    e && e.stopPropagation()
    if (this.isStart) {
      this.endPreview()
      Events.touchEvent(Events.closeEnd);
    } else {
      this.startPreview()
      Events.touchEvent(Events.startEnd);
    }
  }


  startPreview(animation = true) {
    const { $el } = this.config
    // 设置初始态
    this.setInitialCss($el)
    // 第一阶段钩子触发
    this.onWillMount && this.onWillMount()
    // 第二阶段
    this.startComplete(animation)
  }

  startComplete(animation) {
    const { $el } = this.config
    this.insertDom($el)
    // 重新触发回流，否则无法触发动画
    // 需要动画时采取要调用钩子
    if (animation) {
      const _ = $el.clientHeight
      this.onMounted && this.onMounted()
    }
    addCss($el, this.originRect)

    this.isStart = true
    this.registerComponentEvents()
  }


  endPreview(animation = true) {
    const { $el } = this.config
    const { left, top, width, height } = this.currentRect
    // 先清除其他属性
    this.clearAttrs($el)
    if (animation) {
      this.setEndConfig && this.setEndConfig()
    } else {
      removeCss($el, 'transition')
    }
    addCss($el, { left, top, width, height })
    this.clearComponentEvents()
    this.isStart = false
  }


  insertDom(dom) {
    this.layout.dom.appendChild(dom)
    document.body.appendChild(this.layout.dom)
  }

  clearComponentEvents() {
    this.clearEvents(Mask.getInstance().dom)
    this.clearEvents(Close.createIcon())
  }

  registerComponentEvents() {
    const { maskClose } = this.config
    if (maskClose) this.registerEvents(Mask.getInstance().dom, this.originDomEvents)
    this.registerEvents(Close.createIcon(), this.originDomEvents)
  }

  setTargetAndRect({ el, targetRect }) {
    this.config.$el = el
    this.originRect = targetRect

    this.registerEvents(el, this.cloneDomEvents)
    // 重新计算位置
    this.initLastRect()
    addCss(el, targetRect)
  }


  setInitialCss($el) {
    const { left, top, width, height } = this.currentRect
    addCss($el, {
      transition: 'all .3s',
      position: 'fixed',
      'z-index': '2000',
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
  enlargeDestroy(e) {
    // 需要在关闭并且动画结束时销毁克隆元素
    const { $el } = this.config
    if (!this.isStart && e.target === $el) {
      const { dom } = this.layout
      if (dom && dom.parentNode) {
        this.setEndCallback && this.setEndCallback(dom)
      }
    }
  }
}
