//  注意:
// GitHub Desktop内置了本地repository路径和项目的映射关系
// 本地文件夹名称可以修改, 但要重新locate


// 规范
const {
    keyboard,
    sentences,
    screen,
    trash_bin,
    output,
    input_sentence
} = global

// 模拟按键后闪烁
const twinkle = ({
    style
}) => {
    style.filter = 'invert(100%)'
    // js修改元素的内联样式, 优先级最高,所以临时用完后果断删除
    setTimeout(() => {
        style.filter = ''
        // ele.style=''
    }, 100);
}

// 按虚拟键盘
const clickKey = char => {
    const num = keyboard.querySelector(`#key_${char}`)
    twinkle(num)
    num.click()
}

// keycode和keychar的映射表
const key_codes = [74, 75, 76, 85, 73, 79, 13, 8]
const key_chars = [1, 2, 3, 4, 5, 6, 'eq', 'del']

// mac上的delete居然是backspace

document.addEventListener('keydown', ({
    keyCode
}) => {
    // console.log(keyCode)
    // 小键盘的数字键(0~9)
    if (keyCode >= 48 && keyCode <= 57) {
        clickKey(keyCode - 48)
    } else if (key_codes.indexOf(keyCode) !== -1) {
        //非数字按键
        clickKey(key_chars[key_codes.indexOf(keyCode)])
    } else // 非虚拟键盘键
        switch (keyCode) {
            case 38:
                if (sentences.length === 0) break
                output.removeChild(sentences[sentences.length - 1])
                trash_bin.push(sentences.pop())
                trashShowFirst()
                break
            case 40:
                if (trash_bin.length === 0) break
                sentences.push(trash_bin.pop())
                output.appendChild(sentences[sentences.length - 1])
                // screen.insertBefore(sentences[sentences.length - 1], screen.lastElementChild)
                trashShowFirst()
                break
            default:
                break
        }

})

// 将trash_bin中第一个sentence的结果显示在input_sentence
function trashShowFirst() {
    global['fontSize'] = 19
    global['script'] = []
    input_sentence.innerHTML = ''
    if (trash_bin.length > 0) {
        const resultText = trash_bin[trash_bin.length - 1].lastChild.childNodes[0].nodeValue
        const span = document.createElement('span')
        span.innerHTML = resultText
        span.style.fontSize = `${fontSize}px`
        script.push(resultText)
        input_sentence.appendChild(span)
    }
}