function Item(board, index, width) {
    this.index = index + 1;
    this.createHtml(width, index);
    this.html.addEventListener('click', () => board.clicked(this));
}

Item.prototype.createHtml = function (width) {
    let number = document.createElement('h6');
    number.innerText = String(this.index);
    number.style.display = 'inline-block';
    number.style.margin = 'auto auto auto auto';
    number.style.fontSize = width / 2 + "px";
    this.html = document.createElement('div');
    this.html.appendChild(number);
    this.html.style.backgroundColor = 'gray';
    this.html.style.width = width + "px";
    this.html.style.height = width + "px";
    this.html.style.position = "absolute";
    this.html.style.display = "flex";
    this.html.style.justifyContent = "center";
    this.html.style.alignItems = "center";
    this.html.style.transitionDuration = "100ms";
}

Item.prototype.isEmpty = function () {
    return (this.html.style.display === "none");
}


function Board(width, count = 4) {
    this.count = count;
    this.arr = [];
    let itemWidth = (width * 90) / (100 * this.count);
    let spaceWidth = (width * 10) / (200 * this.count);
    for (let i = 0; i < this.count; ++i) {
        this.arr[i] = [];
        for (let j = 0; j < this.count; ++j) {
            this.arr[i][j] = new Item(this, this.count * i + j, itemWidth);
            this.arr[i][j].html.style.top = (i * 2 + 1) * spaceWidth + i * itemWidth + "px";
            this.arr[i][j].html.style.left = (j * 2 + 1) * spaceWidth + j * itemWidth + "px";
        }
    }
    this.arr[this.count - 1][this.count - 1].html.style.display = "none";
    this.createHtml(width);
    document.addEventListener('keydown',
        (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.move('up');
                    break;
                case "ArrowLeft":
                    this.move('left');
                    break;
                case "ArrowDown":
                    this.move('down');
                    break;
                case "ArrowRight":
                    this.move('right');
                    break;
            }
        });
    this.shuffle();
}

Board.prototype.createHtml = function (width) {
    this.html = document.createElement('div');
    this.html.style.position = "relative";
    this.html.style.width = width + "px";
    this.html.style.height = width + "px";
    for (let i = 0; i < this.count; ++i) {
        for (let j = 0; j < this.count; ++j) {
            this.html.appendChild(this.arr[i][j].html);
        }
    }
    this.html.style.backgroundColor = "#7f007f";
    this.html.tabIndex = 0;
}
Board.prototype.clicked = function (item) {
    for (let i = 0; i < this.count; ++i) {
        for (let j = 0; j < this.count; ++j) {
            if (item === this.arr[i][j]) {
                if (this.isValid(i - 1, j) && this.arr[i - 1][j].isEmpty()) {
                    this.move('up');
                } else if (this.isValid(i, j - 1) && this.arr[i][j - 1].isEmpty()) {
                    this.move('left');
                } else if (this.isValid(i + 1, j) && this.arr[i + 1][j].isEmpty()) {
                    this.move('down');
                } else if (this.isValid(i, j + 1) && this.arr[i][j + 1].isEmpty()) {
                    this.move('right');
                }
                return;
            }
        }
    }
}
Board.prototype.move = function (direction) {
    let flag = true;
    for (let i = 0; flag && i < this.count; ++i) {
        for (let j = 0; flag && j < this.count; ++j) {
            if (this.arr[i][j].isEmpty()) {
                switch (direction) {
                    case 'up':
                        this.swap(i, j, i + 1, j);
                        break;
                    case 'left':
                        this.swap(i, j, i, j + 1);
                        break;
                    case 'down':
                        this.swap(i, j, i - 1, j);
                        break;
                    case 'right':
                        this.swap(i, j, i, j - 1);
                        break;
                }
                flag = false;
            }
        }
    }
    this.checkWin();
}
Board.prototype.swap = function (row1, col1, row2, col2) {
    if (!this.isValid(row1, col1) || !this.isValid(row2, col2)) {
        return;
    }
    [this.arr[row1][col1].html.style.top, this.arr[row2][col2].html.style.top] =
        [this.arr[row2][col2].html.style.top, this.arr[row1][col1].html.style.top];
    [this.arr[row1][col1].html.style.left, this.arr[row2][col2].html.style.left] =
        [this.arr[row2][col2].html.style.left, this.arr[row1][col1].html.style.left];
    [this.arr[row1][col1], this.arr[row2][col2]] = [this.arr[row2][col2], this.arr[row1][col1]];
}
Board.prototype.shuffle = function () {
    for (let i = 0; i < this.count; ++i) {
        for (let j = 0; j < this.count; ++j) {
            this.arr[i][j].html.style.transitionDuration = "0s";
        }
    }

    const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

    let sum = 0;
    for (let c = 0; c < this.count * this.count; ++c) {
        let i_1 = getRandomInt(this.count);
        let j_1 = getRandomInt(this.count);
        let i_2 = getRandomInt(this.count);
        let j_2 = getRandomInt(this.count);
        sum += (i_1 - i_2) + (j_1 - j_2) + 2 * this.count;
        this.swap(i_1, j_1, i_2, j_2);
    }
    if (sum % 2 !== 0) {
        this.swap(0, 0, 0, 1);
    }

    for (let i = 0; i < this.count; ++i) {
        for (let j = 0; j < this.count; ++j) {
            this.arr[i][j].html.style.transitionDuration = "100ms";
        }
    }
}
Board.prototype.checkWin = function () {
    for (let i = 0; i < this.count; ++i) {
        for (let j = 0; j < this.count; ++j) {
            if (this.arr[i][j].index - 1 !== i * this.count + j) {
                return;
            }
        }
    }

    setTimeout(() => { alert('You won!'); this.shuffle();}, 200);
}
Board.prototype.isValid = function(row, col) {
    return (row >= 0 && row < this.count && col >= 0 && col < this.count);
}


const field = new Board(600, 4);
document.body.appendChild(field.html);
document.body.style.padding = "10px";
console.log(field);