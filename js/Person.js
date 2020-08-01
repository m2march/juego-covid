// InfectedState enum

InfectedState = {
  HEALTHY : 0,
  ASYMPTOMATIC : 1,
  PRESYMPTOMATIC : 2,
  SYMPTOMATIC : 3,
  RECOVERED : 4,
  DEAD : 5
}

class Person {
  constructor(context, random, {index, x, y, infectedState, p_width, p_height}) {
    this.context = context;

    this.index = index;
    this.infectedState = infectedState;

    this.x = x;
    this.y = y;

    this.sick_days = -1;
    this.happiness = Game.h_init;

    this.dot = {
      x : this.x + p_width / 2,
      y : this.y + p_height / 2
    };
    this.draw_dot = true;

    this.radius = p_height * 0.8 / 2;
    this.friends = random.shuffle([...Array(Game.p_total).keys()]);

    this.workplace_index = -1;
  }

  draw() {
    let color = InfectedColors[this.infectedState];

    if (this.draw_dot !== false) {
      this.context.fillStyle = color;
      this.context.beginPath();
      if (this.draw_dot === true) {
        var {x, y} = this.dot;
      } else {
        var {x, y} = this.draw_dot;
      }
      this.context.arc(x, y, this.radius, 0, 2 * Math.PI,
                       false);
      this.context.fill();
    }
  }

  /**
   * Temporarily updates dot position for moving animation.
   *
   * @param {int} x -- x destination
   * @param {int} y -- y destination
   * @param {0..1} progress -- percentage moving
   */
  go_to(x, y, progress) {
    if (progress < 0.99 && progress > 0.01) {
      this.draw_dot = {
        x : this.dot.x * (1 - progress) + x * progress,
        y : this.dot.y * (1 - progress) + y * progress,
      }
      return;
    }
    if (progress > 0.99) {
      this.draw_dot = false;
    } else {
      this.draw_dot = true;
    }
  }

  make_sick() { this.infectedState = InfectedState.ASYMPTOMATIC; }

  next_day(random) {
    if (this.is_sick()) {
      this.sick_days++;
    }
    if (this.sick_days == 5) {
      this.infectedState = InfectedState.PRESYMPTOMATIC;
    }
    if (this.sick_days == 7) {
      this.infectedState = InfectedState.SYMPTOMATIC;
    }
    if (this.sick_days == 9) {
      if (random.uniform() < Game.p_dead) {
        this.infectedState = InfectedState.DEAD;
      } else {
        this.infectedState = InfectedState.RECOVERED;
      }
    }
  }

  is_contagious() { return this.infectedState == InfectedState.PRESYMPTOMATIC; }

  is_sick() {
    return this.infectedState != InfectedState.HEALTHY;
  }

  can_work() {
    const no_work_states = new Set([
      InfectedState.SYMPTOMATIC, InfectedState.DEAD
    ]);
    return !no_work_states.has(this.infectedState);
  }
}
