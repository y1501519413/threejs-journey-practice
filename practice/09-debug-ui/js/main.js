import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import Gui from 'lil-gui'

const gui = new Gui({
  width: 300,
  title: 'Debug UI',
  closeFolders: true,
})
gui.close()
addEventListener('keyup', e => {
  if (e.key === 'h') {
    gui.show(gui._hidden)
  }
})

// 定义相机输出画布的尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
// 创建三维场景
const scene = new T.Scene()
// 创建几何结构“骨架”
const geometry = new T.BoxGeometry(1, 1, 1)
// 设置材质，“画皮”
const debugObject = {
  width: 1,
  height: 1,
  depth: 1,
  widthSegments: 1,
  heightSegments: 1,
  depthSegments: 1,
  color: 0x00ffff,
}
const material = new T.MeshBasicMaterial({
  color: debugObject.color,
  transparent: false,
  opacity: 0.5,
  wireframe: true,
})
// 将结构和材料组合成网格模型
const mesh = new T.Mesh(geometry, material)
scene.add(mesh)

// add gui folder
const meshFolder = gui.addFolder('模型几何体')
// mesh.position
meshFolder.add(mesh.position, 'x', 0, 6, 0.1).name('x 座标')
meshFolder.add(mesh.position, 'y').min(0).max(6).step(0.2).name('y 座标')
meshFolder.add(mesh.position, 'z', 0, 6).step(0.3).name('z 座标')

const onGeometryChange = () => {
  mesh.geometry.dispose()
  mesh.geometry = new T.BoxGeometry(
    debugObject.width,
    debugObject.height,
    debugObject.depth,
    debugObject.widthSegments,
    debugObject.heightSegments,
    debugObject.depthSegments,
  )
}
meshFolder
  .add(debugObject, 'width', 1, 6, 1)
  .name('宽度')
  .onFinishChange(onGeometryChange)
meshFolder
  .add(debugObject, 'height', 1, 6, 1)
  .name('高度')
  .onFinishChange(onGeometryChange)
meshFolder
  .add(debugObject, 'depth', 1, 6, 1)
  .name('深度')
  .onFinishChange(onGeometryChange)
meshFolder
  .add(debugObject, 'widthSegments', 1, 6, 1)
  .name('宽度分段')
  .onFinishChange(onGeometryChange)
meshFolder
  .add(debugObject, 'heightSegments', 1, 6, 1)
  .name('高度分段')
  .onFinishChange(onGeometryChange)
meshFolder
  .add(debugObject, 'depthSegments', 1, 6, 1)
  .name('深度分段')
  .onFinishChange(onGeometryChange)

// mesh.material.color
// meshFolder
//   .addColor(mesh.material, 'color')
//   .name('color')
//   .onChange(e => {
//     console.log('getHex', e.getHex())
//   })
meshFolder
  .addColor(debugObject, 'color')
  .name('debugObject.color')
  .onChange(e => {
    // console.log('e', e)
    // console.log('getStyle', e.getStyle())
    // console.log('getHex', e.getHex())
    // console.log('getHexString', e.getHexString())
    mesh.material.color.setHex(e)
  })
  .name('颜色')
// mesh.visible
meshFolder.add(mesh, 'visible').name('可见性')
meshFolder
  .add(mesh.material, 'wireframe')
  .onChange(e => {
    console.log('e', e)
  })
  .name('线框模式')
// add animation
debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}
meshFolder.add(debugObject, 'spin').name('旋转模型')

const axesHelper = new T.AxesHelper(3)
scene.add(axesHelper)

const aspectRatio = sizes.width / sizes.height
// 透视投影相机
let camera = new T.PerspectiveCamera(20, aspectRatio, 1, 2000)
// 设置相机的位置
camera.position.set(5, 5, 5)

// 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
camera.lookAt(0, 0, 0)
const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
  // antialias: true,
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

addEventListener('dblclick2', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

const render = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
