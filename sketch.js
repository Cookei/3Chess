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

let whiteKing, whiteQueen, whiteBishop, whiteKnight, whitePawn, whiteRook, whiteUnicorn, blackKing, blackQueen, blackBishop, blackKnight, blackPawn, blackRook, blackUnicorn
let canvas

let preSelection

let promotionRadio, promotionConfirmButton
let confirming = false

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
    whiteUnicorn = new Image()
    whiteUnicorn.src = "img/white/unicorn.png"

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
    blackUnicorn = new Image()
    blackUnicorn.src = "img/black/unicorn.png"
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
                        color: null,
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
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 1 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteKnight"
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 2 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteKing"
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 3 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteKnight"
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 4 && j == 4 && k == 4) {
                    board[i][j][k].piece.img = "whiteRook"
                    board[i][j][k].piece.color = "white"
                } //
                else if (i == 0 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteBishop"
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 1 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteUnicorn"
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 2 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteQueen"
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 3 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteBishop"
                    board[i][j][k].piece.color = "white"
                }
                else if (i == 4 && j == 4 && k == 3) {
                    board[i][j][k].piece.img = "whiteUnicorn"
                    board[i][j][k].piece.color = "white"
                }
                else if (j == 3 && (k == 4 || k == 3)) {
                    board[i][j][k].piece.img = "whitePawn"
                    board[i][j][k].piece.color = "white"
                    board[i][j][k].firstMove = false
                } //------------
                else if (i == 0 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackRook"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 1 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackKnight"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 2 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackKing"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 3 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackKnight"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 4 && j == 0 && k == 0) {
                    board[i][j][k].piece.img = "blackRook"
                    board[i][j][k].piece.color = "black"
                } //
                else if (i == 0 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackBishop"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 1 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackUnicorn"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 2 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackQueen"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 3 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackBishop"
                    board[i][j][k].piece.color = "black"
                }
                else if (i == 4 && j == 0 && k == 1) {
                    board[i][j][k].piece.img = "blackUnicorn"
                    board[i][j][k].piece.color = "black"
                }
                else if (j == 1 && (k == 0 || k == 1)) {
                    board[i][j][k].piece.img = "blackPawn"
                    board[i][j][k].piece.color = "black"
                    board[i][j][k].firstMove = false
                }
                //#endregion
            }
        }
    }

    promotionRadio = createRadio()
    promotionRadio.option('Rook')
    promotionRadio.option('Unicorn')
    promotionRadio.option('Bishop')
    promotionRadio.option('Knight')
    promotionRadio.option('Queen')
    promotionRadio.position(canvasW + 50, 50)
    promotionRadio.selected('Queen')
    
    promotionConfirmButton = createButton("Confirm")
    promotionConfirmButton.position(promotionRadio.position().x, promotionRadio.position().y + 30)
    promotionConfirmButton.mousePressed(promote)

    promotionRadio.hide()
    promotionConfirmButton.hide()
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
                            case "whiteUnicorn": canvas.drawingContext.drawImage(whiteUnicorn, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
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
                            case "blackUnicorn": canvas.drawingContext.drawImage(blackUnicorn, i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize, tileSize)
                            break
                        }
                        fill(0)
                        textSize(25)
                        text(i + "," + j + "," + k, + i * tileSize + canvasOffsetW, (j * tileSize + canvasOffsetH) + k * tileSize * 5 + k * 50, tileSize)
                        textSize(50)
                    }
                }
            }
            
            if (confirming == true) return
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
    if (confirming == true) return
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
                            for (let a = 0; a < preSelection.piece.possibleMoves.length; a++) {
                                if (i == preSelection.piece.possibleMoves[a][0] && j == preSelection.piece.possibleMoves[a][1] && k == preSelection.piece.possibleMoves[a][2]) {
                                    if (preSelection.piece.img == "whitePawn") {
                                        if (j == 0 && (k == 0 || k == 1)) {
                                            confirming = true
                                            promotionRadio.show()
                                            promotionConfirmButton.show()
                                        }
                                        else {
                                            board[i][j][k].piece.img = preSelection.piece.img
                                            preSelection.piece.img = null
                                            board[i][j][k].selected = false
                                        }
                                    }
                                    else if (preSelection.piece.img == "blackPawn") {
                                        if (j == 4 && (k == 4 || k == 3)) {
                                            confirming = true
                                            promotionRadio.show()
                                            promotionConfirmButton.show()
                                        }
                                        else {
                                            board[i][j][k].piece.img = preSelection.piece.img
                                            preSelection.piece.img = null
                                            board[i][j][k].selected = false
                                        }
                                    }
                                    else {
                                        board[i][j][k].piece.img = preSelection.piece.img
                                        preSelection.piece.img = null
                                        board[i][j][k].selected = false
                                    }
                                    if (confirming == true) return
                                    board[i][j][k].piece.color = preSelection.piece.color
                                    preSelection.piece.color = null
                                    if (preSelection.piece.firstMove != undefined) {
                                        preSelection.firstMove = true
                                    }
                                    preSelection.piece.possibleMoves = []
                                }
                            }
                            if (preSelection != board[i][j][k]) {
                                preSelection.selected = false
                            }
                            preSelection.piece.possibleMoves = []
                        }
                        if (confirming == true) return
                        preSelection = board[i][j][k]

                        //functions
                        let findPieceRook = function() {
                            let totalMoves = []
                            for (let y = j + 1; y < board.length; y++) { //Check down
                                if (board[i][y][k] == undefined) {
                                    break
                                }
                                else if (board[i][y][k].piece.color != preSelection.piece.color) {
                                    if (board[i][y][k].piece.color == null) {
                                        totalMoves.push([i, y, k])
                                    }
                                    else {
                                        totalMoves.push([i, y, k])
                                        break
                                    }
                                }
                                else {
                                    break
                                }
                            }
                            for (let y = j - 1; y >= 0; y--) { //Check up
                                if (board[i][y][k] == undefined) {
                                    break
                                }
                                else if (board[i][y][k].piece.color != preSelection.piece.color) {
                                    if (board[i][y][k].piece.color == null) {
                                        totalMoves.push([i, y, k])
                                    }
                                    else {
                                        totalMoves.push([i, y, k])
                                        break
                                    }
                                }
                                else {
                                    break
                                }
                            }
                            for (let x = i + 1; x < board.length; x++) { //Check right
                                if (board[x][j][k] == undefined) {
                                    break
                                }
                                else if (board[x][j][k].piece.color != preSelection.piece.color) {
                                    if (board[x][j][k].piece.color == null) {
                                        totalMoves.push([x, j, k])
                                    }
                                    else {
                                        totalMoves.push([x, j, k])
                                        break
                                    }
                                }
                                else {
                                    break
                                }
                            }
                            for (let x = i - 1; x >= 0; x--) { //Check left
                                if (board[x][j][k] == undefined) {
                                    break
                                }
                                else if (board[x][j][k].piece.color != preSelection.piece.color) {
                                    if (board[x][j][k].piece.color == null) {
                                        totalMoves.push([x, j, k])
                                    }
                                    else {
                                        totalMoves.push([x, j, k])
                                        break
                                    }
                                }
                                else {
                                    break
                                }
                            }
                            for (let z = k + 1; z < board.length; z++) { //Check superDown
                                if (board[i][j][k] == undefined) {
                                    break
                                }
                                else if (board[i][j][z].piece.color != preSelection.piece.color) {
                                    if (board[i][j][z].piece.color == null) {
                                        totalMoves.push([i, j, z])
                                    }
                                    else {
                                        totalMoves.push([i, j, z])
                                        break
                                    }
                                }
                                else {
                                    break
                                }
                            }
                            for (let z = k - 1; z >= 0; z--) { //Check superUp
                                if (board[i][j][z] == undefined) {
                                    break
                                }
                                else if (board[i][j][z].piece.color != preSelection.piece.color) {
                                    if (board[i][j][z].piece.color == null) {
                                        totalMoves.push([i, j, z])
                                    }
                                    else {
                                        totalMoves.push([i, j, z])
                                        break
                                    }
                                }
                                else {
                                    break
                                }
                            }
                            return totalMoves
                        }
                        let findPieceBishop = function() {
                            let totalMoves = []
                            let checkDiagBottomRighttoUpperLeft = function(dir, over) {
                                for (let x = i + dir * 1, y = j + dir * 1; x <= board.length && y <= board.length; x += dir * 1, y += dir * 1) {
                                    if (board[x] == undefined || board[x][y] == undefined) {
                                        if (over == true) return
                                        checkDiagBottomRighttoUpperLeft(-1, true)
                                        break
                                    }
                                    else if (board[x][y][k].piece.color != preSelection.piece.color) {
                                        if (board[x][y][k].piece.color == null) {
                                            totalMoves.push([x, y, k])
                                        }
                                        else {
                                            totalMoves.push([x, y, k])
                                            if (over == true) return
                                            checkDiagBottomRighttoUpperLeft(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkDiagBottomRighttoUpperLeft(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkDiagBottomLefttoUpperRight = function(dir, over) {
                                for (let x = i + dir * 1, y = j + -dir * 1; x >= -1 && y >= -1; x += dir * 1, y += -dir * 1) {
                                    if (board[x] == undefined || board[x][y] == undefined) {
                                        if (over == true) return
                                        checkDiagBottomLefttoUpperRight(-1, true)
                                        break
                                    }
                                    else if (board[x][y][k].piece.color != preSelection.piece.color) {
                                        if (board[x][y][k].piece.color == null) {
                                            totalMoves.push([x, y, k])
                                        }
                                        else {
                                            totalMoves.push([x, y, k])
                                            if (over == true) return
                                            checkDiagBottomLefttoUpperRight(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkDiagBottomLefttoUpperRight(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkDiagSuperBottomLefttoSuperUpperRight = function(dir, over) {
                                for (let x = i + dir * 1, z = k + -dir * 1; x >= -1 && z >= -1; x += dir * 1, z += -dir * 1) {
                                    if (board[x] == undefined || board[x][j] == undefined || board[x][j][z] == undefined) {
                                        if (over == true) return
                                        checkDiagSuperBottomLefttoSuperUpperRight(-1, true)
                                        break
                                    }
                                    else if (board[x][j][z].piece.color != preSelection.piece.color) {
                                        if (board[x][j][z].piece.color == null) {
                                            totalMoves.push([x, j, z])
                                        }
                                        else {
                                            totalMoves.push([x, j, z])
                                            if (over == true) return
                                            checkDiagSuperBottomLefttoSuperUpperRight(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkDiagSuperBottomLefttoSuperUpperRight(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkDiagSuperBottomRighttoSuperUpperLeft = function(dir, over) {
                                for (let x = i + dir * 1, z = k + dir * 1; x <= board.length && z <= board.length; x += dir * 1, z += dir * 1) {
                                    if (board[x] == undefined || board[x][j] == undefined || board[x][j][z] == undefined) {
                                        if (over == true) return
                                        checkDiagSuperBottomRighttoSuperUpperLeft(-1, true)
                                        break
                                    }
                                    else if (board[x][j][z].piece.color != preSelection.piece.color) {
                                        if (board[x][j][z].piece.color == null) {
                                            totalMoves.push([x, j, z])
                                        }
                                        else {
                                            totalMoves.push([x, j, z])
                                            if (over == true) return
                                            checkDiagSuperBottomRighttoSuperUpperLeft(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkDiagSuperBottomRighttoSuperUpperLeft(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkFowardUptoBackwardDown = function(dir, over) {
                                for (let y = j + dir * 1, z = k + dir * 1; y <= board.length && z <= board.length; y += dir * 1, z += dir * 1) {
                                    if (board[i][y] == undefined || board[i][y][z] == undefined) {
                                        if (over == true) return
                                        checkFowardUptoBackwardDown(-1, true)
                                        break
                                    }
                                    else if (board[i][y][z].piece.color != preSelection.piece.color) {
                                        if (board[i][y][z].piece.color == null) {
                                            totalMoves.push([i, y, z])
                                        }
                                        else {
                                            totalMoves.push([i, y, z])
                                            if (over == true) return
                                            checkFowardUptoBackwardDown(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkFowardUptoBackwardDown(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkFowardDowntoBackwardUp = function(dir, over) {
                                for (let y = j + -dir * 1, z = k + dir * 1; y >= -1 && z >= -1; y += -dir * 1, z += dir * 1) {
                                    if (board[i][y] == undefined || board[i][y][z] == undefined) {
                                        if (over == true) return
                                        checkFowardDowntoBackwardUp(-1, true)
                                        break
                                    }
                                    else if (board[i][y][z].piece.color != preSelection.piece.color) {
                                        if (board[i][y][z].piece.color == null) {
                                            totalMoves.push([i, y, z])
                                        }
                                        else {
                                            totalMoves.push([i, y, z])
                                            if (over == true) return
                                            checkFowardDowntoBackwardUp(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkFowardDowntoBackwardUp(-1, true)
                                        break
                                    }
                                }
                            }
                            checkDiagBottomRighttoUpperLeft(1, false)
                            checkDiagBottomLefttoUpperRight(1, false)
                            checkDiagSuperBottomLefttoSuperUpperRight(1, false)
                            checkDiagSuperBottomRighttoSuperUpperLeft(1, false)
                            checkFowardUptoBackwardDown(1, false)
                            checkFowardDowntoBackwardUp(1, false)
                            return totalMoves
                        }
                        let findPieceUnicorn = function() {
                            let totalMoves = []
                            let checkUpperLefttoLowerRight = function(dir, over) {
                                for (let x = i + dir * 1, y = j + dir * 1, z = k + dir * 1; x <= board.length && y <= board.length && z <= board.length; x += dir * 1, y += dir * 1, z += dir * 1) {
                                    if (board[x] == undefined || board[x][y] == undefined || board[x][y][z] == undefined) {
                                        if (over == true) return
                                        checkUpperLefttoLowerRight(-1, true)
                                        break
                                    }
                                    else if (board[x][y][z].piece.color != preSelection.piece.color) {
                                        if (board[x][y][z].piece.color == null) {
                                            totalMoves.push([x, y, z])
                                        }
                                        else {
                                            totalMoves.push([x, y, z])
                                            if (over == true) return
                                            checkUpperLefttoLowerRight(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkUpperLefttoLowerRight(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkUpperRighttoLowerLeft = function(dir, over) {
                                for (let x = i + dir * 1, y = j + -dir * 1, z = k + -dir * 1; x >= -1 && y >= -1 && z >= -1; x += dir * 1, y += -dir * 1, z += -dir * 1) {
                                    if (board[x] == undefined || board[x][y] == undefined || board[x][y][z] == undefined) {
                                        if (over == true) return
                                        checkUpperRighttoLowerLeft(-1, true)
                                        break
                                    }
                                    else if (board[x][y][z].piece.color != preSelection.piece.color) {
                                        if (board[x][y][z].piece.color == null) {
                                            totalMoves.push([x, y, z])
                                        }
                                        else {
                                            totalMoves.push([x, y, z])
                                            if (over == true) return
                                            checkUpperRighttoLowerLeft(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkUpperRighttoLowerLeft(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkForwardRighttoBackwardLeft = function(dir, over) {
                                for (let x = i + dir * 1, y = j + -dir * 1, z = k + dir * 1; x >= -1 && y >= -1 && z >= -1; x += dir * 1, y += -dir * 1, z += dir * 1) {
                                    if (board[x] == undefined || board[x][y] == undefined || board[x][y][z] == undefined) {
                                        if (over == true) return
                                        checkForwardRighttoBackwardLeft(-1, true)
                                        break
                                    }
                                    else if (board[x][y][z].piece.color != preSelection.piece.color) {
                                        if (board[x][y][z].piece.color == null) {
                                            totalMoves.push([x, y, z])
                                        }
                                        else {
                                            totalMoves.push([x, y, z])
                                            if (over == true) return
                                            checkForwardRighttoBackwardLeft(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkForwardRighttoBackwardLeft(-1, true)
                                        break
                                    }
                                }
                            }
                            let checkForwardLefttoBackwardRight = function(dir, over) {
                                for (let x = i + dir * 1, y = j + dir * 1, z = k + -dir * 1; x <= board.length && y <= board.length && z <= board.length; x += dir * 1, y += dir * 1, z += -dir * 1) {
                                    if (board[x] == undefined || board[x][y] == undefined || board[x][y][z] == undefined) {
                                        if (over == true) return
                                        checkForwardLefttoBackwardRight(-1, true)
                                        break
                                    }
                                    else if (board[x][y][z].piece.color != preSelection.piece.color) {
                                        if (board[x][y][z].piece.color == null) {
                                            totalMoves.push([x, y, z])
                                        }
                                        else {
                                            totalMoves.push([x, y, z])
                                            if (over == true) return
                                            checkForwardLefttoBackwardRight(-1, true)
                                            break
                                        }
                                    }
                                    else {
                                        if (over == true) return
                                        checkForwardLefttoBackwardRight(-1, true)
                                        break
                                    }
                                }
                            }
                            checkUpperLefttoLowerRight(1, false)
                            checkUpperRighttoLowerLeft(1, false)
                            checkForwardRighttoBackwardLeft(1, false)
                            checkForwardLefttoBackwardRight(1, false)
                            return totalMoves
                        }
                        let findPieceQueen = function() {
                            let totalMoves = []
                            findPieceUnicorn().forEach(i => totalMoves.push(i))
                            findPieceBishop().forEach(i => totalMoves.push(i))
                            findPieceRook().forEach(i => totalMoves.push(i))
                            return totalMoves
                        }
                        let findPieceKing = function() {
                            let totalMoves = []
                            let checkSquare = function(dir) {
                                if (dir < -1) {
                                    return
                                }
                                for (let x = i - 1; x <= i + 1; x++) {
                                    for (let y = j - 1; y <= j + 1; y++) {
                                        if (board[x] != undefined && board[x][y] != undefined && board[x][y][k + dir] != undefined) {
                                            if (board[x][y][k + dir].piece.color != preSelection.piece.color) {
                                                if (board[x][y][k + dir].piece.color == null) {
                                                    totalMoves.push([x, y, k + dir])
                                                }
                                                else {
                                                    totalMoves.push([x, y, k + dir])
                                                    continue
                                                }
                                            }
                                        }
                                    }
                                }
                                checkSquare(dir - 1)
                            }
                            checkSquare(1)
                            return totalMoves
                        }
                        let findPieceKnight = function() {
                            let totalMoves = []
                            let upBottomHalf = function(dir, over) {
                                for (let x = -2; x <= 2; x++) {
                                    if (x == 0) {
                                        continue
                                    }
                                    let y = -1/3 * Math.pow(x, 2) + 2 + 1/3
                                    if (board[i + x] != undefined && board[i + x][j + dir * y] != undefined && board[i + x][j + dir * y][k] != undefined) {
                                        if (board[i + x][j + dir * y][k].piece.color != preSelection.piece.color) {
                                            if (board[i + x][j + dir * y][k].piece.color == null) {
                                                totalMoves.push([i + x, j + dir * y, k])
                                            }
                                            else {
                                                totalMoves.push([i + x, j + dir * y, k])
                                            }
                                        }
                                    }
                                }
                                if (over == true) {
                                    return
                                }
                                upBottomHalf(-1, true)
                            }
                            let topHorizDownHalf = function(dir, over) {
                                for (let x = -2; x <= 2; x++) {
                                    if (x == 0) {
                                        continue
                                    }
                                    let y = -1/3 * Math.pow(x, 2) + 2 + 1/3
                                    if (board[i + x] != undefined && board[i + x][j] != undefined && board[i + x][j][k + dir * y] != undefined) {
                                        if (board[i + x][j][k + dir * y].piece.color != preSelection.piece.color) {
                                            if (board[i + x][j][k + dir * y].piece.color == null) {
                                                totalMoves.push([i + x, j, k + dir * y])
                                            }
                                            else {
                                                totalMoves.push([i + x, j, k + dir * y])
                                            }
                                        }
                                    }
                                }
                                if (over == true) {
                                    return
                                }
                                topHorizDownHalf(-1, true)
                            }
                            let topVertiDownHalf = function(dir, over) {
                                for (let x = -2; x <= 2; x++) {
                                    if (x == 0) {
                                        continue
                                    }
                                    let y = -1/3 * Math.pow(x, 2) + 2 + 1/3
                                    if (board[i] != undefined && board[i][j + x] != undefined && board[i][j + x][k + dir * y] != undefined) {
                                        if (board[i][j + x][k + dir * y].piece.color != preSelection.piece.color) {
                                            if (board[i][j + x][k + dir * y].piece.color == null) {
                                                totalMoves.push([i, j + x, k + dir * y])
                                            }
                                            else {
                                                totalMoves.push([i, j + x, k + dir * y])
                                            }
                                        }
                                    }
                                }
                                if (over == true) {
                                    return
                                }
                                topVertiDownHalf(-1, true)
                            }
                            upBottomHalf(1, false)
                            topHorizDownHalf(1, false)
                            topVertiDownHalf(1, false)
                            return totalMoves
                        }
                        let findPiecePawn = function(dir) {
                            let totalMoves = []
                            for (let x = i - 1, y = j; x <= i + 1; x++) {
                                if (x == i) {
                                    y = j + dir
                                }
                                else {
                                    y = j
                                }
                                if (board[x] != undefined && board[x][y] != undefined && board[x][y][k + dir] != undefined) {
                                    if (board[x][y][k + dir].piece.color != preSelection.piece.color && board[x][y][k + dir].piece.color != null) {
                                        totalMoves.push([x, y, k + dir])
                                    }
                                }
                                if (board[x] != undefined && board[x][j + dir] != undefined && board[x][j + dir][k] != undefined) {
                                    if (board[x][j + dir][k].piece.color != preSelection.piece.color) {
                                        if (board[x][j + dir][k].piece.color == null) {
                                            if (x != i - 1 && x != i + 1) {
                                                totalMoves.push([x, j + dir, k])
                                            }
                                        }
                                        else if (x != i) {
                                            totalMoves.push([x, j + dir, k])
                                        }
                                    }
                                }
                            }
                            if (board[i][j][k + dir] != undefined) {
                                if (board[i][j][k + dir].piece.color != preSelection.piece.color && board[i][j][k + dir].piece.color == null) {
                                    totalMoves.push([i, j, k + dir])
                                }
                            }
                            return totalMoves
                        }
                        
                        if (preSelection.piece.img != null) {
                            switch (preSelection.piece.img) {
                                case "whitePawn":
                                    findPiecePawn(-1).forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "whiteRook":
                                    findPieceRook().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "whiteBishop":
                                    findPieceBishop().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "whiteUnicorn":
                                    findPieceUnicorn().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "whiteQueen":
                                    findPieceQueen().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "whiteKing":
                                    findPieceKing().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "whiteKnight":
                                    findPieceKnight().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "blackPawn":
                                    findPiecePawn(1).forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "blackRook":
                                    findPieceRook().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "blackBishop":
                                    findPieceBishop().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "blackUnicorn":
                                    findPieceUnicorn().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "blackQueen":
                                    findPieceQueen().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "blackKing":
                                    findPieceKing().forEach(i => preSelection.piece.possibleMoves.push(i))
                                break
                                case "blackKnight":
                                    findPieceKnight().forEach(i => preSelection.piece.possibleMoves.push(i))
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

function promote() {
    for (let k = 0; k < 5; k++) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j][k].selected == true) {
                    board[i][j][k].piece.img = preSelection.piece.color + promotionRadio.value()
                    board[i][j][k].piece.color = preSelection.piece.color
                    preSelection = {
                        color: "",
                        x: i,
                        y: j,
                        z: k,
                        piece: {
                            img: null,
                            color: null,
                            possibleMoves: []
                        },
                        selected: false
                    }
                    board[i][j][k].selected = false
                    confirming = false
                    promotionRadio.hide()
                    promotionConfirmButton.hide()
                    break
                }
            }
        }
    }
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