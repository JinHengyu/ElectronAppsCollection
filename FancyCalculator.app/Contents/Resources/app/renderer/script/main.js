// JS中分号可以淘汰了么(￣.￣)

// 模块化编程的习惯
(function init() {
    global['keyboard'] = document.querySelector('#keyboard')

    global['basic'] = document.querySelector('#basic')
    global['advanced'] = document.querySelector('#advanced')
    global['output'] = document.querySelector('#output')
    // 屏幕中的输入框最左边的一个`>`标识符
    global['cursor'] = document.querySelector('#cursor')
    global['script'] = []; //存放内部待eval表达式
    global['fontSize'] = 19; //全局瞬时的字体大小
    // 之前与global.history重名..
    global['sentences'] = [];
    global['trash_bin'] = [];
    global['input_sentence'] = document.querySelector('#input div')

})()

// 常规的符号后缀
function append(symbol, realSymbol) {
    let span = document.createElement('span')
    span.innerHTML = symbol;
    span.style.fontSize = `${fontSize}px`
    input_sentence.appendChild(span);
    script.push(realSymbol ? realSymbol : symbol)
}
// 数学函数
function fn(name, realName) {
    wrap();
    let span = document.createElement('span')
    span.innerHTML = name;
    span.style.fontSize = `${fontSize}px`
    input_sentence.insertBefore(span, input_sentence.childNodes[0])
    script.unshift(realName ? realName : name)
}
// 删除键
function del() {
    // let list = screen.lastElementChild.children;
    if (script.length > 0) {
        input_sentence.lastElementChild.remove()
        // list[list.length - 1].remove();
        script.pop();
    }
}

// 被圆括号包围
function wrap() {
    fontSize += 3;
    let left = document.createElement('span');
    left.innerHTML = '[';
    left.style.fontSize = `${fontSize}px`;
    let right = document.createElement('span');
    right.innerHTML = ']';
    right.style.fontSize = `${fontSize}px`;
    input_sentence.insertBefore(left, input_sentence.childNodes[0]);
    input_sentence.appendChild(right);
    // script = '(' + script + ')'
    script.unshift('(') //返回数组的长度
    script.push(')')
}
// 计算结果并以某一进制显示
function calculate(mode = 10) {
    if (!script.length) return;
    // let sentence = screen.querySelector('div:last-child');
    let result = document.createElement('span')
    let equal = document.createElement('span')
    equal.innerHTML = ` = `
    equal.style.fontSize = `${fontSize}px`
    result.style.fontSize = `${fontSize}px`
    result.style.color = 'lime'
    try {
        result.innerHTML = eval(script.join('')).toString(mode)
        if (mode !== 10) {
            const sub = document.createElement('sub')
            sub.innerHTML = mode;
            result.appendChild(sub)
        }
    } catch (err) {
        // 表达式输入错误
        result.innerHTML = `ERROR`
        result.style.color = 'red'
    } finally {
        input_sentence.appendChild(equal); //' = '
        input_sentence.appendChild(result);
        // 深度拷贝(递归)
        sentences.push(output.appendChild(input_sentence.cloneNode(true)))
        input_sentence.innerHTML = ''
        // cursor会从原来挂载的地方断开,然后挂到新的地方
        // screen.appendChild(ele).appendChild(cursor)
        script = []
        fontSize = 19;
        // trash_bin = []   // 无法给常量(引用类型)赋值..
        trash_bin.length = 0    // 倾倒垃圾桶
    }
}
// 模式切换(目前两种模式)
require('electron').ipcRenderer.on('changeTo', (event, arg) => {
    if (arg === 'basic') {
        basic.style.width = '100%'
        document.title = 'Fancy Calc ( Basic Mode )'
        advanced.style.left = '-50%'
    } else if (arg === 'advanced') {
        advanced.style.left = '0'
        basic.style.width = '50%'
        document.title = 'Fancy Calc ( Advanced Mode )'
    }
})