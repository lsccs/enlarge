import props from "../imageEnlarge/props";
import SeizeEnlarge from "../../core/seizeEnlarge";

export default class AnyPreview {

  config = null
  preview = null

  constructor(source) {
    const defaultProps = { ...props }
    this.config = Object.assign(defaultProps, source)
    this.onLoad()
  }



  onLoad() {
    this.validate()
    this.preview = new SeizeEnlarge(this.config)
    this.preview.onLoad()
  }


  render() {
    this.preview.startPreview()
  }


  validate() {
    const { el } = this.config
    if (!el) {
      throw new Error('target element is not empty')
    }
  }
}
