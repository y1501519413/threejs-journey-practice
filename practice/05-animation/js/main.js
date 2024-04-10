import * as T from 'three'
import gsap from 'gsap'

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

const axesHelper = new T.AxesHelper(500)
scene.add(axesHelper)

// 定义相机输出画布的尺寸
const width = window.innerWidth
const height = window.innerHeight
// 创建一个透视投影相机对象
const camera = new T.PerspectiveCamera(60, width / height, 1, 2000)
// 设置相机的位置
camera.position.set(0, 0, 5)
// 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
camera.lookAt(0, 0, 0)
const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
// 调整将输出canvas的大小
renderer.setSize(width, height)
// time
let time = Date.now()
const clock = new T.Clock()

gsap.to(mesh.position, {
  x: 2,
  y: 2,
  duration: 2,
  delay: 1,
})

const render = () => {
  // const currentTime = Date.now()
  // const deltaTime = currentTime - time
  // time = currentTime
  // mesh.rotateX(0.001 * deltaTime)
  // mesh.rotateY(0.001 * deltaTime)

  // const elapsedTime = clock.getElapsedTime()
  // console.log('elapsedTime', elapsedTime)
  // mesh.rotateX(elapsedTime)
  // mesh.rotateY(elapsedTime)
  // mesh.rotation.y = elapsedTime * Math.PI * 0.5
  // mesh.position.y = Math.sin(elapsedTime)
  // mesh.position.x = Math.cos(elapsedTime)
  // console.log('mesh.position.y', mesh.position.y)
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
