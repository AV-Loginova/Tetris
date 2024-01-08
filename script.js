//создаем массив с фигурами тетриса
const figures = [
    [
        [0,1,0,0], 
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ], 
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1]
    ]
];
//создаем массив с цветом фона и цветами фигур
const colors = ['#1b1b1b', '#529bd7', '#805ee2', '#fe4dc4', '#ff6715', '#ffd216', '#ff4b4b', '#4bffd9', '#fe4dc4'];
//количество рядов и колонок
const rows = 15;
const cols = 10;
//задаем переменную для полотна
let board = document.querySelector('.board');
let ctx = board.getContext('2d');
let count = 1;
let levelNum = 0;
let score = 0;
let time  = 1000;
let points = document.querySelector('.points');
let level = document.querySelector('.level');
const rule = document.querySelector('.rule');
const game = document.querySelector('.game');
//по умолчанию фигур нет
let blockObj = null;
let grid = generateGrid();

//задаем размер блока
ctx.scale(30, 30)

//создаем функцию, которая создает рандомные фигуры
function randomBlock() {
   let ran = Math.floor(Math.random() * 7);
   //блок  - рандомная фигура из массива с фигруами
   let block = figures[ran];
   let colorIndex = ran + 1;
   //появляются фигуры на 4 клетке по оси икс
   let x = 4;
   let y = 0;
   return {block, x, y, colorIndex}
}

//создаем функцию, которая отрисовывает фигуры
function newGame() {
    //создаем условие для ускорения движения фигур и увеличения уровня
    if(count % 5 == 0) {
        t = t - 100;
        count = 1;
        levelNum++
        level.textContent = levelNum;
    }
    checkGrid()
    if(blockObj == null) {
        //сначала выбираем рандомную фигуру, потом отрисовываем ее
        blockObj = randomBlock();
        renderBlock()
    }
    //двигаем фигуру вниз
    moveDown()
    setTimeout(newGame, t)
}

//функция, стирающая заполненные линии
function checkGrid() {
    //проверяем заполнена ли линияя
    for(let i = 0; i < grid.length; i++) {
        let line = true;
        for(let j = 0;j < grid[i].length; j++) {
            if(grid[i][j] == 0) {
                line = false;
            }
        }
        if(line) {
            //удаляет все значения 1, то есть блоки
            grid.splice(i, 1)
            //добавляет новый пустой ряд в начало доски
            grid.unshift([0,0,0,0,0,0,0,0,0,0])
            count++
            score++
            points.textContent = score * 10;
        }
    }
}

//функция отрисовывающая фигуры
function renderBlock() {
    let block = blockObj.block;
    //все элементы массива с индексом i - положение по оси y
    for(let i = 0; i < block.length; i++) {
        //все элементы массива с индексом j - положение по оси x
        for(let j = 0; j < block[i].length; j++) {
            if(block[i][j] == 1) {
                //мы заполняем блоки цветом и указываем их положение на полотне
                ctx.fillStyle = colors[blockObj.colorIndex];   
                ctx.fillRect(blockObj.x + j, blockObj.y + i, 1, 1)   
                ctx.strokeStyle = '#1b1b1b';
                ctx.lineWidth = 0.05;
                ctx.strokeRect(blockObj.x + j, blockObj.y + i, 1, 1)
            }
        }
    }
}

//функция которая оставляет после себя пустые клетки черного цвета
function generateGrid () {
    //создаем пустой массив 
    let grid = [];
    //запускаем цикл пока i < чем количество рядов и колонок 
    for(let i = 0; i < rows; i++) {
        grid.push([])
        for (let j = 0; j < cols; j++) {
            //в массив добавляем нули
            grid[i].push(0)
        }
    }
    return grid
}

