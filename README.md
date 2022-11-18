##### 目前支持下方两种使用方式

##### * 项目引入了 Iconify 图标库
```javascript
// 1. 图片预览初始化配置
const preview = Enlarge.ImagePreview(ImageConfig)
// 2. 调用 render 方法渲染图片
preview.render()
```

```javascript
// 1. 其他组件放大预览
const preview = Enlarge.AnyPreview(AnyConfig)
// 2. 调用 render 方法手动触发放大逻辑
preview.render()
```



#### ImageConfig
| 属性        | 类型     | 描述                               | 默认值 |
|:----------|:-------|:---------------------------------|:----------|
| container | string | 标签选择器                            | /         |
| data      | array  | 图片列表，[{ src: '', dataSrc?: '' }] | []  |
| sourceSrc | string | 用于设置原图路径的key                     | 'dataSrc' |
| props     | object | 图片标签的属性                          |           |


#### AnyConfig
| 属性  | 类型      | 描述         | 默认值  |
|:----|:--------|:-----------|:-----|
| el  | Element | 绑定的预览dom对象 | null |



#### Common
| 属性        | 类型      | 描述                     | 默认值  |
|:--------|:--------|:-----------------------|:-----|
| maskClose | boolean | 是否开启点击遮罩关闭             | true |
| targetRect | object  | 目标对象的任意位置大小属性, 图片模式下无效 | {}   |
