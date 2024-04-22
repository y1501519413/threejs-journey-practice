import path from 'path'
const currentClass = '15-shadows'
export default {
  root: `practice/${currentClass}/`,
  publicDir: path.resolve('static'),
  base: './',
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: path.resolve('dist'),
    emptyOutDir: true,
    sourcemap: true,
  },
}
