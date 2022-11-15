
// 获取图片原始宽高
export function getImageNatural(img) {
  return {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
}

// 添加css
export function addCss(el, style, isPx = true) {
  Object.keys(style).forEach(key => {
    if (typeof style[key] === 'number' && isPx) {
      return style[key] = `${style[key]}px`
    }
  })
  Object.assign(el.style, style)
}

// 移除css
export function removeCss(el, key) {
  el.style.removeProperty(key)
}

// 清空css
export function clearCss(el) {
  Object.keys(el.style).forEach(key => {
    removeCss(el, key)
  })
}
