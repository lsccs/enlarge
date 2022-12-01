import Mask from "../mask/index";
import createArrow from "./arrow/index";
import createImageList from './imageList/index'


export default class ImageControl {

  static controlList = []

  static show(source) {
    ImageControl.controlList = [
      createArrow(source.handle),
      createImageList(source)
    ]
    Mask.getInstance().show()
    ImageControl.controlList.forEach(control => {
      control.show()
    })
  }

  static hide() {
    Mask.getInstance().hide()
    ImageControl.controlList.forEach(control => control.hide())
  }
}
