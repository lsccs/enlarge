export default class Render {

  nodes = []
  dom = null
  baseClassName = 'ls-preview-render'
  baseShowClassName = ''
  baseHideClassName = ''

  showName = ''
  hideName = ''

  constructor({ baseClassName, showName, hideName }) {
    this.baseClassName = baseClassName
    this.showName = ` ${showName || 'preview-fade-in'}`
    this.hideName = ` ${hideName || 'preview-fade-out'}`
    this.baseShowClassName = ` ${this.baseClassName + this.showName}`
    this.baseHideClassName = ` ${this.baseClassName + this.hideName}`
  }

  createComponent() {
    const dom = document.createElement('div')
    dom.className = this.baseClassName
    this.dom = dom
    this.registerEvents(dom)
    return this
  }

  render(children) {
    if (!document.querySelector(`.${this.baseClassName}`)) {
      if (children) {
        this.dom.append(...children)
      }
      document.body.appendChild(this.dom)
    }
  }

  showNodes(nodes = []) {
    document.body.append(...nodes)
    this.nodes = nodes
    this.nodes.forEach(node => {
      this.registerEvents(node)
      this.addShowCss(node)
    })
  }

  hideNodes() {
    this.nodes.forEach((node) => this.addHideCss(node))
    this.nodes = []
  }

  show(children) {
    if (!this.dom) {
      this.createComponent().render(children)
    }
    setTimeout(() => {
      this.addShowCss(this.dom)
    })
  }

  hide() {
    this.addHideCss(this.dom)
  }

  addShowCss(dom) {
    dom.className += this.baseShowClassName
  }
  addHideCss(dom) {
    dom.className = dom.className.replaceAll(this.baseShowClassName, this.baseHideClassName)
  }

  registerEvents(dom) {
    ['transitionend', 'animationend'].forEach(event => {
      dom.addEventListener(event, this.ontransitionend(dom))
    })
  }

  ontransitionend(dom) {
    return (e) => {
      if (dom.parentNode && dom.className.includes(this.hideName)) {
        dom.parentNode.removeChild(dom)
        this.dom = null
      }
    }
  }
}
