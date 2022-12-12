import Render from "../../../core/render";
import './index.css'

/**
 * 全局遮罩层
 */

export default class Mask {

    static render = null

    static getInstance() {
        if (!Mask.render) Mask.render = new Render({ baseClassName: 'ls-preview-mask', hideName: 'hide', showName: 'show' })
        return Mask.render
    }

}
