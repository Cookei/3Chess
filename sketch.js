/// <reference path="p5.global-mode.d.ts" />

let peer
let canvasW = 900
let canvasH = 900
var conn
let connectButton, hostButton, connectionInput, submitButton
let opponent = {
    peerId: null
}
let myId
let gameState = "Default"
var destId

let myTurn = null
let board = []
let tileSize = 100
let canvasOffsetW = (canvasW - tileSize * 5) / 2
let canvasOffsetH = tileSize / 2

let mousex, mousey
let lock = true
let preMouseX, preMouseY, initalOffsetX, initialOffesetY

let whiteKing, whiteQueen, whiteBishop, whiteKnight, whitePawn, whiteRook, blackKing, blackQueen, blackBishop, blackKnight, blackPawn, blackRook
let canvas

let preSelection
let selectionSwitch = true

function setup() {
    canvas = createCanvas(canvasW, canvasH)

    if (myTurn == true) {
        canvasOffsetH = -4 * tileSize * 4 - 4 * 50 - tileSize / 2
    }
    else {
        canvasOffsetH = tileSize / 2
    }

    //Host Button
    hostButton = createButton("Host")
    hostButton.position(canvasW/3 - canvasW/10/2, canvasH/2 - 50/2)
    hostButton.size(canvasW/10, 50)
    connectButton = createButton("Join")
    connectButton.position(2 * canvasW/3 - canvasW/10/2, canvasH/2 - 50/2)
    connectButton.size(canvasW/10, 50)
    
    connectionInput = createInput()
    connectionInput.position(canvasW/2 - canvasW/2/2, canvasH/2 - 50/2)
    connectionInput.size(canvasW/2 - 100, 50)
    connectionInput.hide()

    submitButton = createButton("Submit")
    submitButton.position(canvasW/2 - canvasW/2/2 + canvasW/2 - 100 + 15, canvasH/2 - 50/2)
    submitButton.size(100, 50)
    submitButton.hide()

    hostButton.mousePressed(function () {
        gameState = "HostAwait"
        begin()
    })
    connectButton.mousePressed(function () {
        gameState = "JoinAwait"
        connectionInput.show()
        submitButton.show()
    })

    submitButton.mousePressed(function() {
        destId = connectionInput.value()
        joinConnection()
    })

    //#region Piece Variable Declaration
    whiteKing = new Image()
    whiteKing.src = "img/white/king.png"
    whiteQueen = new Image()
    whiteQueen.src = "img/white/queen.png"
    whiteBishop = new Image()
    whiteBishop.src = "img/white/bishop.png"
    whiteKnight = new Image()
    whiteKnight.src = "img/white/knight.png"
    whitePawn = new Image()
    whitePawn.src = "img/white/pawn.png"
    whiteRook = new Image()
    whiteRook.src = "img/white/rook.png"

    blackKing = new Image()
    blackKing.src = "img/black/king.png"
    blackQueen = new Image()
    blackQueen.src = "img/black/queen.png"
    blackBishop = new Image()
    blackBishop.src = "img/black/bishop.png"
    blackKnight = new Image()
    blackKnight.src = "img/black/knight.png"
    blackPawn = new Image()
    blackPawn.src = "img/black/pawn.png"
    blackRook = new Image()
    blackRook.src = "img/black/rook.png"
    //#endregion

    //Board creation
    for (let i = 0; i < 5; i++) {
        board[i] = []
        for (let j = 0; j < 5; j++) {
            board[i][j] = []
            for (let k = 0; k < 5; k++) {
                board[i][j][k] = {
                    color: "",
                    x: i,
                    y: j,
                    z: k,
                    piece: {
                        img: null,
                        possibleMoves: []
                    },
                    selected: false
                }
                if (j % 2 == i % 2 == k % 2) {
                    board[i][j][k].color = "white"
                }
                else {
                    board[i][j][k].color = "black"
                }
                //#region Piece Allocation 
                if (i == 0 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteRook"
                }
                else if (i == 1 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteKnight"
                }
                else if (i == 2 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteKing"
                }
                else if (i == 3 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteKnight"
                }
                else if (i == 4 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteRook"
                } //
                else if (i == 0 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteBishop"
                }
                else if (i == 1 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteKnight"
                }
                else if (i == 2 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteQueen"
                }
                else if (i == 3 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteBishop"
                }
                else if (i == 4 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteKnight"
                }
                else if (j == 3 && (k == 4 || k == 3)) {
                    board[i][j][k].piece.img = "whitePawn"
                } //------------
                else if (i == 0 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackRook"
                }
                else if (i == 1 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackKnight"
                }
                else if (i == 2 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackKing"
                }
                else if (i == 3 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackKnight"
                }
                else if (i == 4 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackRook"
                } //
                else if (i == 0 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackBishop"
                }
                else if (i == 1 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackKnight"
                }
                else if (i == 2 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackQueen"
                }
                else if (i == 3 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackBishop"
                }
                else if (i == 4 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackKnight"
                }
                else if (j == 1 && (k == 0 || k == 1)) {
                    board[i][j][k].piece.img = "blackPawn"
                }
                //#endregion
            }
        }
    }
}

