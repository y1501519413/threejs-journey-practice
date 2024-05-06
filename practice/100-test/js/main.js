import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new T.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new T.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

/**
 * Materials
 */
const plane = new T.Mesh(
  new T.PlaneGeometry(5, 5),
  new T.MeshStandardMaterial({
    roughness: 0.7,
  }),
)
// const result = Object.getOwnPropertyDescriptor(plane, 'quaternion')
// console.log('result', result)
// console.log('plane', plane)
// plane.quaternion = new T.Quaternion(-1, 0, 0)
// plane.rotation.x = -Math.PI * 0.5
// plane.rotateX(-Math.PI / 2)
// plane.setRotationFromAxisAngle(new T.Vector3(1, 0, 0), -Math.PI / 2)
// plane.setRotationFromAxisAngle(new T.Vector3(-1, 0, 0), Math.PI / 2)
console.log('plane.quaternion', plane.quaternion)
scene.add(plane)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new T.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 4
camera.position.z = 4
scene.add(camera)

const axesHelper = new T.AxesHelper(100)
scene.add(axesHelper)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new T.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = false
renderer.shadowMap.type = T.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new T.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
