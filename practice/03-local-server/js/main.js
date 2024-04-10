import * as T from 'three'
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

// 定义相机输出画布的尺寸
const width = 800
const height = 600
// 创建一个透视投影相机对象
const camera = new T.PerspectiveCamera(60, width / height, 0.01, 2000)
// 设置相机的位置
camera.position.set(250, 250, 250)
// 相机的视线，观察目标点的坐标，受限于动画渲染，需要随时改变观察角度
camera.lookAt(0, 0, 0)

const canvas = document.getElementById('canvas')
const renderer = new T.WebGLRenderer({
  canvas,
})
// 调整将输出canvas的大小
renderer.setSize(width, height)

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
