import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Gui from 'lil-gui'

const gui = new Gui({
  title: 'Debug UI',
})
gui.close()
addEventListener('keyup', e => {
  if (e.key === 'h') {
    gui.show(gui._hidden)
  }
})

const textureloader = new T.TextureLoader()
const bakedShadow = textureloader.load('textures/shadow/bakedShadow.jpg')
const simpleShadow = textureloader.load('textures/shadow/simpleShadow.jpg')

/**
 * 定义相机输出画布的尺寸
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
/**
 * Scene
 */
const scene = new T.Scene()

const material = new T.MeshStandardMaterial()

// 创建一个球体
const sphere = new T.Mesh(new T.SphereGeometry(0.5, 32, 32), material)
// sphere.position.y = 1
sphere.castShadow = true

// 创建一个平面
const plane = new T.Mesh(
  new T.PlaneGeometry(5, 5),
  material,
  // new T.MeshBasicMaterial({
  //   map: bakedShadow,
  // }),
)
plane.position.y = -0.5
plane.rotation.x = -Math.PI * 0.5
plane.receiveShadow = true

const sphereShadow = new T.Mesh(
  new T.PlaneGeometry(1.5, 1.5),
  new T.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  }),
)
simpleShadow.castShadow = true
sphereShadow.position.y = plane.position.y + 0.01
sphereShadow.rotation.x = -Math.PI * 0.5
scene.add(sphere, plane, sphereShadow)

const axesHelper = new T.AxesHelper(3)
scene.add(axesHelper)

/**
 * 环境光
 */
const ambientLight = new T.AmbientLight(0xffffff, 0.3)
const ambientLightGui = gui.addFolder('平行光源')
ambientLightGui.add(ambientLight, 'intensity').min(0).max(2).step(0.1).name('光线强度')
scene.add(ambientLight)

/**
 * 平行光源
 */
const directionalLight = new T.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, -1)
const directionalLightGui = gui.addFolder('平行光源')
directionalLightGui.add(directionalLight.position, 'x').min(-2).max(2).step(0.1)
directionalLightGui.add(directionalLight.position, 'y').min(-2).max(2).step(0.1)
directionalLightGui.add(directionalLight.position, 'z').min(-2).max(2).step(0.1)
directionalLightGui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(2)
  .step(0.1)
  .name('光线强度')
directionalLightGui.addColor(directionalLight, 'color').name('光线颜色')
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 8

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
// directionalLight.shadow.radius = 20
// console.log('directionalLight.shadow', directionalLight.shadow)
const directionalLightHelper = new T.DirectionalLightHelper(directionalLight, 0.1)
directionalLightHelper.visible = false

const directionalLightCameraHelper = new T.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLight, directionalLightHelper, directionalLightCameraHelper)

/**
 * 聚光灯
 */
const spotLight = new T.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.2)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
const spotLightHelper = new T.SpotLightHelper(spotLight)
spotLightHelper.visible = false
console.log('spotLight.shadow', spotLight.shadow)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
const spotLightCameraHelper = new T.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false

const spotLightGui = gui.addFolder('聚光灯光源')
spotLightGui.add(spotLight, 'intensity').min(0).max(2).step(0.1)
scene.add(spotLight, spotLightHelper, spotLightCameraHelper)

/**
 * 点光源
 */
const pointLight = new T.PointLight(0xffffff, 0.3, 10)
pointLight.position.set(-1, 1, 0)
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

const pointLightGui = gui.addFolder('点光源')
pointLightGui.add(pointLight, 'intensity').min(0).max(2).step(0.1)

const pointLightHelper = new T.PointLightHelper(pointLight)
pointLightHelper.visible = false
pointLight.castShadow = true
const pointLightCameraHelper = new T.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLight, pointLightHelper, pointLightCameraHelper)

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
const postion = new T.Vector3(-1.5606315165766655, 1.581452740139836, 1.2491471391796023)
camera.position.set(postion.x, postion.y, postion.z)

/**
 * 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
 */
camera.lookAt(0, -1, -1)

const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * 调整将输出canvas的大小
 */
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = T.PCFSoftShadowMap

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
  const elapsedTime = clock.getElapsedTime()
  // update mesh
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
  // update shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3
  // console.log('camera', camera)
  // plane.rotateZ(0.01)
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
