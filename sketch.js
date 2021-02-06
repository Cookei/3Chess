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
let canvasOffsetW = canvasW/4
let canvasOffsetH = canvasH/4

let mousex, mousey

function setup() {
    createCanvas(canvasW, canvasH)
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

    //Board creation
    for (let i = 0; i < 4; i++) {
        board[i] = []
        for (let j = 0; j < 4; j++) {
            board[i][j] = {
                color: "",
                x: i,
                y: j,
                piece: "none",
            }
            if (j % 2 == i % 2) {
                board[i][j].color = "white"
            }
            else {
                board[i][j].color = "black"
            }
        }
    }
}

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

function draw() {
    background(50)
    if (mouseX >= canvasOffsetW && mouseX <= canvasW - canvasOffsetW - tileSize / 2 && mouseY >= canvasOffsetH && mouseY <= canvasH - canvasOffsetH - tileSize / 2) {
        mousex = constrain(Math.floor((mouseX - canvasOffsetW) / tileSize), 0, 3)
        mousey = constrain(Math.floor((mouseY - canvasOffsetH) / tileSize), 0, 3)
    }
    else {
        mousex = undefined
        mousey = undefined
    }
    if (gameState != "Default") {
        connectButton.hide()
        hostButton.hide()

        // if (gameState == "StartGame") {
            // Drawing the chess board
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j].color == "white") {
                        fill(240)
                    }
                    else if (board[i][j].color == "black") {
                        fill(30)
                    }
                    stroke(0)
                    rect(board[i][j].x * tileSize + canvasOffsetW, board[i][j].y * tileSize + canvasOffsetH, tileSize, tileSize)
                }
            }

            // Hover Logic
            if (mousex != undefined && mousey != undefined) {
                noFill()
                stroke(255, 204, 100)
                strokeWeight(3)
                rect(board[mousex][mousey].x * tileSize + canvasOffsetW, board[mousex][mousey].y * tileSize + canvasOffsetH, tileSize, tileSize)
                strokeWeight(1)
            }
        // }
    }
    else {
        
        connectButton.show()
        hostButton.show()
    }
}