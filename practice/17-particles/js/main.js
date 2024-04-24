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
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
/**
 * 纹理加载器
 */
const textureloader = new T.TextureLoader()
const particleTexture1 = textureloader.load('/textures/particles/1.png')
const particleTexture2 = textureloader.load('/textures/particles/2.png')

/**
 * Scene
 */
const scene = new T.Scene()

const cube = new T.Mesh(
  new T.BoxGeometry(1, 1, 1),
  new T.MeshBasicMaterial({ color: 0xffffff }),
)
// scene.add(cube)

/**
 * ParticleGeometry
 */
// const particleGeometry = new T.SphereGeometry(1, 20, 20)
const count = 50000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}
const particleGeometry = new T.BufferGeometry()
particleGeometry.setAttribute('position', new T.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new T.BufferAttribute(colors, 3))

/**
 * Point Materials
 */
const pointMaterials = new T.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: 0xff88cc,
  // map: particleTexture2,
  transparent: true,
  alphaMap: particleTexture2,
  // alphaTest: 0.001,
  // 深度缓存区测试，会与其他模型有渲染bug
  // depthTest: false,
  // 停用深度缓存区写入
  depthWrite: false,
  // 粒子重叠区域高亮
  blending: T.AdditiveBlending,
  vertexColors: true,
})

/**
 * Particles
 */
const particles = new T.Points(particleGeometry, pointMaterials)

scene.add(particles)

const axesHelper = new T.AxesHelper(10)
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
  x: 0,
  y: 2,
  z: 3,
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
  // particles.rotation.y = elapsedTime * 0.1
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particleGeometry.attributes.position.array[i3]
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }
  particleGeometry.attributes.position.needsUpdate = true
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