//функция, которая отрисовывает гриды
function renderGrid () {
    for(let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            //задается цвет и положение
            ctx.fillStyle = colors[grid[i][j]];
            ctx.fillRect(j, i, 1, 1)
            ctx.strokeStyle = '#1b1b1b';
            ctx.lineWidth = 0.05;
            ctx.strokeRect(j, i, 1, 1)
        }
    }
    //генерируется новая фигура
    renderBlock()
}

//событие по нажатию клавиши
document.addEventListener("keydown", function(evt) {
    let key = evt.code;
    if(key == 'ArrowDown') {
        moveDown()
    } else if(key == 'ArrowLeft') {
        moveLeft()
    } else if(key == 'ArrowRight') {
        moveRight()
    } else if(key == 'ArrowUp') {
        rotate()
    }
})


//функция, которая опускает вниз элементы
function moveDown() {
    //обработка несуществующего объекта
    if (blockObj == null) {
        return
    }
    //если это не граница доски
    if(!border(blockObj.x, blockObj.y + 1)) {
        //двигаем фигуру вниз по оси y
        blockObj.y += 1;
        //отрисовываем ее заново на новом месте
        renderGrid()
    } else {
        //если это граница, запускаем цикл
        for(let i = 0; i < blockObj.block.length; i++) {
            for(let j = 0; j < blockObj.block[i].length; j++) {
                //оставляем элемент в конце доски и отрисовываем его
               if(blockObj.block[i][j] == 1) {
                let p = blockObj.x + j;
                let q = blockObj.y + i;
                grid[q][p] = blockObj.colorIndex;
               } 
            }
        }
        if(blockObj.y == 0) {
            alert(`Game over! Your score is ${points.textContent} points.`)
            location. reload()
        }
        //фигура перестает быть активной, создаем следующую
        blockObj = null;
    }
}

//функция, двигающая фигуру влево 
function moveLeft() {
    if(!border(blockObj.x - 1, blockObj.y)) {
        blockObj.x += -1;
    }
    renderGrid()
}

//функция, двигающая фигуру вправо 
function moveRight() {
    if(!border(blockObj.x + 1, blockObj.y)) {
        blockObj.x += 1;
        renderGrid()
    }
}

//функция вращающая фигуру
function rotate() {
    //создаем пустой массив для повернутой фигуры
    let rotateBlock = [];
    //переменная для фигуры
    let block = blockObj.block;
    //сначала заполняем новый массив нулями
    for(let i = 0; i < block.length; i++) {
        rotateBlock.push([])
        for(let j = 0; j < block[i].length; j++) {
            rotateBlock[i].push(0)
        }
    }
    //затем меняем положение
    for(let i = 0; i < block.length; i++) {
        for(let j = 0; j < block[i].length; j++) {
            rotateBlock[i][j] = block[j][i];
        }
    }
    //и нацонец, отражаем
    for(let i = 0; i < rotateBlock.length; i++) {
        rotateBlock[i] = rotateBlock[i].reverse();
    }
    //если фигура не у границы, из обычной фигуры делаем перевернутую
    if(!border(blockObj.x, blockObj.y, rotateBlock))
    blockObj.block = rotateBlock;
    renderGrid()
}

//создаем функцию, которая определяет границы доски
function border(x, y, rotateBlock) {
    let block = rotateBlock || blockObj.block;
    for(let i = 0; i < block.length; i++) {
        for( let j = 0; j < block[i].length; j++) {
            if(block[i][j] == 1) {
                let p = x + j;
                let q = y + i;
                if(p >= 0 && p < cols && q >= 0 && q < rows) {
                    //если задевает другой блок
                    if(grid[q][p] > 0) {
                        return true
                    }
                } else  {
                    return true
                }
            }
        }
    }
    return false 
}

//запускаем событие по клавише пробел, которое начинает игру
document.addEventListener('keyup', function(evt) {
    let key = evt.code;
    if(key == 'Space') {
        t = 1000;
    setTimeout(newGame, 1000)
    rule.classList.add('hidden')
    game.classList.remove('hidden')
    }
}) 
