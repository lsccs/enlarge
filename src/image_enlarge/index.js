import props from "./props";
import { addCss, getImageNatural } from "../utils";
import CloneEnlarge from "../core/clone_enlarge/index";
import Helper from "../core/helper";

/**
 * 图片预览
 */
export default class ImagePreview {

  config = null
  container = null

  currentImage = null
  imageList = []


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

      const preview = new Proxy(...this.createEnlargeProxy(img))
      this.imageList.push(preview)

      img.onload = () => this.imageLoad(img, item, preview)
    })
  }


  // 图片加载完毕回调
  imageLoad(img, item, preview) {
    const { sourceSrc } = this.config
    // 设置目标定位
    preview.onLoad()

    // 如果有原路径, 则更换目标对象
    if (item[sourceSrc]) {
      const target = img.cloneNode(true)
      target.$src = item[sourceSrc]
      // 更换原图链接，并重新计算位置
      target.load = () => {
        target.src = target.$src
      }
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

  // 获取图片草错所需要的配置
  getHandleConfig() {
    return {
      imageList: this.imageList,
      currentImage: this.currentImage,
      targetOnload: this.targetOnload
    }
  }

  // 属性拦截, 判断是否触发预览事件
  getProperty(target, property) {
    if (property === 'startPreview') {
      // 切换原图, 判断路径是否一致，可实现缓存图片
      const { load, src, $src } = target.config.$el
      if (load && $src !== src) load()
      this.currentImage = target
      Helper.setConfig(this.getHandleConfig())
    }
    return target[property]
  }

  // 创建代理对象参数, 拦截预览事件
  createEnlargeProxy(img) {
    return [
      new CloneEnlarge({
        el: img,
        ...this.config,
        handle: ({ name, arg }) =>
          Helper.handle({ name, arg })
      }),
      { get: this.getProperty.bind(this) }
    ]
  }
}
