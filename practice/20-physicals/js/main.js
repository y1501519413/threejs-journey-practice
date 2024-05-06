import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as C from 'cannon-es'
import Gui from 'lil-gui'

const gui = new Gui({
  title: 'Debug UI',
})
const hitAudio = new Audio('/sounds/hit.mp3')
const playHitAudio = collision => {
  const impactVelocity = collision.contact.getImpactVelocityAlongNormal()
  // 获取撞击强度，强度较小，不播放音效
  if (impactVelocity < 2) return
  hitAudio.volume = Math.min(Math.random() + 0.5, 1)
  hitAudio.currentTime = 0
  hitAudio.play()
}

addEventListener('keyup', e => {
  if (e.key === 'h') {
    gui.show(gui._hidden)
  }
})
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const cubeTextureLoader = new T.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])

/**
 * Scene
 */
const scene = new T.Scene()

/**
 * Physics
 */
const world = new C.World()
world.gravity.set(0, -9.82, 0)
// world.broadphase = new C.NaiveBroadphase(world)
world.broadphase = new C.SAPBroadphase(world)
world.allowSleep = true

/**
 * 材料
 */
const defaultMaterial = new C.Material('default')

/**
 * 创建材料间关系
 */
const contactDefaultMaterial = new C.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1, // 摩擦
  restitution: 0.7, // 反弹力
})
world.addContactMaterial(contactDefaultMaterial)
world.defaultContactMaterial = contactDefaultMaterial

/**
 * Physics Sphere
 */
// const sphereShape = new C.Sphere(0.5)
// const sphereBody = new C.Body({
//   mass: 1,
//   position: new C.Vec3(0, 3, 0),
//   shape: sphereShape,
// })
// // sphereBody.applyLocalForce(new C.Vec3(-10, 0, -10), new C.Vec3(10, 0, 20))
// sphereBody.applyLocalForce(new C.Vec3(150, 0, 0), new C.Vec3(0, 0, 0))
// world.addBody(sphereBody)

/**
 * Physics Floor
 */
const floorShape = new C.Plane()
const floorBody = new C.Body({
  mass: 0,
  shape: floorShape,
  // quaternion: new C.Quaternion(-1, 0, 0),
})
// 设置沿x轴正方向为轴，顺时针旋转90度
floorBody.quaternion.setFromAxisAngle(new C.Vec3(1, 0, 0), -Math.PI * 0.5)

world.addBody(floorBody)

/**
 * Sphere
 */
// const sphere = new T.Mesh(
//   new T.SphereGeometry(0.5, 32, 32),
//   new T.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   }),
// )
// sphere.castShadow = true
// sphere.visible = true
// const sphereGui = gui.addFolder('模型')
// sphereGui.add(sphere.position, 'x', 0, 5, 1)
// scene.add(sphere)

/**
 * Plane
 */
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
// plane.rotation.x = -Math.PI / 2
plane.setRotationFromAxisAngle(new T.Vector3(1, 0, 0), -Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

const axesHelper = new T.AxesHelper(10)
axesHelper.visible = true
scene.add(axesHelper)

const directionalLight = new T.DirectionalLight({
  color: 0xffffff,
  intensity: 2,
})
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
// directionalLight.shadow.camera.near = 2.5
// directionalLight.shadow.camera.far = 5.5
// directionalLight.shadow.camera.top = 2
// directionalLight.shadow.camera.bottom = -2
// directionalLight.shadow.camera.right = 2
// directionalLight.shadow.camera.left = -2
// const directionalLightHelper = new T.DirectionalLightHelper(directionalLight, 0.1)
// directionalLightHelper.visible = false
const directionalLightCameraHelper = new T.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight, directionalLightCameraHelper)

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

/**
 * Utils
 */
/**
 * Create Sphere
 */
const sphereGeometry = new T.SphereGeometry(1, 20, 20)
const sphereMaterial = new T.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
})

const objectsToUpdate = []
const createSphere = (radius, position) => {
  const mesh = new T.Mesh(sphereGeometry, sphereMaterial)
  mesh.castShadow = true
  mesh.scale.set(radius, radius, radius)
  mesh.position.copy(position)
  scene.add(mesh)

  const shape = new C.Sphere(radius)
  const body = new C.Body({
    mass: 1,
    position: new C.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitAudio)
  world.addBody(body)

  objectsToUpdate.push({
    mesh,
    body,
  })
}

/**
 * Create Box
 */
const boxGeometry = new T.BoxGeometry(1, 1, 1)
const createBox = (width, height, depth, position) => {
  const mesh = new T.Mesh(boxGeometry, sphereMaterial)
  mesh.castShadow = true
  mesh.scale.set(width, height, depth)
  mesh.position.copy(position)
  scene.add(mesh)

  // 从盒子的中央开始
  const shape = new C.Box(new C.Vec3(width * 0.5, height * 0.5, depth * 0.5))
  const body = new C.Body({
    mass: 1,
    position: new C.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitAudio)
  world.addBody(body)

  objectsToUpdate.push({
    mesh,
    body,
  })
}
/**
 * Debug
 */
const debugObject = {}
debugObject.createSphere = () => {
  const x = (Math.random() - 0.5) * 3
  const y = 3
  const z = (Math.random() - 0.5) * 3
  const radius = Math.random() * 0.7
  createSphere(radius, {
    x,
    y,
    z,
  })
}
debugObject.createBox = () => {
  const width = Math.random() * 2
  const height = Math.random() * 2
  const depth = Math.random() * 2
  const x = (Math.random() - 0.5) * 3
  const y = 3
  const z = (Math.random() - 0.5) * 3
  createBox(width, height, depth, {
    x,
    y,
    z,
  })
}
debugObject.reset = () => {
  for (const obj of objectsToUpdate) {
    obj.body.removeEventListener('collide', playHitAudio)
    world.removeBody(obj.body)
    scene.remove(obj.mesh)
  }
  objectsToUpdate.splice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'createSphere').name('生成球体模型')
gui.add(debugObject, 'createBox').name('生成盒子模型')
gui.add(debugObject, 'reset').name('重置模型')

const clock = new T.Clock()
let oldElapsedTime = null
const render = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime
  for (const obj of objectsToUpdate) {
    obj.mesh.position.copy(obj.body.position)
    obj.mesh.quaternion.copy(obj.body.quaternion)
  }
  // update physics world
  world.step(1 / 60, deltaTime, 3)

  // 添加一个推力
  // sphereBody.applyForce(new C.Vec3(-0.5, 0, 0), sphereBody.position)

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
