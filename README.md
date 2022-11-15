#### 注： 在dom完全加载完毕之后再初始化

##### props
```typescript
interface config {
  
  type: string, // 处理的类型; 'image'
  $el: HTMLElement, // 克隆的目标dom
  el: HTMLElement, // 原始目标dom
  maskClose: boolean, // 是否开始点击遮罩层关闭
  rect?: {  // 目标宽高, 在type为image时可以不设置
    width: number,
    height: number
  }
}
```


##### 使用方式

```vue

<template>
  <img ref="img" src="" alt="" @load="previewLoad">
</template>


<script>
import Preview from "./index";

export default {
  methods: {

    previewLoad() {
      const preview = new Preview({
        type: 'image',
        el: this.$ref.img
      })
      
      // 也可以通过方法在其他业务场景下触发
      // preview.startPreview() || preview.endPreview()
    }
  }
}
</script>
```
