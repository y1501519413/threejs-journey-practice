import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Textures
 */
/**
 * method 1
 */
// const image = new Image()
// const texture = new T.Texture(image)
// image.onload = () => {
//   texture.needsUpdate = true
// }
// image.src = '/textures/minecraft.png'
/**
 * method 2
 */
const loadingManager = new T.LoadingManager()
loadingManager.onStart = () => {
  console.log('onStart')
}
loadingManager.onLoad = () => {
  console.log('onLoad')
}
loadingManager.onProgress = () => {
  console.log('onProgress')
}
loadingManager.onError = () => {
  console.log('onError')
}

const textureLoader = new T.TextureLoader(loadingManager)
// const colorTexture = textureLoader.load('/textures/door/color.jpg')
const colorTexture = textureLoader.load('/textures/minecraft.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// const heightTexture = textureLoader.load('/textures/door/height.jpg')
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = T.RepeatWrapping
// colorTexture.wrapT = T.RepeatWrapping
// colorTexture.offset.x = 0.5
// colorTexture.rotation = Math.PI / 4
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// 使用minFilter默认不再生成minMap
colorTexture.generateMipmaps = false
// colorTexture.minFilter = T.NearestFilter
colorTexture.magFilter = T.NearestFilter

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
  map: colorTexture,
  wireframe: false,
})
// 将结构和材料组合成网格模型
const mesh = new T.Mesh(geometry, material)
scene.add(mesh)

const axesHelper = new T.AxesHelper(3)
scene.add(axesHelper)

const aspectRatio = sizes.width / sizes.height
// 透视投影相机
const camera = new T.PerspectiveCamera(5, aspectRatio, 1, 2000)
// 设置相机的位置
camera.position.set(5, 5, 5)

// 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
camera.lookAt(0, 0, 0)
const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// 调整将输出canvas的大小
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)
// 设置阻尼顺滑效果
controls.enableDamping = true
controls.enabled = true

addEventListener('resize', () => {
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

const render = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