function draw() {
    background(50)
    if (gameState != "Default") {
        connectButton.hide()
        hostButton.hide()

        // if (gameState == "StartGame") {
            // Drawing the chess board
            for (let k = 0; k < 5; k++) {
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j][k].color == "white") {
                            fill(232, 235, 239)
                        }
                        else if (board[i][j][k].color == "black") {
                            fill(125, 135, 150)
                        }
                        stroke(127)
                        rect(board[i][j][k].x * tileSize + canvasOffsetW, (board[i][j][k].y * tileSize + canvasOffsetH) + board[i][j][k].z * tileSize * 5 + board[i][j][k].z * 50, tileSize, tileSize)
                        
                        let expr = board[i][j][k].piece.img
                        switch(expr) {
                            case "whiteKing": canvas.drawingContext.drawImage(whiteKing, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "whiteQueen": canvas.drawingContext.drawImage(whiteQueen, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "whiteBishop": canvas.drawingContext.drawImage(whiteBishop, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "whiteKnight": canvas.drawingContext.drawImage(whiteKnight, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "whitePawn": canvas.drawingContext.drawImage(whitePawn, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "whiteRook": canvas.drawingContext.drawImage(whiteRook, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break

                            case "blackKing": canvas.drawingContext.drawImage(blackKing, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "blackQueen": canvas.drawingContext.drawImage(blackQueen, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "blackBishop": canvas.drawingContext.drawImage(blackBishop, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "blackKnight": canvas.drawingContext.drawImage(blackKnight, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "blackPawn": canvas.drawingContext.drawImage(blackPawn, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                            case "blackRook": canvas.drawingContext.drawImage(blackRook, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                        }
                    }
                }
            }
            
            for (let k = 0; k < 5; k++) {
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        //Hover Logic
                        if (mouseX >= board[i][j][k].x * tileSize + canvasOffsetW && mouseX <= board[i][j][k].x * tileSize + canvasOffsetW + tileSize) {
                            if (mouseY >= (board[i][j][k].y * tileSize + canvasOffsetH) + board[i][j][k].z * tileSize * 5 + board[i][j][k].z * 50 && mouseY <= (board[i][j][k].y * tileSize + canvasOffsetH) + board[i][j][k].z * tileSize * 5 + board[i][j][k].z * 50 + tileSize) {
                                noFill()
                                stroke(255, 204, 100)
                                strokeWeight(3)
                                rect(board[i][j][k].x * tileSize + canvasOffsetW, (board[i][j][k].y * tileSize + canvasOffsetH) + board[i][j][k].z * tileSize * 5 + board[i][j][k].z * 50, tileSize, tileSize)
                                strokeWeight(1)
                                // console.log(board[i][j][k].x, board[i][j][k].y, board[i][j][k].z)
                            }
                        }
                        //Selection logic
                        if (board[i][j][k].selected == true) {
                            noFill()
                            stroke(240, 156, 91)
                            strokeWeight(3)
                            rect(board[i][j][k].x * tileSize + canvasOffsetW, (board[i][j][k].y * tileSize + canvasOffsetH) + board[i][j][k].z * tileSize * 5 + board[i][j][k].z * 50, tileSize, tileSize)
                            strokeWeight(1)
                            for (let possibleMovesCounter = 0; possibleMovesCounter < board[i][j][k].piece.possibleMoves.length; possibleMovesCounter++) {
                                let movesArray = board[i][j][k].piece.possibleMoves[possibleMovesCounter]
                                fill(255, 0, 0, 80)
                                noStroke()
                                rect(movesArray[0] * tileSize + canvasOffsetW, (movesArray[1] * tileSize + canvasOffsetH) + movesArray[2] * tileSize * 5 + movesArray[2] * 50, tileSize, tileSize)
                            }
                        }
                    }   
                }
            }
        // }
    }
    else {
        connectButton.show()
        hostButton.show()
    }
}

function mouseClicked() {
    if (gameState == "Default") return
    if (myTurn == false) return
    for (let k = 0; k < 5; k++) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                //Selection Logic
                if (mouseX >= board[i][j][k].x * tileSize + canvasOffsetW && mouseX <= board[i][j][k].x * tileSize + canvasOffsetW + tileSize) {
                    if (mouseY >= (board[i][j][k].y * tileSize + canvasOffsetH) + board[i][j][k].z * tileSize * 5 + board[i][j][k].z * 50 && mouseY <= (board[i][j][k].y * tileSize + canvasOffsetH) + board[i][j][k].z * tileSize * 5 + board[i][j][k].z * 50 + tileSize) {
                        board[i][j][k].selected = true
                        if (preSelection != undefined) {
                            selectionSwitch = true
                            for (let a = 0; a < preSelection.piece.possibleMoves.length; a++) {
                                if (i == preSelection.piece.possibleMoves[a][0] && j == preSelection.piece.possibleMoves[a][1] && k == preSelection.piece.possibleMoves[a][2]) {
                                    board[i][j][k].piece.img = preSelection.piece.img
                                    preSelection.piece.img = null
                                    board[i][j][k].selected = false
                                    preSelection.piece.possibleMoves = []
                                }
                            }
                            if (preSelection != board[i][j][k]) {
                                preSelection.selected = false
                            }
                            preSelection.piece.possibleMoves = []
                        }
                        preSelection = board[i][j][k]

                        if (preSelection.piece.img != null && selectionSwitch == true) {
                            switch (preSelection.piece.img) {
                                case "whitePawn":
                                    selectionSwitch = false
                                    let max
                                    if ((k == 4 || k == 3) && j == 3) {
                                        max = 2
                                    }
                                    else {
                                        max = 1
                                    }

                                    let findPiece = function(a, b) {
                                        if (a < max) {
                                            if (j - a - 1 >= 0) {
                                                if (board[i][j - a - 1][k].piece.img == null) {
                                                    preSelection.piece.possibleMoves.push([i, j - a - 1, k])
                                                }
                                            }
                                            return findPiece(a + 1, b)
                                        }
                                        else if (b < max) {
                                            if (k - b - 1 >= 0) {
                                                if (board[i][j][k - b - 1].piece.img == null) {
                                                    preSelection.piece.possibleMoves.push([i, j, k - b - 1])
                                                }
                                            }
                                            return findPiece(a, b + 1)
                                        }
                                    }
                                    findPiece(0, 0)
                                break
                            }
                        }
                    }
                }
            }   
        }
    }
}

function mouseWheel() {
    if (gameState != "Default") {
        if (event.deltaY > 0) {
            canvasOffsetH -= 95
        }
        else if (event.deltaY < 0 ) {
            canvasOffsetH += 95
        }
        canvasOffsetH = constrain(canvasOffsetH, -4 * tileSize * 4 - 4 * 50 - tileSize / 2, tileSize / 2)
    }
}

function mouseDragged() {
    if (lock == true) {
        lock = false
        // preMouseX = mouseX
        preMouseY = mouseY
        // initialOffesetX = canvasOffsetW
        initialOffesetY = canvasOffsetH
    }
    // differenceX = mouseX - preMouseX
    differenceY = mouseY - preMouseY
    // canvasOffsetW = differenceX + initialOffesetX
    canvasOffsetH = differenceY + initialOffesetY
    // canvasOffsetW = constrain(canvasOffsetW,  -tileSize * 5 / 2, canvasW - tileSize * 5 / 2)
    canvasOffsetH = constrain(canvasOffsetH, -4 * tileSize * 4 - 4 * 50 - tileSize / 2, tileSize / 2)
}

function mouseReleased() {
    lock = true
}

// PEER JS

function createPeer() {
    peer = new Peer()
    peer.on('open', function(id) {
        myId = id
        createP(id)
    })
    peer.on('error', function(err) {
        alert(''+err)
    })
}

function begin() {
    createPeer()
    textSize(50)
    fill(255)
    textAlign(CENTER)
    text("Awaiting Connection", canvasW/2, 100)
    peer.on('open', function() {
        fill(255)
        textAlign(CENTER)
        text(myId, canvasW/2, canvasH/2)
    })
    peer.on('connection', function(c) {
        if (conn) {
            c.close()
            return
        }
        conn = c
        myTurn = true
        startGame()
        gameState = "StartGame"
    })
}

function joinConnection() {
    createPeer()
    peer.on('open', function() {
        conn = peer.connect(destId, {
            reliable: true
        })
        conn.on
        conn.on('open', function() {
            opponent.peerId = destId
            connectionInput.hide()
            submitButton.hide()
            myTurn = false
            startGame()
            gameState = "StartGame"
        })
    })
}

function startGame() {
    background(100)
    
}