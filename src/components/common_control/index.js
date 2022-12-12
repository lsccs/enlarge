
import Mask from './mask/index'
import Close from './close/index'

export default class CommonControl {

  static controlList = []

  static show(source) {

    const mask = {
      show: () => Mask.getInstance().show(),
      hide: () => Mask.getInstance().hide()
    }

    CommonControl.controlList = [
      mask,
      Close
    ]

    CommonControl.controlList.forEach(control => control.show(source))
  }


  static hide() {
    CommonControl.controlList.forEach(control => control.hide())
  }
}
