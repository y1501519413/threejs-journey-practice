import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Gui from 'lil-gui'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const gui = new Gui({
  title: 'Debug UI',
})

addEventListener('keyup', e => {
  if (e.key === 'h') {
    gui.show(gui._hidden)
  }
})
/**
 * Textures
 */
const textureLoader = new T.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/4.png')

/**
 * 字体加载器
 */
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
const fontLoader = new FontLoader()

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

fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  const textGeometry = new TextGeometry('Hello Three.js', {
    font,
    size: 0.5,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  })
  const material = new T.MeshMatcapMaterial({
    matcap: matcapTexture,
  })
  const textMesh = new T.Mesh(textGeometry, material)
  // const textGui = gui.addFolder('3D Text')
  // console.log('textMesh', textMesh.geometry.parameters.options)
  // textGui.add(textMesh.geometry.parameters.options, 'curveSegments', 0, 12, 1)
  // textGeometry.computeBoundingBox()
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
  // )
  textGeometry.center()
  scene.add(textMesh)

  console.time('donut')
  const donutGeometry = new T.TorusGeometry(0.5, 0.2, 12, 30)
  for (let i = 0; i < 300; i++) {
    const donut = new T.Mesh(donutGeometry, material)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
  }
  console.timeEnd('donut')
})

const axesHelper = new T.AxesHelper(3)
scene.add(axesHelper)

/**
 * 环境光源
 */
const ambientLight = new T.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

/**
 * 点光源
 */
const pointLight = new T.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
const lightGui = gui.addFolder('光源')
lightGui.add(pointLight, 'intensity').min(0).max(10).step(0.1).name('光线强度')

const pointLightHelper = new T.PointLightHelper(pointLight, 0.1)
scene.add(pointLight, pointLightHelper)

/**
 * 透视投影相机
 */
const aspectRatio = sizes.width / sizes.height
const camera = new T.PerspectiveCamera(70, aspectRatio, 0.1, 2000)

/**
 * 设置相机的位置
 */
camera.position.set(1, 1, 2)

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

const render = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
