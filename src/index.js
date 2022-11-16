import ImageEnlarge from "./imageEnlarge";
import AnyEnlarge from "./anyEnlarge";


export default class Enlarge {

  /**
   * 图片预览
   *
   * @param config
   * @returns {ImageEnlarge}
   * @constructor
   */
  static ImageEnlarge(config) {
    return new ImageEnlarge(config)
  }


  /**
   * 其他任意标签预览放大
   *
   * @param config
   * @returns {AnyEnlarge}
   * @constructor
   */
  static AnyEnlarge(config) {
    return new AnyEnlarge(config)
  }
}
