/**
 * 加载图标库
 */
export default class Iconify {

  static load() {
    const script = document.createElement('script')
    script.src = 'https://code.iconify.design/iconify-icon/1.0.1/iconify-icon.min.js'
    script.defer = true
    document.head.appendChild(script)
  }
}
