// 实现扫雷程序的流程如下
// 1, 生成扫雷数据
// 2, 根据扫雷数据画图
// 3, 点击的时候根据情况判断

// 为了方便, 我们跳过第一步, 直接用下面给定的数据即可, 这样方便测试
// 假设写死的数据为
// let s = ' [[9,1,0,0,0,1,1,1,0],[1,1,0,0,1,2,9,1,0],[1,1,1,0,1,9,2,1,0],[1,9,2,1,1,1,1,0,0],[1,2,9,1,0,0,1,1,1],[1,2,1,1,0,1,2,9,1],[9,1,0,0,1,2,9,2,1],[1,2,1,1,1,9,2,1,0],[0,1,9,1,1,1,1,0,0]]'
// 可以发现这个数据实际上是 JSON 格式的字符串(这是非常常见的处理方式)
// 所以可以把字符串转成数组, 注意这是一个二维数组
// let square = JSON.parse(s)
//
//

//生成随机数字
const random01 = () => {
    let r = Math.random()
    return r > 0.9
}
//生成随机扫雷行
const randomLine09 = (n) => {
    let r = []
    for (let i = 0; i < n; i++) {
        if (random01()) {
            r.push(9)
        } else {
            r.push(0)
        }
    }
    return r
}

//生成随机扫雷方阵
const square1 = (n) => {
    let square = []
    for (let i = 0; i < n; i++) {
        let line = randomLine09(n)
        square.push(line)
    }
    return square
}

//克隆数组
const clonedSquare = (array) => {
    let s = []
    for (let i = 0; i < array.length; i++) {
        let line = array[i]
        let l = line.slice(0)
        s.push(l)
    }
    return s
}

