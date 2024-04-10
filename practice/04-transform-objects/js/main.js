import * as T from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 创建三维场景
const scene = new T.Scene()
// 创建几何结构“骨架”
const geometry = new T.BoxGeometry(100, 100, 100)
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
// mesh.position.x = 50
// mesh.position.y = 50
// mesh.position.z = 50
mesh.position.set(10, 10, 10)
// mesh.position.normalize()
// console.log('mesh.position', mesh.position.length())

// mesh.scale.x = 2
// mesh.scale.y = 2
// mesh.scale.z = 2
// mesh.scale.set(2, 2, 2)

mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI / 4
mesh.rotation.y = Math.PI / 4
// mesh.rotation.z = Math.PI / 4
// mesh.rotateX(Math.PI / 4)
// mesh.rotateY(Math.PI / 4)
// mesh.rotateZ(Math.PI / 4)
// mesh.rotation.set(Math.PI / 4, Math.PI / 4, Math.PI / 4)

const axesHelper = new T.AxesHelper(500)
scene.add(axesHelper)
const axesMeshHelper = new T.AxesHelper(200)
mesh.add(axesMeshHelper)

// 定义相机输出画布的尺寸
const width = window.innerWidth
const height = window.innerHeight
// 创建一个透视投影相机对象
const camera = new T.PerspectiveCamera(60, width / height, 1, 2000)
// 设置相机的位置
camera.position.set(350, 250, 250)
// 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
camera.lookAt(mesh.position)
console.log('mesh distanceTo camera', mesh.position.distanceTo(camera.position))
const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
// 调整将输出canvas的大小
renderer.setSize(width, height)
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.update()

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
