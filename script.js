
const grid = document.querySelector('.grid');



// const IMGURL = {
//     0 : "assets\\blank.svg",
//     1 : "assets\\up.svg",
//     2 : "assets\\down.svg",
//     3 : "assets\\left.svg",
//     4 : "assets\\right.svg",
// }


const IMGURL= {
    0 : "terrain\\forest.svg",
    1 : "terrain\\grass.svg",
    2 : "terrain\\mountains.svg",
    3 : "terrain\\ocean.svg",
    4 : "terrain\\sand.svg",
}

const TILE_COUNT = 5

const GRID = []
const GRID_SIZE =  30;
const CELL_SIZE = 50;


grid.style.width = `${GRID_SIZE*CELL_SIZE}px`
grid.style.height = `${GRID_SIZE*CELL_SIZE}px`
grid.style.gridTemplateColumns = `repeat(${GRID_SIZE},1fr)`


class Cell{
    constructor(i,j){
        this.i = i;
        this.j = j

        this.ele = document.createElement('div')
        this.ele.classList.add('cell')
        this.ele.style.width = `${CELL_SIZE}px`
        this.ele.style.height = `${CELL_SIZE}px`

        this.options = []
        for(let i = 0; i < TILE_COUNT; i++){
            this.options.push(i)
        }
        this.collapsed = false
        this.type = -1
    }

}


for(let i = 0; i < GRID_SIZE; i++){
    let row = []
    for(let j = 0; j < GRID_SIZE;j++){
        let cell = new Cell(i,j)
        row.push(cell)
    }
    GRID.push(row)
}

function display(){
    grid.innerHTML = ``
    for(let i = 0; i < GRID_SIZE; i++){
        for(let j = 0; j < GRID_SIZE;j++){
            let cell = GRID[i][j]
            
            if(cell.type != -1){
                cell.ele.innerHTML = `<img src=${IMGURL[cell.type]} width =${CELL_SIZE}px height = ${CELL_SIZE}px>`
            }
            else{
                //cell.ele.innerHTML = `${cell.options}`
            }
            grid.appendChild(cell.ele)

        }
    }
    document.body.appendChild(grid)
}



let RULES = {
    0: {
        0: [0,1,2], // Top
        1: [0,1,2], // Bottom
        2: [0,1,2], // Left
        3: [0,1,2] // Right
    },
    1: {
        0: [0,1,4], // Top
        1: [0,1,4], // Bottom
        2: [0,1,4], // Left
        3: [0,1,4] // Right
    },
    2: {
        0: [0,2], // Top
        1: [0,2], // Bottom
        2: [0,2], // Left
        3: [0,2] // Right
    },
    3: {
        0: [3,4], // Top
        1: [3,4], // Bottom
        2: [3,4], // Left
        3: [3,4] // Right
    },
    4: {
        0: [1,3,4], // Top
        1: [1,3,4], // Bottom
        2: [1,3,4], // Left
        3: [1,3,4] // Right
    }
}
// ----------------------------------------------------------------

// Possible Options = 0,1,2,3,4

function rulemaker(selected=-1,top=-1,bottom=-1,left=-1,right=-1){
    // Selected
    GRID[1][1].type = selected

    // top
    GRID[0][1].type = top
    // bottom
    GRID[2][1].type = bottom
    // left
    GRID[1][0].type = left
    // right
    GRID[1][2].type = right
}

function isInbounds(i,j){
    return ((i >= 0 && i < GRID_SIZE) && (j >=0 && j < GRID_SIZE))
}



function getAllcells(){
    let cellArray = []
    for(var i = 0; i < GRID_SIZE; i++){
        for(var j = 0; j < GRID_SIZE; j++){
            let cell = GRID[i][j]
            cellArray.push(cell)
        }
    }
    return cellArray
}

function Allcollapsed(){
    cellArray = getAllcells()
    for(var i = 0; i < GRID_SIZE; i++){
        for(var j = 0; j < GRID_SIZE; j++){
            if(!GRID[i][j].collapsed){
                return false
            }
            
        }
    }
    return true
}

let cellArray  = getAllcells()
function collapse(){
    if(Allcollapsed()){
        return;
    }
    cellArray = cellArray.filter((cell)=> {return !cell.collapsed})
    let leastCell = getLeastEntropy()

    let randomValue = Math.floor(Math.random()*leastCell.options.length)
    leastCell.type = leastCell.options[randomValue]
    leastCell.collapsed = true
    
    cellArray = cellArray.filter((cell)=> {return !cell.collapsed})
    UpdateEntropy()
    display()
}

function getLeastEntropy(){
    let leastEntropy = Infinity
    let leastCell = undefined
    cellArray.forEach((cell)=>{
        if(cell.options.length < leastEntropy){
            leastEntropy = cell.options.length
            leastCell = cell
        }
    })
    // let leastEntropyCells = cellArray.filter((cell)=> {return cell.options.length == leastEntropy})
    // let randomIndex = Math.floor(Math.random()*leastEntropyCells.length)
    // return leastEntropyCells[randomIndex]
    return leastCell
}



function UpdateEntropy(){
    for(let i = 0; i < GRID_SIZE; i++){
        for(let j = 0; j < GRID_SIZE;j++){
            let cell = GRID[i][j]
            // top cell
            if(isInbounds(i-1,j)){
                let options = GRID[i-1][j].options
                let type = cell.type
                if(type != -1){
                    options = options.filter(value => RULES[type][0].includes(value));
                }
                GRID[i-1][j].options = options
            }
            //bottom cell
            if(isInbounds(i+1,j)){
                let options = GRID[i+1][j].options
                let type = cell.type
                if(type != -1){
                    options = options.filter(value => RULES[type][1].includes(value));
                }
                GRID[i+1][j].options = options
            }
            //left cell
            if(isInbounds(i,j-1)){
                let options = GRID[i][j-1].options
                let type = cell.type
                if(type != -1){
                    options = options.filter(value => RULES[type][2].includes(value));
                }
                GRID[i][j-1].options = options
            }
            //right cell
            if(isInbounds(i,j+1)){
                let options = GRID[i][j+1].options
                let type = cell.type
                if(type != -1){
                    options = options.filter(value => RULES[type][3].includes(value));
                }
                GRID[i][j+1].options = options
            }
            
        }
    }
}

// document.addEventListener('click',()=>{
//     collapse()
// })









// let i = 0
// let k = 4
// rulemaker(k,i,i,i,i)

//initial collapse
// start index
let i = 0
let j = 0
GRID[i][j].type = 0
GRID[i][j].collapsed = true
UpdateEntropy()
display()


function animate(){
    collapse()
    requestAnimationFrame(animate)
}
animate()
//setInterval(collapse,1)