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

/**
 * 门贴图
 */
const textureloader = new T.TextureLoader()
const doorColorTexture = textureloader.load('textures/door/color.jpg')
const doorAlphaTexture = textureloader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureloader.load(
  'textures/door/ambientOcclusion.jpg',
)
const doorHeightTexture = textureloader.load('textures/door/height.jpg')
const doorNormalTexture = textureloader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureloader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureloader.load('textures/door/roughness.jpg')

/**
 * 墙贴图
 */
const bricksColorTexture = textureloader.load('textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureloader.load(
  'textures/bricks/ambientOcclusion.jpg',
)
const bricksNormalTexture = textureloader.load('textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureloader.load('textures/bricks/roughness.jpg')

/**
 * 草贴图
 */
const grassColorTexture = textureloader.load('textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureloader.load(
  'textures/grass/ambientOcclusion.jpg',
)
const grassNormalTexture = textureloader.load('textures/grass/normal.jpg')
const grassRoughnessTexture = textureloader.load('textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = T.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = T.RepeatWrapping
grassNormalTexture.wrapS = T.RepeatWrapping
grassRoughnessTexture.wrapS = T.RepeatWrapping

grassColorTexture.wrapT = T.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = T.RepeatWrapping
grassNormalTexture.wrapT = T.RepeatWrapping
grassRoughnessTexture.wrapT = T.RepeatWrapping

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

/**
 * fog
 */
const fog = new T.Fog(0x262837, 1, 20)
scene.fog = fog

/**
 * House
 */
const house = new T.Group()
scene.add(house)

// walls
const wallSize = {
  width: 4,
  height: 2.5,
  depth: 4,
}
const walls = new T.Mesh(
  new T.BoxGeometry(wallSize.width, wallSize.height, wallSize.depth),
  new T.MeshStandardMaterial({
    // color: 0xac8e82,
    map: bricksColorTexture,
    // 环境遮挡贴图，线条覆盖在模型上，需要第二组UV
    aoMap: bricksAmbientOcclusionTexture,
    aoMapIntensity: 2,
    normalMap: bricksNormalTexture,
    normalScale: new T.Vector2(0.5, 0.5),
    roughnessMap: bricksRoughnessTexture,
    roughness: 0.7,
  }),
)
const wallsGui = gui.addFolder('墙材质')
wallsGui.add(walls.material, 'metalness').min(0).max(1).step(0.01).name('金属度')
wallsGui.add(walls.material, 'roughness').min(0).max(1).step(0.01).name('粗糙度')
wallsGui.add(walls.material, 'aoMapIntensity').min(0).max(10).step(0.01)
walls.geometry.setAttribute(
  'uv2',
  new T.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
)
walls.position.y = 2.5 / 2
house.add(walls)

// roof
const roofSize = {
  radius: Math.sqrt(Math.pow(wallSize.width, 2) + Math.pow(wallSize.depth, 2)) / 2 + 0.5,
  height: 1,
  radialSegments: 4,
}
const roof = new T.Mesh(
  new T.ConeGeometry(roofSize.radius, roofSize.height, roofSize.radialSegments),
  new T.MeshStandardMaterial({ color: 0xb35f45 }),
)
roof.position.y = wallSize.height + roofSize.height / 2
roof.rotation.y = Math.PI / 4
house.add(roof)

// door
const door = new T.Mesh(
  new T.PlaneGeometry(2.5, 2.5, 100, 100),
  new T.MeshStandardMaterial({
    // color: 0xaa7b7b,
    // 基本贴图
    map: doorColorTexture,
    // 控制整个表面的不透明度，黑色表示完全透明，白色表示完全不透明
    transparent: true,
    alphaMap: doorAlphaTexture,
    // 环境遮挡贴图，线条覆盖在模型上，需要第二组UV
    aoMap: doorAmbientOcclusionTexture,
    aoMapIntensity: 1,
    // 位移贴图会影响网格顶点的位置，使模型凸起
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    // 法线贴图，具有凹凸轮廓感
    normalMap: doorNormalTexture,
    normalScale: new T.Vector2(0.5, 0.5),
    // 设置金属贴图后，金属度仅由金属贴图控制
    metalnessMap: doorMetalnessTexture,
    metalness: 0.5,
    // 设置粗糙度贴图后，粗糙度仅由粗糙贴图控制
    roughnessMap: doorRoughnessTexture,
    roughness: 0.7,
  }),
)
const doordGui = gui.addFolder('门材质')
doordGui.add(door.material, 'metalness').min(0).max(1).step(0.01).name('金属度')
doordGui.add(door.material, 'roughness').min(0).max(1).step(0.01).name('粗糙度')
doordGui.add(door.material, 'aoMapIntensity').min(0).max(10).step(0.01)
doordGui.add(door.material, 'displacementScale').min(0).max(1).step(0.01)

door.geometry.setAttribute(
  'uv2',
  new T.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// bushes
const bushesGeometry = new T.SphereGeometry(1, 16, 16)
const bushesMaterial = new T.MeshStandardMaterial({ color: 0x89c854 })

const bush1 = new T.Mesh(bushesGeometry, bushesMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new T.Mesh(bushesGeometry, bushesMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new T.Mesh(bushesGeometry, bushesMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new T.Mesh(bushesGeometry, bushesMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// graves
const graves = new T.Group()
scene.add(graves)
const graveGeometry = new T.BoxGeometry(0.6, 0.8, 0.1)
const graveMaterial = new T.MeshStandardMaterial({ color: 0xb2b6b1 })
const count = 100
for (let i = 0; i < count; i++) {
  const angle = Math.random() * Math.PI * 2
  const boxRadius =
    Math.sqrt(Math.pow(wallSize.width, 2) + Math.pow(wallSize.depth, 2)) / 2
  const planeRadius = 10
  const reduceRadius = planeRadius - boxRadius - 0.6
  const radius = boxRadius + Math.random() * reduceRadius
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const grave = new T.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.35, z)
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.castShadow = true
  graves.add(grave)
}

// door light
const doorLight = new T.PointLight(0xff7d46, 2, 7)
doorLight.position.set(0, 2.2, 2.9)
const doorLightHelper = new T.PointLightHelper(doorLight, 0.2)
const doorLightGui = gui.addFolder('门光源')
doorLightGui.add(doorLight, 'intensity', 0, 2, 0.1).name('光线强度')
doorLightGui.add(doorLight.position, 'y', 0, 4).step(0.1)
doorLightGui.add(doorLight.position, 'z', 0, 4).step(0.1)
doorLightHelper.visible = false
house.add(doorLight, doorLightHelper)

/**
 * Ghosts
 */
const ghost1 = new T.PointLight('#ff00ff', 3, 3)
ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
scene.add(ghost1)

const ghost2 = new T.PointLight('#00ffff', 3, 3)
ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
scene.add(ghost2)

const ghost3 = new T.PointLight('#ff7800', 3, 3)
ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
scene.add(ghost3)

/**
 * 创建一个平面
 */
const floor = new T.Mesh(
  new T.PlaneGeometry(20, 20),
  new T.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  }),
)
floor.geometry.setAttribute(
  'uv2',
  new T.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
)
floor.rotation.x = -Math.PI * 0.5

scene.add(floor)

const axesHelper = new T.AxesHelper(10)
scene.add(axesHelper)

/**
 * 环境光
 */
const ambientLight = new T.AmbientLight(0xb9d5ff, 0.13)
const ambientLightGui = gui.addFolder('环境光源')
ambientLightGui.add(ambientLight, 'intensity', 0, 2, 0.1).name('光线强度')
scene.add(ambientLight)

/**
 * 平行光源
 */
const moonLight = new T.DirectionalLight(0xb9d5ff, 0.13)
moonLight.position.set(2, 2, 2)
const directionalLightGui = gui.addFolder('平行光源')
directionalLightGui.add(moonLight, 'intensity').min(0).max(2).step(0.1).name('光线强度')
directionalLightGui.addColor(moonLight, 'color').name('光线颜色')
directionalLightGui.add(moonLight.position, 'x').min(-2).max(2).step(0.1)
directionalLightGui.add(moonLight.position, 'y').min(-2).max(2).step(0.1)
directionalLightGui.add(moonLight.position, 'z').min(-2).max(2).step(0.1)
const moonLightHelper = new T.DirectionalLightHelper(moonLight, 0.1)
moonLightHelper.visible = false
scene.add(moonLight, moonLightHelper)

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
  x: 0,
  y: 3,
  z: 5,
}
camera.position.set(position.x, position.y, position.z)

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
renderer.setClearColor(0x262837)

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = T.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 1024 / 4
doorLight.shadow.mapSize.height = 1024 / 4
doorLight.shadow.camera.far = 7

ghost1.castShadow = true
ghost1.shadow.mapSize.width = 1024 / 4
ghost1.shadow.mapSize.height = 1024 / 4
ghost1.shadow.camera.far = 7

ghost2.castShadow = true
ghost2.shadow.mapSize.width = 1024 / 4
ghost2.shadow.mapSize.height = 1024 / 4
ghost2.shadow.camera.far = 7

ghost3.castShadow = true
ghost3.shadow.mapSize.width = 1024 / 4
ghost3.shadow.mapSize.height = 1024 / 4
ghost3.shadow.camera.far = 7

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

moonLight.shadow.camera.top = 2
moonLight.shadow.camera.right = 2
moonLight.shadow.camera.bottom = -2
moonLight.shadow.camera.left = -2

// moonLight.shadow.radius = 20
const directionalLightCameraHelper = new T.CameraHelper(moonLight.shadow.camera)
directionalLightCameraHelper.visible = true
scene.add(directionalLightCameraHelper)

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
  // Ghosts animation
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = -elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = -elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