const marker = (array, x, y) => {
    // 1. array[x][y] 不能是 9
    // x 和 y 符合条件, 比如不能越界
    let n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

//标记周围
const markAround = (array, x, y) => {
    if (array[x][y] === 9) {
        // 标记周围 8 个
        // 标记的时候需要判断是不是可以标记
        // 比如要标记左上角, 要判断 x > 0, y > 0
        // 这种判断很麻烦, 我们直接用函数来做
        // 具体的处理逻辑丢给函数

        // 先标记上边 3 个
        marker(array, x - 1, y - 1)
        marker(array, x - 1, y)
        marker(array, x - 1, y + 1)

        // 标记中间 2 个
        marker(array, x, y - 1)
        marker(array, x, y + 1)

        // 标记下边 3 个
        marker(array, x + 1, y - 1)
        marker(array, x + 1, y)
        marker(array, x + 1, y + 1)
    }
}

const markedSquare = (array) => {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    //这时的square已经标记完毕了
    return square
}
// 以我们这个数据(二维数组)为例, 网页布局实际上应该 9 * 9 的表格
// 最终完成的效果如下图所示
// | 9 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
// | 1 | 1 | 0 | 0 | 1 | 2 | 9 | 1 | 0 |
// | 1 | 1 | 1 | 0 | 1 | 9 | 2 | 1 | 0 |
// | 1 | 9 | 2 | 1 | 1 | 1 | 1 | 0 | 0 |
// | 1 | 2 | 9 | 1 | 0 | 0 | 1 | 1 | 1 |
// | 1 | 2 | 1 | 1 | 0 | 1 | 2 | 9 | 1 |
// | 9 | 1 | 0 | 0 | 1 | 2 | 9 | 2 | 1 |
// | 1 | 2 | 1 | 1 | 1 | 9 | 2 | 1 | 0 |
// | 0 | 1 | 9 | 1 | 1 | 1 | 1 | 0 | 0 |

// 接下来就是要在网页上画一个这样的表格
// 可以一次画一排, 这样画 9 排就可以完成一个完整的表格
// 比如第一排可以生成下面形式的 html 字符串
// 考虑到 float 布局比较方便, 所以直接用 float 来完成布局效果
// 所以在父元素上面增加了 clearfix class, 用来解决浮动的问题
// <div class="row clearfix">
//     <div class="cell">9</div>
//     <div class="cell">1</div>
//     <div class="cell">0</div>
//     <div class="cell">0</div>
//     <div class="cell">0</div>
//     <div class="cell">1</div>
//     <div class="cell">1</div>
//     <div class="cell">1</div>
//     <div class="cell">0</div>
// </div>

// 考虑到我们在展开格子的时候会计算周围 8 个的情况
// 所以最好把下标信息也放在标签里面存入
// 修改之后的 html 标签形式如下
// <div class="row clearfix">
//     <div class="cell" data-number="9" data-x="0" data-y="0">9</div>
//     <div class="cell" data-number="1" data-x="0" data-y="1">1</div>
//     <div class="cell" data-number="0" data-x="0" data-y="2">0</div>
//     <div class="cell" data-number="0" data-x="0" data-y="3">0</div>
//     <div class="cell" data-number="0" data-x="0" data-y="4">0</div>
//     <div class="cell" data-number="1" data-x="0" data-y="5">1</div>
//     <div class="cell" data-number="1" data-x="0" data-y="6">1</div>
//     <div class="cell" data-number="1" data-x="0" data-y="7">1</div>
//     <div class="cell" data-number="0" data-x="0" data-y="8">0</div>
// </div>

// 其中 data-number 是数字, 也就是翻出来之后的数字
// data-x 和 data-y 分别是数组中的下标
// 比如 data-x="0" data-y="3" 表示 square[0][3], 也就是第 1 行第 4 列的格子

//  接下来就可以实现相关的函数
// 1. templateCell 函数, 参数为数组 line 和变量 x
// line 是每一行的数组
// 比如第一行就是 | 9 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
// x 表示第几行
// 这个函数返回 line.length 个 cell 拼接的字符串
const templateCell = function(line, x) {
    let square = ''
    for (let i = 0; i < line.length; i++) {
        let _number = line[i]
        let t = ''
        if (_number !== 0 && _number !== 9 && _number !== 1 && _number !==2) {
            t = `<div class="cell" data-number="${_number}" data-x="${x}" data-y="${i}">${_number}</div>`
        } else if (_number === 9) {
            t = `<div class="cell" data-number="${_number}" data-x="${x}" data-y="${i}">
                    <div class="img-container">
                        <img class="icon" src="炸弹.png" alt="炸弹图片"/>
                    </div>
                 </div>`
        } else if (_number === 1) {
            t = `<div class="cell number1" data-number="${_number}" data-x="${x}" data-y="${i}">${_number}</div>`
        } else if (_number === 2) {
            t = `<div class="cell number2" data-number="${_number}" data-x="${x}" data-y="${i}">${_number}</div>`
        } else {
            t = `<div class="cell number2" data-number="${_number}" data-x="${x}" data-y="${i}"></div>`
        }
        square += t
    }
    return square
}

// 2. templateRow 的参数 square 是二维数组
// 用来表示雷相关的数据, 我们这里是直接写死的数据
// 返回 square.length 个 row 拼接的字符串
// row 的内容由 templateCell 函数生成
const templateRow = function(line, x) {
    let row = templateCell(line, x)
    return `<div class="row">${row}</div>`
}

// 3. square 是二维数组, 用来表示雷相关的数据
// 用 square 生成 9 * 9 的格子, 然后插入到页面中
// div container 是 <div id="id-div-mime"></div>
const renderSquare = function(square) {
    let container = document.querySelector('#id-div-mime')
    for (let i = 0; i < square.length; i++) {
        container.insertAdjacentHTML('beforeend', templateRow(square[i], i))
    }
}

// 4. 实现 bindEventDelegate 函数
// 用事件委托的形式在父元素上面绑定 click 事件, 只处理格子
// 也就是 .cell(即 class 包含 cell 字符串) 元素
// 如果点击的是 .cell 元素, 那么调用 vjkl 函数
// 注意, 我们在 bindEventDelegate 里面不处理具体的逻辑, 只调用函数
// 具体逻辑放在 vjkl 函数里面实现
const bindEventDelegate = function(square, n) {
    let container = document.querySelector('#id-div-mime')
    container.addEventListener('click', (event) => {
        let self = event.target
        let clickbody = self.closest('.cell')
        if (clickbody.classList.contains('cell')) {
            vjkl(clickbody, square, n)
        }
    })
}


// 5. vjkl 是点击格子后执行的函数, 我们需要把扫雷的逻辑写在这个函数中
// 要注意的是我们在初始情况下就把数字写到了 html 中
// <div class="cell" data-number="1" data-x="0" data-y="1">1</div>
// 而初始情况下数字不应该显示出来的, 可以直接用 font-size: 0; 来隐藏文字
// 点击的时候根据情况用 font-size: 14px; 的方式显示文字
// 当然这一步应该用 class 来完成, 比如 opened class 里面写 font-size: 14px;
// 点击的时候根据 class 来执行具体逻辑
// 如果已经显示过(也就是 class 包含 opened), 则不做任何处理
// 如果没有显示过(也就是 class 不包含 opened), 判断下列情况
// 1. 假设点击的是数字 9, 展开, 游戏结束
// 2. 假设点击的是数字 0
    // 此时需要展开 0 周围的一片, 通过调用 vjklAround 函数来完成
    // 也就是说依然把逻辑写在下一层函数 vjklAround 中
// 3. 假设点击的是其他数字, 展开
const vjkl = function(cell, square, n) {
    // 在这里遍历所有的未被打开的 cell (即没有添加 open 类的)
    // 如果没被打开的 cell 里面的 dataset.number 全都是 9，那么代表已经没有可以点的地方了，就可以宣告游戏胜利了
    if (cell.classList.contains('open')) {
        return false
    } else if (cell.dataset.number === '9') {
        cell.classList.add('open')
        let img = cell.querySelector('.icon')
        img.style.visibility = 'visible'
        alert('游戏结束')
        let allCell = document.querySelectorAll('.cell')
        for (let i = 0; i < allCell.length; i++) {
            let c = allCell[i]
            if (c.classList.contains('open') === false) {
                let img = c.querySelector('.icon')
                if (img) {
                    img.style.visibility = 'visible'
                }
                c.classList.add('open')
            }
        }
    } else if (cell.dataset.number === '0') {
        let x = cell.dataset.x
        let y = cell.dataset.y
        cell.classList.add('open')
        vjklAround(square, x, y, n)
    } else {
        cell.classList.add('open')
    }

}

// 6. vjklAround 展开周围 cell 周围 8 个元素,
// x 和 y 分别是下标
// 展开周围的元素通过调用 vjkl1 来解决
// 注意, 依然把逻辑放在下一层来处理
const vjklAround = function(square, x, y, n) {
    x = Number(x)
    y = Number(y)
    vjkl1(square, x - 1, y, n)
    vjkl1(square, x - 1, y - 1, n)
    vjkl1(square, x - 1, y + 1, n)
    vjkl1(square, x + 1, y, n)
    vjkl1(square, x + 1, y - 1, n)
    vjkl1(square, x + 1, y + 1, n)
    vjkl1(square, x, y - 1, n)
    vjkl1(square, x, y + 1, n)

}

// 7. vjkl1 是重点函数
// 如果满足边界调节, 则继续
    // 满足边界的意思是下标符合范围
// 因为 vjkl1 这个函数的作用是展开格子, 所以如果已经展开过, 那么就不展开元素
// 根据 x 和 y 还有属性选择器选择出格子, 具体可以参考
// https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors
// 比如想选中 data-x=3 的元素, 语法是 e('[data-x="3"]')
// 比如想同时选中 data-x=3 且 data-y=5 的元素, 语法是 e('[data-x="3"][data-y="5"]')
// 选择元素之后根据情况来判断
// 如果没有展开过, 继续判断下列情况
    // 如果碰到的是 9, 什么都不做.
        // 注意, 这里 9 的处理方式和直接点击格子 9 的处理方式不一样
        // 点击格子 9 也就是点击到雷, 直接结束游戏
        // 这里展开到 9 是指展开到边界情况
    // 如果碰到的是 0, 展开, 并且递归调用 vjklAround 函数
    // 如果碰到的是其他元素, 展开
const e = (selector) => {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `选择器 ${selector} 写错了, 请仔细检查并且复习三种基本的选择器`
        alert(s)
        //
        return null
    } else {
        return element
    }
}
const vjkl1 = function(square, x, y, n) {
    if (x > -1 && x < n && y > -1 && y < n) {
        let cell = e(`[data-x="${x}"][data-y="${y}"]`)
        if (cell.dataset.number === '0') {
            vjkl(cell, square, n)
        } else if (cell.dataset.number === '9') {

        } else {
            let num = cell.dataset.number
            if (num === '1') {
                cell.classList.add('number1')
            } else if (num === '2') {
                cell.classList.add('number2')
            }
            cell.classList.add('open')
        }
    }
}

const resetart = () => {
    let button = document.querySelector('#id-button-restart')
    button.addEventListener('click', () => {
        let container = document.querySelector('#id-div-mime')
        container.innerHTML = ''
        __main()
    })
}

const __main = () =>{
    let n = 10 // 这是 10 * 10 的扫雷方阵
    const s = square1(n)
    let square = markedSquare(s)
    // square 是一个二维数组
    renderSquare(square)
    bindEventDelegate(square, n)
    resetart()
}
__main()
