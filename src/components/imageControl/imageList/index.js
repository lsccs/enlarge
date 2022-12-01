import Helper from "../../../core/helper";

import './index.css'
import Render from "../../../core/render";

let imageContainer = null
const baseClassName = 'preview-control'

export default function createImageList (source) {

  const render = new Render({ baseClassName, showName: 'preview-fade-in', hideName: 'preview-fade-out' })

  const container = document.createElement('div')
  const inner = document.createElement('div')
  container.className = baseClassName
  inner.className = 'preview-control-image-list'

  const imageList = createImage(source)
  inner.append(...imageList)
  container.append(inner)

  imageContainer = inner
  registerCallback(imageList)


  return {
    dom: container,
    show() {
      render.show([container])
    },
    hide() {
      render.hide()
      clearImageEvents(imageList)
    }
  }
}

// 注册回调
function registerCallback(imageList) {
  Helper.registerCallback('togglePreviewImage', image => togglePreviewImage(image, imageList))
}

// 切换图片回调
function togglePreviewImage(image, imageList) {
  const { el: nextEl } = image.config
  const nextIndex = imageList.findIndex(item => item.src === nextEl.src)

  removeActiveImage(imageList[Helper.currentImageIndex])
  activeImage(imageList[nextIndex])
}

// 创建图片列表
function createImage(source) {
  const { data, sourceSrc, el } = source
  return data.map(item => {
    const img = document.createElement('img')
    img.src = item.src
    img.dataSrc = item[sourceSrc]

    img.className = 'preview-image'
    img.style.width = '30px'
    img.style.height = '50px'
    img.addEventListener('click', handleTogglePreviewImage)
    if (el.src === item.src) {
      img.onload = () => {
        activeImage(img)
      }
    }
    return img
  })
}

function handleTogglePreviewImage(e) {
  e.stopPropagation()
  const nextIndex = Helper.imageList.findIndex(item => item.config.el.src === e.target.src)
  if (nextIndex === Helper.currentImageIndex) return;

  Helper.togglePreviewImage(Helper.imageList[nextIndex])
}


function clearImageEvents(imageList) {
  imageList.forEach(img => {
    img.removeEventListener('click', handleTogglePreviewImage)
  })
}
// 激活图片并调整中心位置
function activeImage(img) {
  if (img) {
    img.className += ' active'
    const width = document.body.clientWidth
    const imgRect = img.getBoundingClientRect()

    const interpolation = (width / 2) - imgRect.left
    const imgSelfWidth = (imgRect.width / 2)

    const preX = parseFloat(imageContainer.getAttribute('data-x') || 0)

    const lateX = interpolation - imgSelfWidth + preX
    imageContainer.setAttribute('data-x', lateX)
    imageContainer.style.transform = `translateX(${lateX}px)`
  }
}

function removeActiveImage(img) {
  if (img) {
    img.className = img.className.replaceAll(' active', '')
  }
}
