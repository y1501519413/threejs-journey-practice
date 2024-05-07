import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Gui from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const gui = new Gui({
  title: 'Debug UI',
})

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
 * Scene
 */
const scene = new T.Scene()

// const gltfLoader = new GLTFLoader()
// gltfLoader.load(
//   '/models/Duck/glTF/Duck.gltf',
//   // '/models/Duck/glTF-Binary/Duck.glb',
//   // '/models/Duck/glTF-Embedded/Duck.gltf',
//   // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//   gltf => {
//     // gltf.scene.castShadow = true
//     console.log('gltf', gltf)
//     // gltf.scene.scale.set(4, 4, 4)
//     scene.add(gltf.scene)
//     // scene.add(gltf.scene.children[0])
//   },
//   success => {
//     console.log('success', success)
//   },
// )

// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('./draco/')
// const gltfDracoLoader = new GLTFLoader()
// gltfDracoLoader.setDRACOLoader(dracoLoader)
// gltfDracoLoader.load('/models/Duck/glTF-Draco/Duck.gltf', gltf => {
//   scene.add(gltf.scene)
// })
let mixer = null
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  '/models/Fox/glTF/Fox.gltf',
  // '/models/Duck/glTF-Binary/Duck.glb',
  // '/models/Duck/glTF-Embedded/Duck.gltf',
  // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  gltf => {
    // gltf.scene.castShadow = true
    console.log('gltf', gltf)
    mixer = new T.AnimationMixer(gltf.scene)
    // const action1 = mixer.clipAction(gltf.animations[0])
    // action1.play()
    // const action2 = mixer.clipAction(gltf.animations[1])
    // action2.play()
    const action3 = mixer.clipAction(gltf.animations[2])
    action3.play()
    // console.log('action', action)
    gltf.scene.scale.set(0.03, 0.03, 0.03)
    scene.add(gltf.scene)
    // scene.add(gltf.scene.children[0])
  },
  success => {
    console.log('success', success)
  },
)

/**
 * Plane
 */
const cubeTextureLoader = new T.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])
const plane = new T.Mesh(
  new T.PlaneGeometry(10, 10),
  new T.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  }),
)
plane.position.y = -0.01
plane.setRotationFromAxisAngle(new T.Vector3(1, 0, 0), -Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

const axesHelper = new T.AxesHelper(10)
axesHelper.visible = true
scene.add(axesHelper)

const directionalLight = new T.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.position.set(2, 2, 0)
directionalLight.lookAt(0, 0, 0)

const directionalLightHelper = new T.DirectionalLightHelper(directionalLight, 0.2)

const directionalLightCameraHelper = new T.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false

scene.add(directionalLight, directionalLightHelper, directionalLightCameraHelper)

gui.add(directionalLight, 'intensity', 0, 10, 0.01).name('Light Intensity')

/**
 * 透视投影相机
 */
const camera = new T.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
const perspectiveCameraHelper = new T.CameraHelper(camera)
perspectiveCameraHelper.visible = false
scene.add(perspectiveCameraHelper)

const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * 调整将输出canvas的大小
 */
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(0x262837, 0.7)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = T.PCFSoftShadowMap

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
let oldElapsedTime = null
const render = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // 模型动画
  mixer?.update(deltaTime)

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
