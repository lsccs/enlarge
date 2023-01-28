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
  // body 位置信息，防止重复获取
  static bodyRect = document.body.getBoundingClientRect()
  // 当前比例
  currentProportion = 100

  isStart = false
  layout = null
  controller = null

  config = null
  // 目标位置大小信息
  originRect = null
  // 实时变化的位置大小信息
  dynamicOriginRect = null
  // 源位置大小信息
  currentRect = null

  originDomEvents = [['click', 'clickStart']]
  cloneDomEvents = [['transitionend', 'enlargeDestroy'], ['wheel', 'onWheel']]

  clearEventNames = ['click']
  eventPool = new Map()


  constructor(source, controller) {
    const defaultProps = { ...props }
    this.config = Object.assign(defaultProps, source)
    this.controller = controller
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
    this.setOriginRect({
      ...currentRect,
      ...(natural.width ? natural : {}),
      ...this.config.targetRect
    })
  }

  initLayout() {
    this.layout = createLayout()
  }

  initLastRect() {
    const { width, height } = Enlarge.bodyRect
    const { width: elOriginWidth, height: elOriginHeight } = this.originRect
    this.setOriginRect({
      ...this.originRect,
      left: (width - elOriginWidth) / 2,
      top: (height - elOriginHeight) / 2
    })
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
      this.controller.touchEvent(Events.closeEnd);
      removeCss(document.body, 'overflow')
    } else {
      this.startPreview()
      this.controller.touchEvent(Events.startEnd);
      addCss(document.body, {
        overflow: 'hidden',
      })
    }
  }


  startPreview(animation = true) {
    this.setInitialEl()
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
    this.setInitialEl()
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

  setInitialEl() {
    // 重置标识，用于 避免动画结束事件回调多次调用
    this.config.$el.end = false
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
    this.setOriginRect(targetRect)
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

  setOriginRect(rect) {
    this.originRect = rect
    this.dynamicOriginRect = { ...rect }
  }

  setCurrentProportion(value) {
    const v = value > 1 ? value : 1
    this.currentProportion = Math.floor(v * 100) / 100
  }

  // 根据缩放宽高比例，调整元素
  setDynamicOriginRectCss(rect) {
    const { width, height, wheelX, wheelY, isUp } = rect

    if (isUp) {
      this.dynamicOriginRect.width += width
      this.dynamicOriginRect.height += height
      this.dynamicOriginRect.left -= width * wheelX
      this.dynamicOriginRect.top -= height * wheelY
    } else {
      this.dynamicOriginRect.width -= width
      this.dynamicOriginRect.height -= height
      this.dynamicOriginRect.left += width * wheelX
      this.dynamicOriginRect.top += height * wheelY
    }
    addCss(this.config.$el, this.dynamicOriginRect)
  }

  clearAttrs(el) {
    Object.keys(this.originRect).forEach(key => {
      if (!(key in this.currentRect)) {
        removeCss(el, key)
      }
    })
  }


  onWheel(e) {
    const isUp = e.wheelDeltaY > 0;
    if (this.currentProportion <= 1 && !isUp) return;

    // 获取缩放比例
    let p = Math.trunc(this.currentProportion / 10)
    const newCurrentProportion = this.currentProportion + (isUp ? p : -p)
    const proportionPosition = Math.trunc(newCurrentProportion / 10)
    console.log(p, proportionPosition, 'proportionPosition')
    if (p - proportionPosition > 1 ) {
      p = proportionPosition
    }

    const transferP = p / 100;
    this.setCurrentProportion(this.currentProportion + (isUp ? p : -p))
    console.log(this.currentProportion, 'currentProportion')
    // 1. 求出鼠标位置在图片的位置百分比
    // 2. 求出图片放大多少像素
    // 3. 定位的值 = 图片放大的像素 * 图片位置的百分比
    const { left, top, width: dWidth, height: dHeight } = this.dynamicOriginRect

    const width = this.originRect.width * transferP;
    const height = this.originRect.height * transferP;

    const wheelX = (e.clientX - left) / dWidth
    const wheelY = (e.clientY - top) / dHeight
    // 设置定位
    this.setDynamicOriginRectCss({ width, height, wheelX, wheelY, isUp })

  }

  // 动画结束回调
  enlargeDestroy(e) {
    if (!e.target.end) {
      this.controller.touchEventByIsStart(this.isStart);
      e.target.end = true
    }
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
