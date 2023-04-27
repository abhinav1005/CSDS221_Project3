var board = document.getElementById("myBoard");

var closeBtn = document.getElementsByClassName("close")[0];
var won = false;
gameOver = function () {
  if(!won){
  board.style.display = "block";
  x = document.querySelector(".result");
  x.textContent = "You lost. Game Over. Reload to Try Again";
  }
  else{
    ;
  }
};

gameWin = function () {
  board.style.display = "block";
  x = document.querySelector(".result");
  x.textContent = "Congrats! You Won";
  won = true;
};


function reset() {
  document.location.reload();
}

closeBtn.onclick = function () {
  board.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == board) {
    board.style.display = "none";
  }
};

function startTimer(duration, display) {
  let startTime = Date.now();
  let playing = true;

  function updateTimer() {
    if (playing) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(duration - Math.floor(elapsed / 1000), 0);
      const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
      const seconds = String(remaining % 60).padStart(2, "0");
      display.textContent = `Game ends in ${minutes}:${seconds}`;

      if (remaining <= 0 || won) {
        playing = false;
        display.textContent = "Game Over";
        setTimeout(() => {
          gameOver();
        }, 1000);
      }
    }
  }
  updateTimer();
  setInterval(updateTimer, 1000);
}

window.onload = function () {
  time = 45;
  x = document.querySelector("#timer");
  startTimer(time, x);
};

playing = true;
window.addEventListener("keydown", handleKeyDown, true);

function handleKeyDown(evt) {
  const key = evt.code;
  const canvas = "canvas";
  const moves = mazeBoard.getMoves();
  
  if (playing && ["ArrowUp", "KeyW"].includes(key)) {
    mazeBoard.moveup(canvas);
  } else if (playing && ["ArrowDown", "KeyS"].includes(key)) {
    mazeBoard.movedown(canvas);
  } else if (playing && ["ArrowLeft", "KeyA"].includes(key)) {
    mazeBoard.moveleft(canvas);
  } else if (playing && ["ArrowRight", "KeyD"].includes(key)) {
    mazeBoard.moveright(canvas);
  }
  
  if (mazeBoard.checker(canvas)) {
    playing = false;
  }
  
  if (mazeBoard.getMoves() !== moves) {
    evt.preventDefault();
  }
  
  console.log(mazeBoard.getMoves());
}


var disjointSet = function (size) {
  this.Node = size;
  this.Parent = new Array(this.Node);
  this.Rank = new Array(this.Node);

  this.init = function () {
    for (var i = 0; i < this.Node; i++) {
      this.Parent[i] = i;
      this.Rank[i] = 0;
    }
  };

  this.union = function (x, y) {
    var u = this.find(x);
    var v = this.find(y);
    if (this.Rank[u] > this.Rank[v]) {
      this.Rank[u] = this.Rank[v] + 1;
      this.Parent[u] = v;
    } else {
      this.Rank[v] = this.Rank[u] + 1;
      this.Parent[v] = u;
    }
  };

  this.find = function (x) {
    if (x == this.Parent[x]) return x;
    this.Parent[x] = this.find(this.Parent[x]);
    return this.Parent[x];
  };
};


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}


