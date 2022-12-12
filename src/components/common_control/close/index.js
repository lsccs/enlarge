import Render from "../../../core/render";
import './index.css'


export default class Close {

  static render = null
  static dom = null

  static getInstance() {
    if (!Close.render) Close.render = new Render({ baseClassName: 'ls-close-icon' })
    return Close.render
  }

  static createIcon() {
    if (Close.dom) return Close.dom;
    Close.dom = document.createElement('iconify-icon')
    Close.dom.icon = 'mdi:close-circle'
    return Close.dom
  }

  static show() {
    Close.getInstance().show([Close.createIcon()])
  }

  static hide() {
    Close.render.hide()
  }
}
