import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 定义相机输出画布的尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
// 创建三维场景
const scene = new T.Scene()
// 创建几何结构“骨架”
const geometry = new T.BoxGeometry(1, 1, 1)
// 设置材质，“画皮”
const material = new T.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: false,
  opacity: 0.5,
})

// 将结构和材料组合成网格模型
const mesh = new T.Mesh(geometry, material)
scene.add(mesh)

const axesHelper = new T.AxesHelper(3)
scene.add(axesHelper)

const aspectRatio = sizes.width / sizes.height
// 透视投影相机
let camera = new T.PerspectiveCamera(20, aspectRatio, 1, 2000)
// 设置相机的位置
camera.position.set(5, 5, 5)

// 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
camera.lookAt(0, 0, 0)
const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
  // antialias: true,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// 调整将输出canvas的大小
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)
// 设置阻尼顺滑效果
controls.enableDamping = true
controls.enabled = true

addEventListener('resize', () => {
  console.log('resize')
  // update camera aspect
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer size
  renderer.setSize(sizes.width, sizes.height)
  // update pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
    console.log('go fullscreen')
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
    console.log('leave fullscreen')
  }
})

const render = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