var maze = function (X, Y) {
  this.N = X; // grid dimension x
  this.M = Y; // grid dimension y
  this.S = 25; // scale
  this.moves = 0;
  this.Board = new Array(2 * this.N + 1);
  this.EL = new Array(); // edgeList
  this.vis = new Array(2 * this.N + 1);
  this.delay = 2;
  this.x = 1;
  this.init = function () {
    for (var i = 0; i < 2 * this.N + 1; i++) {
      this.Board[i] = new Array(2 * this.M + 1);
      this.vis[i] = new Array(2 * this.M + 1);
    }

    for (var i = 0; i < 2 * this.N + 1; i++) {
      for (var j = 0; j < 2 * this.M + 1; j++) {
        if (!(i % 2) && !(j % 2)) {
          this.Board[i][j] = "+";
        } else if (!(i % 2)) {
          this.Board[i][j] = "-";
        } else if (!(j % 2)) {
          this.Board[i][j] = "|";
        } else {
          this.Board[i][j] = " ";
        }
        this.vis[i][j] = 0;
      }
    }
  };

  this.add_edges = function () {
    for (var i = 0; i < this.N; i++) {
      for (var j = 0; j < this.M; j++) {
        if (i != this.N - 1) {
          this.EL.push([[i, j], [i + 1, j], 1]);
        }
        if (j != this.M - 1) {
          this.EL.push([[i, j], [i, j + 1], 1]);
        }
      }
    }
  };

  this.h = function (e) {
    return e[1] * this.M + e[0];
  };
  this.randomize = function (EL) {
    for (var i = 0; i < EL.length; i++) {
      var si = Math.floor(Math.random() * 387) % EL.length;
      var tmp = EL[si];
      EL[si] = EL[i];
      EL[i] = tmp;
    }
    return EL;
  };

  this.makeGaps = function (e) {
    var x = e[0][0] + e[1][0] + 1;
    var y = e[0][1] + e[1][1] + 1;
    this.Board[x][y] = " ";
  };

  this.gen_maze = function () {
    this.EL = this.randomize(this.EL);
    var D = new disjointSet(this.M * this.M);
    D.init();
    var s = this.h([0, 0]);
    var e = this.h([this.N - 1, this.M - 1]);
    this.Board[1][0] = " ";
    this.Board[2 * this.N - 1][2 * this.M] = " ";
    for (var i = 0; i < this.EL.length; i++) {
      var x = this.h(this.EL[i][0]);
      var y = this.h(this.EL[i][1]);
      if (D.find(s) == D.find(e)) {
        if (!(D.find(x) == D.find(s) && D.find(y) == D.find(s))) {
          if (D.find(x) != D.find(y)) {
            D.union(x, y);
            this.makeGaps(this.EL[i]);
            this.EL[i][2] = 0;
          }
        }
      } else if (D.find(x) != D.find(y)) {
        D.union(x, y);
        this.makeGaps(this.EL[i]);
        this.EL[i][2] = 0;
      } else {
        continue;
      }
    }
  };

  this.make_path = function (id) {
    this.canvas = document.getElementById(id);
    var scale = this.S;
    temp = [];
    if (this.canvas.getContext) {
      this.context = this.canvas.getContext("2d");
      this.Board[1][0] = "$";
      for (var i = 0; i < 2 * this.N + 1; i++) {
        for (var j = 0; j < 2 * this.M + 1; j++) {
          if (this.Board[i][j] != " ") {
            this.context.fillStyle = "#000";
            this.context.fillRect(scale * i, scale * j, scale, scale);
          } else if (i < 5 && j < 5) temp.push([i, j]);
        }
      }
      x = randomChoice(temp);
      this.Board[x[0]][x[1]] = "&";
      this.context.fillStyle = "#047fc2";
      this.context.fillRect(scale * x[0], scale * x[1], scale, scale);
    }
  };

  this.checkPos = function (id) {
    for (var i = 0; i < 2 * this.N + 1; i++) {
      for (var j = 0; j < 2 * this.M + 1; j++) {
        if (this.Board[i][j] == "&") {
          // console.log(i,j)
          return [i, j];
        }
      }
    }
  };

  this.moveclear = function (a, b) {
    var scale = this.S;
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "#4e94ba";
    this.context.fillRect(scale * a, scale * b, scale, scale);
    this.Board[a][b] = " ";
  };

  this.move = function (a, b) {
    var scale = this.S;
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "#047fc2";
    this.context.fillRect(scale * a, scale * b, scale, scale);
    this.Board[a][b] = "&";
  };

  this.moveup = function (id) {
    cord = this.checkPos(id);
    var scale = this.S;
    i = cord[0];
    j = cord[1];
    j -= 1;
    if (j < 0) return;
    else if (j > 2 * this.M) return;
    else if (this.Board[i][j] == " ") {
      this.moveclear(i, j + 1);
      this.move(i, j);
      this.moves += 1;
    } else return;
  };

  this.movedown = function (id) {
    cord = this.checkPos(id);
    var scale = this.S;
    i = cord[0];
    j = cord[1];
    j += 1;
    if (j < 0) return;
    else if (j > 2 * this.M) return;
    else if (this.Board[i][j] == " ") {
      this.moveclear(i, j - 1);
      this.move(i, j);
      this.moves += 1;
    } else return;
  };

  this.moveleft = function (id) {
    cord = this.checkPos(id);
    var scale = this.S;
    i = cord[0];
    j = cord[1];
    i -= 1;
    if (i < 0) return;
    else if (i > 2 * this.N)
      return;
    else if (this.Board[i][j] == " ") {
      this.moveclear(i + 1, j);
      this.move(i, j);
      this.moves += 1;
    } else return;
  };

  this.moveright = function (id) {
    cord = this.checkPos(id);
    var scale = this.S;
    i = cord[0];
    j = cord[1];
    i += 1;
    if (i < 0) 
      return;
    else if (i > 2 * this.N) return;
    else if (this.Board[i][j] == " ") {
      this.moveclear(i - 1, j);
      this.move(i, j);
      this.moves += 1;
    } else return;
  };
  
  this.checker = function (id) {
    cord = this.checkPos(id);
    i = cord[0];
    j = cord[1];
    if ((i == 19 && j == 20) || (i == 1 && j == 0)) {
      gameWin();
      return 1;
    }
    return 0;
  };

  this.getMoves = function () {
    return this.moves;
  };
};

mazeBoard = new maze(10, 10);
mazeBoard.init();
mazeBoard.add_edges();
mazeBoard.gen_maze();
mazeBoard.make_path("canvas");
function drawMoves() {
  document.getElementById("moves").innerHTML = "Moves: " + mazeBoard.getMoves();
}
setInterval(drawMoves, 100);
