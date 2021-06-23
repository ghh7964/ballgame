// 캔버스를 사용하기 위해서 문서에 있는 캔버스를 찾아 선택!
const canvas = document.querySelector("#myCanvas")
const ctx = canvas.getContext("2d")

// 공의 최초 시작위치 결정
let x = canvas.width / 2
let y = canvas.height - 30

// 공의 움직임을 주기 위해서 설정한 값
let dx = 2
let dy = -2

// 공의 반지름
const ballRadius = 10

// 공을 그리는 함수
function ballDraw() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#0095DD"
  ctx.fill()
  ctx.closePath()
}

// Paddle 설정값
const paddleHeight = 10
const paddleWidth = 75

// paddle의 최초 시작 위치
let paddleX = (canvas.width - paddleWidth) / 2

// paddle 그리는 함수
function paddleDraw() {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = "#0095DD"
  ctx.fill()
  ctx.closePath()
}

// 왼쪽, 오른쪽 버튼이 눌렸는지 저장하는 변수
let rightPressed = false
let leftPressed = false

// 키가 눌렀을때, 저장하기 위한 함수
function keyDownHandler(event) {
  if (event.keyCode == 39) {  // 39는 오른쪽 방향키
    rightPressed = true
  } else if (event.keyCode == 37) {  // 37는 왼쪽 방향키
    leftPressed = true
  }
}

// 키를 그만 눌렀을때, 저장하기 위한 함수
function keyUpHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = false
  } else if (event.keyCode == 37) {
    leftPressed = false
  }
}

// 문서(웹페이지 전체)에 키를 눌렀을때, 키를 그만 눌렀을때 함수 연결
document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

// 벽돌을 만들기 위한 변수 설정
const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30

// 벽돌에 기본 정보 만들기
const bricks = []
for(let col = 0; col < brickColumnCount; col++) {
    bricks[col] = []
    for(let row = 0; row < brickRowCount; row++) {
        bricks[col][row] = { x: 0, y: 0, states : true }
    }
}

// 벽돌을 그리는 함수
function drawBricks() {
    for(let col = 0; col < brickColumnCount; col++) {
        for(let row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].states) {
                const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft
                const brickY = row * (brickHeight + brickPadding) + brickOffsetTop
                bricks[col][row].x = brickX
                bricks[col][row].y = brickY

                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = "#0095DD"
                ctx.fill()
                ctx.closePath
            }
        }
    }
}

let score = 0

function collisionDetection() {
    for(let col = 0; col < brickColumnCount; col++) {
        for(let row = 0; row < brickRowCount; row++) {
            const b = bricks[col][row]
            // 만약 사라진 블록이면 패스~
            if (b.states === false) {
                continue
            }

            // 블록 충돌 검사
            if (x > b.x && x < b.x + brickWidth) {
                if (y > b.y && y < b.y + brickHeight) {
                    dy = -dy
                    b.states = false
                    score = score + 1
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial"
    ctx.fillStyle = "black"
    ctx.fillText("Score : " + score, 8, 20)
}

function checkWin() {
    if (score === 15) {
        alert("You Win!")
        score = 0
        document.location.reload()
        x = 50
        y = 50
    }
}

function mouseMoveHandler(event) {
    const relativeX = event.clientX - canvas.offsetLeft
    
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2
    }
}

document.addEventListener("mousemove", mouseMoveHandler)

// 화면을 그리는 함수
function draw() {
  // 화면 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 볼 관련
  ballDraw()

  // 왼쪽, 오른쪽 벽에 공이 갈경우 방향을 바꾸기
  if (x + dx + ballRadius > canvas.width || x + dx < ballRadius) {
    dx = -dx
  }

  // 천장과 바닥으로 공이 갔을때, 방향 바꾸기
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    // 바닥으로 공이 갔을때
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy  // 공이 paddle의 위치에 있을때
    } else {
      // 아니면 게임 종료
      alert("GAME OVER")
      document.location.reload() // 새로고침
      x = canvas.width / 2
      y = canvas.height - 30
    }
  }

  // 공 움직임 적용
  x += dx
  y += dy

  // paddle 그리기
  paddleDraw()

  // paddle 움직임 적용
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  }
  if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }

  // 벽돌 그리기
  drawBricks()

  // 벽돌 충돌 검사
  collisionDetection()

  // 스코어
  drawScore()

  // 승리
  checkWin()

  requestAnimationFrame(draw)
}

// 반복하기
// setInterval(draw, 10)
draw()
