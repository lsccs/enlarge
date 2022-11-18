/**
 * 图片逻辑处理
 */
export default class Helper {

  static imageList = null
  static currentImage = null

  static handle({ name, arg }) {
    Helper.imageList = arg.imageList
    Helper.currentImage = arg.currentImage
    Helper.targetOnload = arg.targetOnload
    Helper[name](arg)
  }


  // 向左切换图片
  static leftClick() {
    const pre = Helper.imageList[Helper.findImageIndex() - 1]
    Helper.togglePreviewImage(pre)
  }

  // 向右切换图片
  static rightClick() {
    const next = Helper.imageList[Helper.findImageIndex() + 1]
    Helper.togglePreviewImage(next)
  }


  static togglePreviewImage(image) {
    if (!image) return;
    // 1. 关闭当前预览
    // 2. 没有过渡效果, 所以手动销毁
    // 3. 打开新的预览
    const el = Helper.currentImage.config.$el
    const nextEl = image.config.$el
    el.addEventListener('animationend', Helper.animationend)
    el.className = `preview-fade-out`
    nextEl.className = `preview-fade-in`
    image.startPreview(false)
  }

  static findImageIndex() {
    return Helper.imageList.findIndex(item => item.config.el === Helper.currentImage.config.el)
  }

  static animationend(e) {
    e.target.removeEventListener(e.type, Helper.animationend)
    Helper.currentImage.endPreview(false)
    Helper.currentImage.enlargeDestroy(e)
    e.target.className = ''
  }
}
