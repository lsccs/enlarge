import ImageEnlarge from "./controler/image_enlarge/index";
import AnyEnlarge from "./controler/any_enlarge/index";

export default class Enlarge {

  static config = null

  /**
   * 图片预览
   *
   * @param config
   * @returns {ImageEnlarge}
   * @constructor
   */
  static ImageEnlarge(config) {
    const globalConfig = { ...Enlarge.config }
    return new ImageEnlarge({ ...globalConfig, ...config })
  }


  /**
   * 其他任意标签预览放大
   *
   * @param config
   * @returns {AnyEnlarge}
   * @constructor
   */
  static AnyEnlarge(config) {
    const globalConfig = { ...Enlarge.config }
    return new AnyEnlarge({ ...globalConfig, ...config })
  }

  /**
   * 设置全局配置
   *
   * @param config
   */
  static setGlobalConfig(config) {
    Enlarge.config = config
  }
}
