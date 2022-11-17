import './index.css'
/**
 * 全局遮罩层
 */

const baseClassName = 'ls-preview-mask'
export default class Mask {

    static dom = null

    static createMask() {
        const dom = document.createElement('div')
        dom.className = baseClassName
        Mask.dom = dom
        dom.addEventListener('transitionend', Mask.ontransitionend)
        return Mask
    }

    static render(children) {
        if (!document.querySelector(`.${baseClassName}`)) {
            if (children) {
                Mask.dom.append(...children)
            }
            document.body.appendChild(Mask.dom)
        }
    }

    static show(children) {
        if (!Mask.dom) {
            Mask.createMask().render(children)
        }
        setTimeout(() => {
            Mask.dom.className = baseClassName + ' show'
        })
    }

    static hide() {
        Mask.dom.className = baseClassName + ' hide'
    }

    static ontransitionend() {
        if (Mask.dom.className.includes('hide')) {
            document.body.removeChild(Mask.dom)
            Mask.dom = null
        }
    }
}
