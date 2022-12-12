import createArrow from "./arrow/index";
import createImageList from './imageList/index'

import CommonControl from '../common_control/index'

export default class ImageControl {

  static controlList = []

  static show(source) {
    ImageControl.controlList = [
      createArrow(source),
      createImageList(source)
    ]

    CommonControl.show(source)
    ImageControl.controlList.forEach(control => control.show())
  }

  static hide() {
    CommonControl.hide()
    ImageControl.controlList.forEach(control => control.hide())
  }
}
