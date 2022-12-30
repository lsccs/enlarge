
// 获取图片原始宽高
export function getImageNatural(img) {
  return {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
}

// 添加css
export function addCss(el, style, isPx = true) {
  const obj = {}
  Object.keys(style).forEach(key => {
    if (typeof style[key] === 'number' && isPx) {
      return obj[key] = `${style[key]}px`
    }
    obj[key] = style[key]
  })
  Object.assign(el.style, obj)
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
