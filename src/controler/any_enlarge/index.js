import props from "../image_enlarge/props";
import SeizeEnlarge from "../../core/seize_enlarge";
import Events from '../../aspect/event'

export default class AnyPreview extends Events {

  config = null;
  preview = null;

  constructor(source) {
    super();
    const defaultProps = { ...props }
    this.config = Object.assign(defaultProps, source)
    this.onLoad()
  }



  onLoad() {
    this.validate()
    this.preview = new SeizeEnlarge(this.config, this)
    this.preview.onLoad()
  }


  render() {
    this.preview.clickStart()
  }


  validate() {
    const { el } = this.config
    if (!el) {
      throw new Error('target element is not empty')
    }
  }
}
