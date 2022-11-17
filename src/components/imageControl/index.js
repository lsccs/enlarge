import Mask from "../../core/mask";
import createArrow from "./arrow";


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
