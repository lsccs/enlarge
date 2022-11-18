/**
 * 返回切换箭头控件
 */
import './index.css'

const baseClassName = 'ls-arrow'
export default function createArrow(handle) {
  const dom = document.createElement('div')
  dom.className = baseClassName

  const left = document.createElement('iconify-icon')
  const right = document.createElement('iconify-icon')
  left.icon = 'material-symbols:arrow-circle-left'
  right.icon = 'material-symbols:arrow-circle-right'

  right.style = left.style = 'color: rgba(0, 0, 0, .5);'
  left.className = right.className = 'ls-arrow-icon'

  left.addEventListener('click', e => {
    e.stopPropagation()
    handle({ name: 'leftClick', arg: { e } })
  })
  right.addEventListener('click', e => {
    e.stopPropagation()
    handle({ name: 'rightClick', arg: { e } })
  })

  dom.append(...[ left, right ])
  return {
    dom,
    show() {
      dom.className = baseClassName + ' show'
    },
    hide() {
      dom.className = baseClassName + ' hide'
    }
  }
}
