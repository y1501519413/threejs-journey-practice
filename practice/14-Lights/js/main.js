import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

import Gui from 'lil-gui'

const gui = new Gui({
  title: 'Debug UI',
})

addEventListener('keyup', e => {
  if (e.key === 'h') {
    gui.show(gui._hidden)
  }
})

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
const shpere = new T.Mesh(new T.SphereGeometry(1, 20, 20), material)
shpere.position.x = -2
// 创建一个平面
const plane = new T.Mesh(new T.PlaneGeometry(10, 10), material)
plane.position.y = -1
plane.rotation.x = -Math.PI * 0.5

// 创建一个盒子
const cube = new T.Mesh(new T.BoxGeometry(1, 1, 1), material)
// cube.position.x = 1

// 创建一个圆环
const torus = new T.Mesh(new T.TorusGeometry(1, 0.3), material)
torus.position.x = 2
scene.add(shpere, plane, cube, torus)

const axesHelper = new T.AxesHelper(3)
scene.add(axesHelper)

/**
 * 环境光源
 */
const ambientLight = new T.AmbientLight(0xffffff, 0)
scene.add(ambientLight)
const ambientLightGui = gui.addFolder('环境光源')
ambientLightGui.add(ambientLight, 'intensity').min(0).max(1).step(0.1).name('光线强度')

/**
 * 定向光
 */
const directionLight = new T.DirectionalLight(0x00ffff, 0)
const directionLightHelper = new T.DirectionalLightHelper(directionLight, 0.1)
directionLight.position.x = 0
directionLight.position.y = 0
directionLight.position.z = -5
directionLight.target = shpere
// directionLight.target = torus
scene.add(directionLight, directionLightHelper)
const directionLightGui = gui.addFolder('定向光源')
directionLightGui
  .add(directionLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.1)
  .name('光线强度')

/**
 * 半圆光源
 */
const hemisphereLight = new T.HemisphereLight(0xff0000, 0x0000ff, 0)
const hemisphereLightHelper = new T.HemisphereLightHelper(hemisphereLight, 3)
hemisphereLight.position.set(0, 1, 0)
scene.add(hemisphereLightHelper)

scene.add(hemisphereLight)
const hemisphereLighttGui = gui.addFolder('半圆光源')
hemisphereLighttGui
  .add(hemisphereLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.1)
  .name('光线强度')

/**
 * 点光源
 */
const pointLight = new T.PointLight(0xffffff, 0, 10, 2)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
const pointLightGui = gui.addFolder('点光源')
pointLightGui.add(pointLight, 'intensity').min(0).max(1).step(0.1).name('光线强度')
pointLightGui.add(pointLight, 'distance').min(0).max(15).step(0.1).name('照射距离')
pointLightGui.add(pointLight, 'decay').min(0).max(5).step(0.1).name('衰减量')
pointLightGui.addColor(pointLight, 'color').name('光线颜色')

const pointLightHelper = new T.PointLightHelper(pointLight, 0.1)
scene.add(pointLight, pointLightHelper)

/**
 * 矩形光源
 */
const rectAreaLight = new T.RectAreaLight(0x3bd926, 0, 3, 3)
rectAreaLight.position.set(-2, 0, 5)
rectAreaLight.lookAt(new T.Vector3(-1, 0, 0))

const rectAreaLightGui = gui.addFolder('矩形光源')
rectAreaLightGui.add(rectAreaLight, 'intensity').min(0).max(10).step(0.1).name('光线强度')
rectAreaLightGui.addColor(rectAreaLight, 'color').name('光线颜色')
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0x00ffff)
scene.add(rectAreaLight, rectAreaLightHelper)

/**
 * 聚光灯光源
 */
const spotLight = new T.SpotLight(0xc931b5, 2.2, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)

const spotLightGui = gui.addFolder('聚光灯光源')
spotLightGui.add(spotLight, 'intensity').min(0).max(10).step(0.1).name('光线强度')
spotLightGui.addColor(spotLight, 'color').name('光线颜色')

const spotLightHelper = new T.SpotLightHelper(spotLight)
scene.add(spotLight, spotLightHelper)

/**
 * 透视投影相机
 */
const aspectRatio = sizes.width / sizes.height
const camera = new T.PerspectiveCamera(80, aspectRatio, 0.1, 2000)

/**
 * 设置相机的位置
 */
camera.position.set(0, 0, 6)

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
  cube.rotation.x = elapsedTime * 0.3
  cube.rotation.y = elapsedTime * 0.3
  torus.rotation.x = elapsedTime * 0.3
  torus.rotation.y = elapsedTime * 0.3

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
