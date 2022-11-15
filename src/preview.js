import {addCss, getImageNatural, removeCss} from './utils'
import createLayout from './components/layout'
import props from './props'

export default class Preview {
  isStart = false
  layout = null

  config = null
  originRect = null
  currentRect = null

  originDomEvents = [['click', 'clickStart']]
  cloneDomEvents = [['transitionend', 'transitionend']]


  constructor(source) {
    const config = Object.assign(props, source)
    if (!config.el) return;
    // 初始化属性
    this.initProps(config)
    // 初始化事件
    this.initEvent()
    // 求出最终定位
    this.initLastRect()
  }


  initProps(config) {
    config.$el = this.createContainer(config.el)
    this.config = config;
    // 设置原始宽高和当前宽高
    this.originRect = this.getNaturalRect()
    this.currentRect = this.config.el.getBoundingClientRect()
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


  clickStart() {
    if (this.isStart) {
      this.endPreview()
    } else {
      this.startPreview()
    }
  }


  startPreview() {
    // 1. 添加过渡动画, 添加定位
    // 2. 插入元素
    // 3. 添加最终定位及宽高
    const { $el } = this.config
    const { left, top } = this.currentRect

    addCss($el, { transition: 'all .3s', position: 'absolute', left, top })
    this.renderDom($el)
    // 重新触发回流，否则无法触发动画
    const _ = $el.clientHeight
    addCss($el, this.originRect)
    this.setStartConfig()
  }


  endPreview() {
    const { $el } = this.config
    const { left, top, width, height } = this.currentRect
    addCss($el, { left, top, width, height })
    this.setEndConfig()
  }


  renderDom(dom) {
    this.layout.dom.appendChild(dom)
    document.body.appendChild(this.layout.dom)
  }

  getNaturalRect() {
    const { type, rect = {}, el } = this.config
    return type === 'image' ? getImageNatural(el) : rect
  }


  createContainer(el) {
    return el.cloneNode(true)
  }

  setStartConfig() {
    const { el } = this.config
    this.isStart = true
    this.layout.show()
    addCss(el, { opacity: 0 }, false)
  }

  setEndConfig() {
    this.isStart = false
    this.layout.hide()
  }

  setEndCallback() {
    const { el } = this.config
    removeCss(el, 'opacity')
  }

  // 动画结束回调
  transitionend(e) {
    // 需要在关闭并且动画结束时销毁克隆元素, 只识别left变化, 否则会执行多遍
    if (e.propertyName !== 'left') return;
    const { $el } = this.config

    if (!this.isStart && e.target === $el) {
      const { dom } = this.layout
      dom && dom.parentNode.removeChild(dom)
      this.setEndCallback()
    }
  }
}
