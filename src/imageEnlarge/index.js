import props from "./props";
import { addCss, getImageNatural } from "../utils";
import CloneEnlarge from "../../core/cloneEnlarge";

/**
 * 图片预览
 */
export default class ImagePreview {

  config = null
  container = null

  constructor(source) {
    const defaultProps = { ...props }
    this.config = Object.assign(defaultProps, source)
    this.onLoad()
  }


  // 创建图片列表，并初始化
  onLoad() {
    this.validate()
    const { container } = this.config
    this.container = document.querySelector(container)
  }


  render() {
    const { data, props } = this.config
    data.forEach(item => {
      const img = document.createElement('img')
      img.src = item.src
      this.buildAttrs(props, img)
      this.container.appendChild(img)

      img.onload = () => this.imageLoad(img, item)
    })
  }


  // 图片加载完毕回调
  imageLoad(img, item) {
    const { sourceSrc } = this.config
    // 设置目标定位
    const preview = new CloneEnlarge({ el: img, targetRect: getImageNatural(img), ...this.config })
    preview.onLoad()

    // 如果有原路径, 则更换目标对象
    if (item[sourceSrc]) {
      const target = img.cloneNode(true)
      target.src = item[sourceSrc]

      target.onload = () => this.targetOnload(target, preview)
    }
  }

  // 目标元素加载完毕时替换
  targetOnload(img, preview) {
    preview.setTargetAndRect({
      el: img,
      targetRect: getImageNatural(img)
    })
  }

  buildAttrs(props, img) {
    Object.keys(props).forEach(key => {
      if (key === 'style') {
        return addCss(img, props[key])
      }
      img.setAttribute(key, props[key])
    })
  }

  validate() {
    const { data, container } = this.config
    if (!data || !data.length) {
      throw new Error('image list is not empty')
    }
    if (!container) {
      throw new Error('render container is not empty')
    }
  }
}
