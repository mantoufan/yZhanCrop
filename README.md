# yZhanCrop
Crop images by dragging, zooming, and rotating them.  
通过拖动、缩放和旋转矩形框裁剪图片
# Demo 演示
[Github Page](https://mantoufan.github.io/yZhanCrop/dist/)
# Feature 特点
Consistent with Photoshop experience ^_^
- 自适应画布 + 预览 + 生成最适合尺寸裁剪结果
- 多图层 + 根据对象自动选择图层
- 与 PhotoShop 交互一致的拖动、缩放、旋转体验
# Cmd 命令
Run 运行
```shell
npm start
```
Build 编译
```shell
npm run dev // dev-env 开发环境
npm run build // production-env 生产环境
```
StandardJS Fix + Unit Test 风格检查和自动更正 + 单元测试
```
npm test
```
# Setup 安装
## Node.js
Install
```shell
npm i yzhancrop -D
```
Import
```javascript
import YZhanCrop from 'yzhancrop'
```
## Browser 浏览器
```javascript
<script src="https://cdn.jsdelivr.net/npm/yzhancrop@1.0.1/dist/yzhancrop.min.js"></script>
```
# How to Use 如何使用
## Add an Image 加载图片
```javascript
// Select a canvas DOM
const canvas = doucument.getElementById('canvas')
// Instantiate
const yZhanCrop = YZhanCrop({ canvas })
// Add an Image
yZhanCrop.add({
  src,
  x,
  y,
  width,
  height,
  angle
})
```
## Get iamge list 获取图像列表
```javascript
// Find all Images
const { layers } = yZhanCrop
const { list } = layers
```
## Preview crop result 预览裁剪结果
```javascript
// Preview last img on canvas named preview
list[list.length - 1].preview({ canvas: preview })
```
## Select image on Layer 选择图像所在图层
```javascript
// Do something else interesting using utils
const utils = yZhanCrop.utils()
// Select the last Image
layers.select(list[list.length - 1])
```

## Display tansform box 显示控制点变形框
```javascript
// Display transform box of the last Image
utils.point.select(list[list.length - 1])
```
# Todo 待办事项
- 热更新
  - 遇到问题：`webpack-dev-server` 打包结果与 `webpack` 不一致，`class` 模块被当作对象而不是函数导出
- 注释：JSDoc 注释
- 研究方向
  - 图片缩放质量控制及算法
  - 多边形交并集，参考 `polygon-cliping`

# Tech Doc 技术说明
## CSS 
- 模块化思想：BEM 
- 书写顺序: 位置 → 大小 → 绘制 → 其它
- CSS 2.1+ 新属性
  - 清除浮动 `display: flow-root`
  - 网格布局 `display: grid`

## JS
- 规范：StandardJS
- 模块化：umd，基于 webpack 打包
- ES：ES6+ 书写，Babel 编译到 ES5
- 设计模式：
  - 单例模式：`utils` 实用工具集
  - 工厂模式：`classes` 类库
  - 事件订阅发布模式：`eventbus`
## 方法
- 图层
  - 顺序遍历数组，最后一项最后被渲染
  - 选中哪层，就把哪层放到数组最后一项
- 转换
  - 旋转前坐标与旋转后坐标互换
    - 规定只操作旋转前坐标
    - 旋转后坐标变化时，转换成旋转前坐标再操作
- 位置
  - 点是否在多边形
    - 鼠标指针样式、旋转角度随位置变化
    - 判断当前点的选中图层
  - 点在线的左侧、上面或右侧
- 移动
  - 使用 `requestAnimationFrame` 节流，下同
- 缩放
  - 参考函数柯里化思想
    - 固定部分参数，返回接受可变参数函数
  - 参考声明式编程思想
    - 配置式声明不同控制点的差异
- 旋转
  - 旋转角度数值（参考第三方）
  - 旋转方向判断：点在旋转中轴线的左侧、上面或右侧（参考第三方）
- 裁剪
  - 裁剪
    - `canvas.context.clip` 先画矩形，再画图片（本次采用）
    - 多个 `canvas` 混合模式
    - `poly-intersection` 传入两组二维数组，返回交集数组，`Turf.js` 地图常用方案
  - 预览
    - 新的 canvas 渲染裁剪结果，并新建 A 标签实现导出

# Summary 总结
## Webpack 配置
- 面向应用类
- 面向库类
  - 对于库及其演示，可以一起打包吗？
## 异步编程
仍然习惯回调函数
- 不习惯 async 和 await 的传染特性
  - 一个函数用，使用它的函数也要用
- 除事件订阅发布外，一定有其它不传回调函数的方法
## 过早抽象
将矩形抽象为四个坐标的二维数组
- 试图将移动、缩放、旋转都变成 二维数组的变换问题
- 裁剪抽象成二维数组的交集
  - 矩阵，向量？突出二维数组，凹陷二维数组？
## 设计模式边界
什么时候用 class，什么时候用 Object 或 Function 对象？
- 如果从一开始就考虑：用户会在同一个网页，多次实例化我的 class
  - 本次的 `utils/point.js` 限制了库在同一网页的重复使用，比如用户需要在4张画布同时选择4张图片
- 单例模式，可能会带来不同 class 间不符合预期的数据共享
  - 显然，其它3张画布，并不关心第4张画布选择的是什么
- 所以，单例模式适合
  - 全局数据共享、通信
    - 而且放入全局比传递它们更适合
  - 完全解耦合的逻辑，无副作用的函数
          
感谢提供机会，2天时间编码，有很大启发和帮助，非常感谢！