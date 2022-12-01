/**
 * 图片逻辑处理
 */
export default class Helper {

  static imageList = null
  static currentImage = null
  static animation = false

  static currentImageIndex = -1

  static callback = {}


  static setConfig(config) {
    Helper.imageList = config.imageList
    Helper.currentImage = config.currentImage
    Helper.currentImageIndex = Helper.findImageIndex()
  }

  static handle({ name, arg }) {
    if (Helper.animation) return
    Helper.currentImageIndex = Helper.findImageIndex()
    Helper[name](arg)
  }



  // 向左切换图片
  static leftClick() {
    const pre = Helper.imageList[Helper.currentImageIndex - 1]
    Helper.togglePreviewImage(pre || Helper.imageList[Helper.imageList.length - 1])
  }

  // 向右切换图片
  static rightClick() {
    const next = Helper.imageList[Helper.currentImageIndex + 1]
    Helper.togglePreviewImage(next || Helper.imageList[0])
  }


  static togglePreviewImage(image) {
    if (!image) return;
    Helper.animation = true
    const el = Helper.currentImage.config.$el
    const nextEl = image.config.$el

    const method = Helper.callback['togglePreviewImage']
    method && method(image)

    Helper.registerDestroy(el)
    el.className = `preview-fade-out`
    nextEl.className = `preview-fade-in`
    image.startPreview(false)
  }

  static findImageIndex() {
    return Helper.imageList.findIndex(item => item.config.el === Helper.currentImage.config.el)
  }

  static registerDestroy(el) {
    const currentImage = Helper.currentImage
    el.addEventListener('animationend', Helper.animationend(currentImage))
  }

  // 使用另外一个函数临时保存参数, 否则在切换的时候, 当前预览图片已经发生变化, 销毁的对象错误
  static animationend(currentImage) {
    const end = (e) => {
      e.target.removeEventListener(e.type, end)
      currentImage.endPreview(false)
      currentImage.enlargeDestroy(e)
      e.target.className = ''
      Helper.animation = false
    }
    return end
  }



  static registerCallback(name, callback) {
    Helper.callback[name] = callback
  }

  static removeCallback(name, callback) {
    Reflect.deleteProperty(Helper.callback, name)
  }
}
