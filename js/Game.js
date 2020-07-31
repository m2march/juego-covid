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

    this.map = new GameMap(
        this.context, this.random,
        {canvas_height : this.canvas.height, canvas_width : this.canvas.width});
    this.ppl = this.map.people;

    // Orden de prioridad de personas
    this.p_priority = this.random.shuffle(this.ppl);
    this.meeting_p_index = 0;
    
    // Personas con lugares de trabajo
    this.init_workspace_assignments();

    this.days = 0;
    this.stats = new Map();

    // window.requestAnimationFrame((timeStamp) => { this.gameLoop(timeStamp)
    // });
    this.clearCanvas();
    this.map.draw();
        
    this.daysCountEl = document.querySelector('.stats__days-count');
    this.totalHealthyCountEl = document.querySelector('.stats__healthy-count');
    this.symptomaticCountEl = document.querySelector('.stats__symptomatic-count');
    this.recoveredCountEl = document.querySelector('.stats__recovered-count');
    this.deadCountEl = document.querySelector('.stats__dead-count');
    this.happinessCountEl = document.querySelector('.stats__happiness-count');

    this.updateStats();
    this.queryDay();
  }

  init_workspace_assignments() {
    // this.workspace_assignment: 
    //  * len of Game.p_total
    //  * goes to workplace index
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

    for (var i = 0; i < this.workspace_assignment.length; i++) {
      this.ppl[i].workplace_index = this.workspace_assignment[i];
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


  /**
   * Performs the workphase of the day.
   *
   * Receives as parameter the mobility percentage, which indicates which
   * percentage of non-symptomatics go to work. 
   *
   * The function selects who goes to work and fills the workplaces with 
   * people. Then calculates contagion for each workplace, updating the state
   * of each person.
   *
   * @param {float in [0, 1]} mobility_percent - percentage of non symptomatics 
   * that go to their workplace
   */
  workphase(mobility_percent) {
    var workplaces = [...Array(Game.w_total).keys()].map((x) => []);
    var can_work_ppl = this.p_priority.filter((p) => p.can_work());
    var will_work_count = Math.round(can_work_ppl.length * mobility_percent);

    for (var i = 0; i < will_work_count; i++) {
      workplaces[can_work_ppl[i].workplace_index].push(can_work_ppl[i]);
    }

    workspaces.forEach((ps) => {
      contagion(ps, Game.w_contagion);
    });
  }

  /**
   * Performs the meetings phase of the day.
   *
   * The number of meetings per day is constant as defined by Game.t_meetings.
   *
   * Moving in priority order, starting on the person following the last that
   * had a meeting, people are selected to arrange a meeting. People that can
   * create a meeting are the same that can work. They invite meeting_size 
   * people that can work, in order of their friendships. A person already
   * invited to a meeting cannot create a meeting.
   *
   * Once meetings are created, contagion is calculated for each meeting.
   *
   * @param {int >= 0} meeting_size - max number of people allowed in meetings
   */
  meeting_phase(meeting_size) {
    var meetings = [];

    var ppl_index_in_meeting = new Set();

    while (meetings.length < Game.t_meetings) {
      var current_p = this.p_priority[this.meeting_p_index];
      if (current_p.can_work() && !ppl_index_in_meeting.has(current_p.index)) {
        ppl_index_in_meeting.add(current_p.index);
        var meeting = [current_p];
        for (var i = 0; 
             i < current_p.friends.length && meeting.length < meeting_size; 
             i++) {
          var current_i = this.ppl[current_p.friends[i]];
          if (current_i.can_work() && !ppl_index_in_meeting.has(current_i.index)) {
            meeting.push(current_i);
            ppl_index_in_meeting.add(current_i.index);
          }
        }
        meetings.push(meeting);
      }
      this.meeting_p_index = (this.meeting_p_index + 1) % this.ppl.length;
    }

    meetings.forEach((ps) => contagion(ps, Game.m_contagion));
  }

  /**
   * Contagion simulation in gathering.
   *
   * The probabilty a person gets sick is `prob` ** #sick people in gathering
   *
   * It asumes everyone interacts with everyone once, and each interaction has
   * a `prob` chance to transmit the desease.
   *
   * @param {Array[Person]} ps - People in the gathering
   * @param {float in [0, 1]} prob - Probability of contagion per interaction
   */
  contagion(ps, prob) {
    var will_get_sick = [];

    ps.forEach((p) => {
      ps.forEach((p2) => {
        if (p != p2 && p.is_contagious() && !p2.is_sick()) {
          if (this.random.uniform() < prob) {
            will_get_sick.push(p2);
          }
        }
      });
    });

    will_get_sick.forEach((p) => p.make_sick());
  }

  generateStats() {
    if (!this.stats.has(this.days)) {
      var stats = {}
      stats[InfectedState.HEALTHY] = 0;
      stats[InfectedState.SYMPTOMATIC] = 0;
      stats[InfectedState.RECOVERED] = 0;
      stats[InfectedState.DEAD] = 0;
      stats['happiness'] = 0;

      this.ppl.forEach((p) => {
        if (p.infectedState == InfectedState.SYMPTOMATIC) {
          stats[InfectedState.SYMPTOMATIC]++;
        } else if (p.infectedState == InfectedState.RECOVERED) {
          stats[InfectedState.RECOVERED]++;
        } else if (p.infectedState == InfectedState.DEAD) {
          stats[InfectedState.DEAD]++;
        } else {
          stats[InfectedState.HEALTHY]++;
        }
        stats['happiness'] += p.happiness;
      });
      this.stats[this.days] = stats;
    }
  }
    
  updateStats() {
    this.generateStats();

    var stats = this.stats[this.days];

    this.daysCountEl.textContent = this.days;
    this.totalHealthyCountEl.textContent = stats[InfectedState.HEALTHY];
    this.symptomaticCountEl.textContent = stats[InfectedState.SYMPTOMATIC];
    this.recoveredCountEl.textContent = stats[InfectedState.RECOVERED];
    this.deadCountEl.textContent = stats[InfectedState.DEAD];
    this.happinessCountEl.textContent = stats['happiness'];

    /*
    this.statusBarHealthyEl.style.transform = `scaleX(${totalHealthyCount / 1000})`;
    this.statusBarContagiousEl.style.transform = `scaleX(${contagiousCount / 1000})`;
    this.statusBarRecoveredEL.style.transform = `scaleX(${recoveredCount / 1000})`;
    this.statusBarHospitalizeEL.style.transform = `scaleX(${hospitalizedCount / 1000})`;
    this.statusBarDeathsEL.style.transform = `scaleX(${totalDeathCount / 1000})`;
    this.statusBarGotcontagiousEl.style.transform = `scaleX(${(1000 - totalHealthyCount) / 1000})`;
    */
  }

  extractStats(key) {
    var ret = [];
    for (const item of this.stats) {
      ret.push(item[1][key]);
    }
    return ret;
  }

  queryDay() {
    new Chartist.Line("#plot_cases", {
      labels: [...this.stats.keys()],
      series: [[this.extractStats(InfectedState.SYMPTOMATIC)]]
    });
    new Chartist.Line("#plot_deaths", {
      labels: [...this.stats.keys()],
      series: [[this.extractStats(InfectedState.DEAD)]]
    });
    document.querySelector("#" + 'day_modal').classList.toggle("modal--is-hidden");
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

Game.t_meetings = 10;
Game.h_init = 100;
Game.d_total = 100;

Game.init_meetings = 2;
Game.init_mobility = 0.75;
