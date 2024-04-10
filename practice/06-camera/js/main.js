import * as T from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 定义相机输出画布的尺寸
const width = 600
const height = 400
// cursor
const cursor = {
  x: 0,
  y: 0,
}
addEventListener('mousemove', e => {
  cursor.x = e.clientX / width - 0.5
  cursor.y = -(e.clientY / height - 0.5)
})

// 创建三维场景
const scene = new T.Scene()
// 创建几何结构“骨架”
const geometry = new T.BoxGeometry(1, 1, 1)
// 设置材质，“画皮”
const material = new T.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: false,
  opacity: 0.5,
  wireframe: true,
})

// 将结构和材料组合成网格模型
const mesh = new T.Mesh(geometry, material)
scene.add(mesh)

const axesHelper = new T.AxesHelper(3)
scene.add(axesHelper)

const aspectRatio = width / height
// 透视投影相机
let camera = new T.PerspectiveCamera(70, aspectRatio, 1, 2000)
// 设置相机的位置
camera.position.set(0, 0, 5)

// 正交相机

// camera = new T.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, -1, 1, -10, 10)

// 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
camera.lookAt(0, 0, 0)
const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
// 调整将输出canvas的大小
renderer.setSize(width, height)
const controls = new OrbitControls(camera, canvas)
// 设置阻尼顺滑效果
controls.enableDamping = true
// controls.target.y = 2
// controls.update()

// const clock = new T.Clock()
const render = () => {
  // 过去的时间
  // const elapsedTime = clock.getElapsedTime()
  // 每秒转90度
  // mesh.rotation.y = elapsedTime * Math.PI * 0.5
  // update camera position
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position)
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
