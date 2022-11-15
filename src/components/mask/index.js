import './index.css'
/**
 * 返回遮罩层
 */

const baseClassName = 'ls-preview-mask'
export default function createMask() {
    const dom = document.createElement('div')
    dom.className = baseClassName
    return {
        dom,
        hide: () => hide(dom),
        show: () => show(dom),
    }
}


function show(dom) {
    dom.className = baseClassName + ' show'
}


function hide(dom) {
    dom.className = baseClassName + ' hide'
}
