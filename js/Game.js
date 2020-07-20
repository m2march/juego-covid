/*
https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
*/

// require Map

class Game {

  constructor(canvasId) {
    this.canvas = null;
    this.context = null;

    this.desktopMarginOffset = 300;

    this.totalPeople = 1000;

    this.isFocusedTab = true;

    this.init(canvasId);
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.random = new Random('115');

    this.canvas.width = window.innerWidth - this.desktopMarginOffset;
    this.canvas.height = window.innerHeight;

    this.canvasLeft = 0;
    this.canvasTop = 0;
    this.canvasRight = this.canvas.offsetWidth;
    this.canvasBottom = this.canvas.offsetHeight;

    // Personas con lugares de trabajo
    this.init_workspace_assignments();
    // Orden de prioridad de personas
    this.p_priority = this.random.shuffle([...Array(Game.p_total).keys() ]);

    this.map = new GameMap(
        this.context, this.random,
        {canvas_height : this.canvas.height, canvas_width : this.canvas.width});

    // window.requestAnimationFrame((timeStamp) => { this.gameLoop(timeStamp)
    // });
    this.clearCanvas();
    this.map.draw();
    this.ppl = this.map.people;
  }

  init_workspace_assignments() {
    this.workspace_assignment = new Array();
    var workspace_indices = [...Array(Game.w_total).keys() ];
    // First draw
    var first_draw = this.random.shuffle(workspace_indices);
    var ppl_count = 0;
    for (var i = 0; i < first_draw.length; i++) {
      this.workspace_assignment[ppl_count] = first_draw[i];
      ppl_count++;
    }
    // Other draws
    var base_dist = new Array();
    for (var i = 0; i < first_draw.length; i++) {
      for (var c = 0; c < Math.ceil(7 * i / first_draw.length); c++) {
        base_dist.push(first_draw[i]);
      }
    }
    while (ppl_count < Game.p_total) {
      var draw = this.random.shuffle(base_dist);
      for (var i = 0; i < draw.length && ppl_count < Game.p_total; i++) {
        this.workspace_assignment[ppl_count] = draw[i];
        ppl_count++;
      }
    }

    // Debug workspace distribution
    // var inverse = new Map();
    // for (var i = 0; i < this.workspace_assignment.length; i++) {
    //   if (inverse[this.workspace_assignment[i]] === undefined) {
    //     inverse[this.workspace_assignment[i]] = new Array();
    //   }
    //   inverse[this.workspace_assignment[i]].push(i);
    // }
    // inverse.forEach((v, k) => (inverse[k] = v.length));
    // console.log('Inverse', inverse);
  }

  workphase() {
    this.workspace_assignment.forEach((ps) => {
      contagion(ps, Game.w_contagion);
    });
  }

  contagion(ps, prob) {
    ps.forEach((p) => {
      ps.forEach((p2) => {
        if (p != p2 && p.is_contagious() && !p2.is_sick()) {
          if (this.random.uniform() < prob) {
            p2.make_sick();
          }
        }
      });
    });
  }

  meeting_phase() {
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  workphase() {
  }
}

// Game constants

// People
Game.p_total = 900;
Game.p_dead = 0.03
Game.w_contagion = 0.08;
Game.m_contagion = 0.3;

// Workspaces
Game.w_per_row = 3;
Game.w_per_col = 11;
Game.w_total = Game.w_per_row * Game.w_per_col * 2;
