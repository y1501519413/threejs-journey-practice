import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Gui from 'lil-gui'

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

const sphereGeometry = new T.SphereGeometry(0.5, 16, 16)

const sphere1 = new T.Mesh(sphereGeometry, new T.MeshBasicMaterial({ color: 0xff0000 }))
sphere1.position.x = -2
sphere1.name = 'sphere1'

const sphere2 = new T.Mesh(sphereGeometry, new T.MeshBasicMaterial({ color: 0xff0000 }))
sphere2.position.y = 2
sphere2.name = 'sphere2'

const sphere3 = new T.Mesh(sphereGeometry, new T.MeshBasicMaterial({ color: 0xff0000 }))
sphere3.position.x = 2
sphere3.name = 'sphere3'

scene.add(sphere1, sphere2, sphere3)

let model = null
const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', gltf => {
  model = gltf.scene
  scene.add(gltf.scene)
})

/**
 * RayCaster
 */
const raycaster = new T.Raycaster()
const rayOrigin = new T.Vector3(-3, 0, 0)
const rayDirection = new T.Vector3(3, 0, 0)
rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)
// console.log('rayDirection', rayDirection.normalize().length())

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

/**
 * Mouse
 */
const mouse = new T.Vector2()
addEventListener('mousemove', e => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1
  mouse.y = -((e.clientY / sizes.height) * 2 - 1)
})

/**
 * Mouse Click
 */
addEventListener('click', e => {
  if (currenetIntersect) {
    console.log('click', currenetIntersect.object.name)
  }
})

const clock = new T.Clock()
let oldElapsedTime = null
let currenetIntersect = null
const render = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  sphere1.position.y = Math.sin(elapsedTime * 0.6) * 1.5
  sphere2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  sphere3.position.y = Math.sin(elapsedTime * 1.2) * 1.5

  raycaster.setFromCamera(mouse, camera)

  // cast a ray
  const objectsToTest = [sphere1, sphere2, sphere3]
  const intersects = raycaster.intersectObjects(objectsToTest)
  for (const intersect of intersects) {
    intersect.object.material.color.set(0x00ff00)
  }
  for (const object of objectsToTest) {
    if (!intersects.find(intersect => intersect.object === object)) {
      object.material.color.set(0xff0000)
    }
  }
  if (intersects.length) {
    if (currenetIntersect === null) {
      console.log('mouse enter')
    }
    currenetIntersect = intersects[0]
  } else {
    if (currenetIntersect !== null) {
      console.log('mouse leave')
      currenetIntersect = null
    }
  }
  if (model) {
    const intersectModels = raycaster.intersectObjects([model])
    if (intersectModels.length) {
      model.scale.set(1.1, 1.1, 1.1)
    } else {
      model.scale.set(1, 1, 1)
    }
    for (const intersectModel of intersectModels) {
      intersectModel.object.rotation.y += deltaTime
    }
  }

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
