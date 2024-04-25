import * as T from 'three'
import gsap from 'gsap'
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
 * 纹理加载器
 */
const textureloader = new T.TextureLoader()
const gradient3 = textureloader.load('/textures/gradients/3.jpg')
const gradient5 = textureloader.load('/textures/gradients/5.jpg')
gradient3.magFilter = T.NearestFilter
gradient5.magFilter = T.NearestFilter

const guiParams = {
  close: () => {
    gui.close()
  },
  color: '#ffeded',
}

/**
 * Scene
 */
const scene = new T.Scene()

const material = new T.MeshToonMaterial({
  color: guiParams.color,
  gradientMap: gradient5,
})

const objectsDistance = 4
/**
 * Mesh1
 */
const mesh1 = new T.Mesh(new T.TorusGeometry(1, 0.4, 16, 60), material)

/**
 * Mesh2
 */
const mesh2 = new T.Mesh(new T.ConeGeometry(1, 2, 32), material)

/**
 * Mesh3
 */
const mesh3 = new T.Mesh(new T.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2

scene.add(mesh1, mesh2, mesh3)
const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
const count = 10 * 1000
const particleGeometry = new T.BufferGeometry()
const positions = new Float32Array(count * 3)
for (let i = 0; i < count; i++) {
  const i3 = i * 3
  positions[i3] = (Math.random() - 0.5) * 10
  positions[i3 + 1] =
    objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
  positions[i3 + 2] = (Math.random() - 0.5) * 10
}
particleGeometry.setAttribute('position', new T.BufferAttribute(positions, 3))
const particleMaterial = new T.PointsMaterial({
  size: 0.03,
  sizeAttenuation: true,
  // color: 0xff0000,
  depthWrite: false,
  blending: T.AdditiveBlending,
})
const points = new T.Points(particleGeometry, particleMaterial)
scene.add(points)
gui.add(guiParams, 'close').name('关闭调试器')
gui
  .addColor(guiParams, 'color')
  .name('材料颜色')
  .onChange(e => {
    material.color.set(e)
    points.material.color.set(e)
  })

/**
 * 平行光
 */
const directionalLight = new T.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

const axesHelper = new T.AxesHelper(10)
axesHelper.visible = false
scene.add(axesHelper)

/**
 * 透视投影相机
 */
const camera = new T.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
const perspectiveCameraHelper = new T.CameraHelper(camera)
perspectiveCameraHelper.visible = false
scene.add(perspectiveCameraHelper)

/**
 * 相机组
 */
const cameraGroup = new T.Group()
scene.add(cameraGroup)
cameraGroup.add(camera)

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

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)
  if (currentSection !== newSection) {
    currentSection = newSection
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5',
    })
  }
})

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
}
addEventListener('mousemove', e => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})

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
let previousTime = 0

const render = () => {
  const elapsedTime = clock.getElapsedTime()
  // 基于帧率渲染，兼容不同设备
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12
  }

  camera.position.y = (-scrollY / sizes.height) * objectsDistance
  const parallaxX = cursor.x
  const parallaxY = -cursor.y
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 3 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 3 * deltaTime

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
