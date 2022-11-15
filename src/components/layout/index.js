import createMask from "../mask";

/**
 * 返回容器
 */
export default function createLayout() {
  const dom = document.createElement('div')
  dom.className = 'ls'
  const { dom: mask, ...method } = createMask()
  dom.appendChild(mask)
  return {
    dom,
    mask,
    ...method
  }
}
