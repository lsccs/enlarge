import Mask from "../../core/mask/index";
import createArrow from "./arrow/index";


export default class ImageControl {

  static controlList = []

  static show(handle) {
    ImageControl.controlList = [
      createArrow(handle)
    ]

    Mask.show(
      ImageControl.controlList.map(control => {
        control.show()
        return control.dom
      })
    )
  }

  static hide() {
    Mask.hide()
    ImageControl.controlList.forEach(control => control.hide())
  }
}
