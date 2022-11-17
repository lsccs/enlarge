/**
 * 返回容器
 */
export default function createLayout() {
  const dom = document.createElement('div')
  dom.className = 'ls'

  return {
    dom,
  }
}
