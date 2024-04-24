import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Gui from 'lil-gui'

const gui = new Gui({
  title: 'Debug UI',
})
// gui.close()
addEventListener('keyup', e => {
  if (e.key === 'h') {
    gui.show(gui._hidden)
  }
})
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
/**
 * 纹理加载器
 */
const textureloader = new T.TextureLoader()
const particleTexture = textureloader.load('/textures/particles/2.png')

/**
 * Scene
 */
const scene = new T.Scene()

/**
 * glaxy generator
 */
const params = {
  count: 100 * 1000,
  size: 0.01,
  radius: 5,
  branchs: 4,
  spin: 1,
  randomness: 0.47,
  randomnessPow: 1,
  insideColor: 0xff6030,
  outsideColor: 0x1b3984,
}
gui.add(params, 'count', 1000, 100 * 1000, 10).name('粒子数量')
gui.add(params, 'size', 0.001, 0.1, 0.001).name('粒子大小')
gui.add(params, 'radius', 3, 20, 1).name('半径')
gui.add(params, 'branchs', 3, 20, 1).name('分支数')
gui.add(params, 'spin', -5, 5, 0.1).name('旋转')
gui.add(params, 'randomness', 0, 2, 0.001).name('随机')
gui.add(params, 'randomnessPow', 1, 10, 0.1).name('随机量')
gui.addColor(params, 'insideColor').name('中心色')
gui.addColor(params, 'outsideColor').name('边缘色')
gui.onFinishChange(() => {
  generateGlaxy()
})

let pointGeometry
let pointMaterials
let points

const generateGlaxy = () => {
  /**
   * 清除旧参数
   */
  if (points) {
    pointGeometry.dispose()
    pointMaterials.dispose()
    scene.remove(points)
  }
  pointGeometry = new T.BufferGeometry()
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)

  const colorInside = new T.Color(params.insideColor)
  const colorOutside = new T.Color(params.outsideColor)

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3
    // 点长度
    const radius = Math.random() * params.radius
    // 点旋转角度 搭配
    const spinAngle = radius * params.spin
    // 点角度
    const branchAngle = ((i % params.branchs) / params.branchs) * Math.PI * 2

    const randomX =
      Math.pow(Math.random(), params.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius
    const randomY =
      Math.pow(Math.random(), params.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius
    const randomZ =
      Math.pow(Math.random(), params.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = 0 + randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    // color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / params.radius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  pointGeometry.setAttribute('position', new T.BufferAttribute(positions, 3))
  pointGeometry.setAttribute('color', new T.BufferAttribute(colors, 3))

  pointMaterials = new T.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    // color: 0xff88cc,
    // transparent: true,
    // alphaMap: particleTexture,
    depthWrite: false,
    blending: T.AdditiveBlending,
    vertexColors: true,
  })
  points = new T.Points(pointGeometry, pointMaterials)
  scene.add(points)
}

generateGlaxy()

/**
 * Cube
 */
const cube = new T.Mesh(
  new T.BoxGeometry(1, 1, 1),
  new T.MeshBasicMaterial({ color: 0xffffff }),
)
// scene.add(cube)

const axesHelper = new T.AxesHelper(10)
axesHelper.visible = false
scene.add(axesHelper)

/**
 * 透视投影相机
 */
const aspectRatio = sizes.width / sizes.height
const camera = new T.PerspectiveCamera(75, aspectRatio, 0.1, 2000)
const perspectiveCameraHelper = new T.CameraHelper(camera)
perspectiveCameraHelper.visible = false
scene.add(perspectiveCameraHelper)

/**
 * 设置相机的位置
 */
const position = {
  x: 3,
  y: 3,
  z: 3,
}
camera.position.set(position.x, position.y, position.z)

/**
 * 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
 */
camera.lookAt(0, 0, 0)

const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * 调整将输出canvas的大小
 */
renderer.setSize(sizes.width, sizes.height)
// renderer.setClearColor(0x262837)

const controls = new OrbitControls(camera, canvas)
/**
 * 设置阻尼顺滑效果
 */
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
const clock = new T.Clock()
const render = () => {
  // console.log('camera', camera.position)
  const elapsedTime = clock.getElapsedTime()
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
