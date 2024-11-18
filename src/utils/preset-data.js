// Element Plus 电池进度条颜色梯度
const batteryLevelColors  = [
    { color: '#f56c6c', percentage: 30 },
    { color: '#e6a23c', percentage: 50 },
    { color: '#5cb87a', percentage: 70 },
    { color: '#106b1b', percentage: 100 },
]

// 定义级联选择器的属性
const cascaderProps = {
    multiple: true,
    value: 'value', // 选项的值字段
    label: 'label', // 选项的标签字段
    children: 'children' // 子级字段
}


export {
    batteryLevelColors,
    cascaderProps,
}