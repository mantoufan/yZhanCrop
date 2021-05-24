# yzhanCrop
Crop images by dragging, zooming, and rotating them.
# Demo
[Github Page](https://mantoufan.github.io/yZhanCrop/dist/)
# Cmd
Run
```shell
npm start
```
Build
```shell
npm run dev // dev-env
npm run build // production-env
```
Unit Test (UnFinished)
```
npm test
```
# How to Use
```javascirpt
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
// Do something else interesting using utils
const utils = yZhanCrop.utils()
// Find all Images
const { layers } = yZhanCrop
const { list } = layers
// Select the last Image
layers.select(list[list.length - 1])
// Display transform box of the last Image
utils.point.select(list[list.length - 1])
```

# 说明
1. 未解决问题
- 热更新
  - 使用 `umd` 模块化打包
    - 预期：`webpack-dev-server` 打包到内存，热更新
    - 实际：
      - `webpack-dev-server` 打包结果与 `webpack` 不一致，`class` 模块被当作对象而不是函数导出
      - 暂时用 `http-server` 仅预览
- 预览图位置
  - 预期：预览图居中显示，自适应缩放
  - 实际：宽高为裁剪矩形的对角线长 * 1.5，固定数值
- 预览图裁剪效果
  - 预期：预览图与矩形和图片叠加区域吻合
  - 实际：图片较大时，区域存在较大偏移
- 没有注释
  - 预期：JSDoc 注释，自动生成文档
  - 实际：2天时间赶进度，几何生疏，面向搜索编程耗时过多

2. 方向
- 单元测试
- 图片缩放质量控制
- 多边形交集并集，参考
  - `polygon-cliping`

3. 技术点
- CSS 
  - 部分实践 BEM 
  - 使用新属性
    - 清除浮动 `display: flow-root`
    - 网格布局 `display: grid`
  - 书写顺序参考 位置 → 大小 → 绘制 → 其它 
- JS
  - ES6+ 编写，ES5 兼容（仅配置，未调试）
  - Utils 实用工具集，使用 单例模式
  - Classes，使用 工厂模式
  - eventbus，事件订阅发布模式
- 方法
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
    - `requestAnimationFrame` 节流可能更好
      - 节流函数本身有消耗，本例计算不复杂
      - 实测 Fps 和 内存占用无明显优化，故未加节流
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

  # 总结
  - `webpack` 配置
    - 面向应用类
    - 面向库类
      - 对于库及其演示，可以一起打包吗？
  - 异步编程
    - 仍然习惯回调函数
       - 不习惯 async 和 await 的传染特性
         - 一个函数用，使用它的函数也要用
       - 除事件订阅发布外，一定有其它不传回调函数的方法
  - 过早抽象
    - 将矩形抽象为四个坐标的二维数组
      - 试图将移动、缩放、旋转都变成 二维数组的变换问题
      - 裁剪抽象成二维数组的交集
        - 矩阵，向量？突出二维数组，凹陷二维数组？
  - 设计模式边界
    - 什么时候用 class，什么时候用 Object 或 Function 对象？
     - 如果从一开始就考虑
       - 用户会在同一个网页，多次实例化我的 class
          - 本次的 `utils/point.js` 限制了库在同一网页的重复使用，比如用户需要在4张画布同时选择4张图片
       - 单例模式，可能会带来不同 class 间不符合预期的数据共享
          - 显然，其它3张画布，并不关心第4张画布选择的是什么
       - 所以，单例模式适合
          - 全局数据共享、通信
            - 而且放入全局比传递它们更适合
          - 完全解耦合的逻辑，无副作用的函数
          
  感谢提供机会，2天时间的编码，对我有很大启发和帮助，非常感谢！