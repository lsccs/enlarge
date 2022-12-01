/**
 * 返回切换箭头控件
 */
import './index.css'
import Render from "../../../core/render";

export default function createArrow(handle) {

  const render = new Render({baseClassName: 'ls-arrow-icon', showName: 'preview-fade-in', hideName: 'preview-fade-out'})

  const left = document.createElement('iconify-icon')
  const right = document.createElement('iconify-icon')
  left.icon = 'material-symbols:arrow-circle-left'
  right.icon = 'material-symbols:arrow-circle-right'

  right.style = left.style = 'color: rgba(0, 0, 0, .5);'
  left.className += ' left'
  right.className += ' right'

  left.addEventListener('click', e => {
    e.stopPropagation()
    handle({ name: 'leftClick', arg: { e } })
  })
  right.addEventListener('click', e => {
    e.stopPropagation()
    handle({ name: 'rightClick', arg: { e } })
  })

  const dom = [ left, right ]
  return {
    dom,
    show() {
      render.showNodes(dom)
    },
    hide() {
      render.hideNodes()
    }
  }
}
