import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
 * Textures
 */
const textureLoader = new T.TextureLoader()
const cubeTextureLoader = new T.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg',
)
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/4/px.png',
  '/textures/environmentMaps/4/nx.png',
  '/textures/environmentMaps/4/py.png',
  '/textures/environmentMaps/4/ny.png',
  '/textures/environmentMaps/4/pz.png',
  '/textures/environmentMaps/4/nz.png',
])
// 定义相机输出画布的尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
// Scene
const scene = new T.Scene()

// 基本材质
// const material = new T.MeshBasicMaterial({
//   color: 0x00ffff,
//   map: doorColorTexture,
//   transparent: true,
//   opacity: 0.8,
//   wireframe: true,
// })
// 控制整个表面的不透明度
// material.alphaMap = doorAlphaTexture
// material.side = T.DoubleSide

/**
 * 法线网格材质
 */
// const material = new T.MeshNormalMaterial({
//   color: 0xff0000,
//   side: T.DoubleSide,
// })
// material.flatShading = true

/**
 * mat cap 材质
 */
// const material = new T.MeshMatcapMaterial()
// material.matcap = matcapTexture

/**
 * 深度材质
 * 深度基于相机远近平面。白色最近，黑色最远
 */
// const material = new T.MeshDepthMaterial()

/**
 * 非光泽表面材质
 */
// const material = new T.MeshLambertMaterial()

/**
 * 镜面高光材质
 */
// const material = new T.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new T.Color(0x00ff00)

/**
 * 卡通着色材质
 */
// const material = new T.MeshToonMaterial({
//   color: 0x049ef4,
//   gradientMap: gradientTexture,
// })

/**
 * mag过滤器会试图修复非常小的纹理
 * 使用最近的过滤器
 */
// gradientTexture.minFilter = T.NearestFilter
// gradientTexture.magFilter = T.NearestFilter
// gradientTexture.generateMipmaps = false

/**
 * 网格标准材质
 */
const material = new T.MeshStandardMaterial()
// 基本贴图
material.map = doorColorTexture
// 控制整个表面的不透明度，黑色表示完全透明，白色表示完全不透明
material.alphaMap = doorAlphaTexture
material.transparent = true
// 环境遮挡贴图，线条覆盖在模型上
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
// 位移贴图会影响网格顶点的位置，使模型凸起
material.displacementMap = doorHeightTexture
material.displacementScale = 0.1
// 法线贴图，具有凹凸轮廓感
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
// 设置金属贴图后，金属度仅由金属贴图控制
material.metalnessMap = doorMetalnessTexture
material.metalness = 0.5
// 设置粗糙度贴图后，粗糙度仅由粗糙贴图控制
material.roughnessMap = doorRoughnessTexture
material.roughness = 0.23

// const material = new T.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 0
// material.envMap = environmentMapTexture

const standardGui = gui.addFolder('网格标准材质')
standardGui.add(material, 'metalness').min(0).max(1).step(0.01).name('金属度')
standardGui.add(material, 'roughness').min(0).max(1).step(0.01).name('粗糙度')
standardGui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01)
standardGui.add(material, 'displacementScale').min(0).max(1).step(0.01)

// 创建球体
const sphere = new T.Mesh(new T.SphereGeometry(1, 20, 20), material)
sphere.geometry.setAttribute(
  'uv2',
  new T.BufferAttribute(sphere.geometry.attributes.uv.array, 2),
)
sphere.position.x = -2.5

// 创建平面
const plane = new T.Mesh(new T.PlaneGeometry(1, 1, 100, 100), material)
plane.geometry.setAttribute(
  'uv2',
  new T.BufferAttribute(plane.geometry.attributes.uv.array, 2),
)

// 创建圆环
const torus = new T.Mesh(new T.TorusGeometry(1, 0.3), material)
torus.geometry.setAttribute(
  'uv2',
  new T.BufferAttribute(torus.geometry.attributes.uv.array, 2),
)
torus.position.x = 2

scene.add(sphere, plane, torus)

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

const aspectRatio = sizes.width / sizes.height
// 透视投影相机
const camera = new T.PerspectiveCamera(60, aspectRatio, 0.1, 2000)
// 设置相机的位置
const position = {
  x: -0.2860163338666776,
  y: -0.2097441952885631,
  z: 0.7086929925177357,
}
camera.position.set(position.x, position.y, position.z)

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
const clock = new T.Clock()

const render = () => {
  const elapsedTime = clock.getElapsedTime()
  // console.log('camera', camera.position)
  // sphere.rotation.y = elapsedTime * 0.1
  // plane.rotation.y = elapsedTime * 0.3
  // torus.rotation.y = elapsedTime * 0.2

  // sphere.rotation.x = elapsedTime * 0.1
  // plane.rotation.x = elapsedTime * 0.3
  // torus.rotation.x = elapsedTime * 0.2

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
