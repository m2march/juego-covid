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

    this.radius = p_height * 0.8 / 2;
    this.friends = random.shuffle([...Array(Game.p_total).keys()]);

    this.workplace_index = -1;
  }

  draw() {
    let color = InfectedColors[this.infectedState];

    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(this.dot.x, this.dot.y, this.radius, 0, 2 * Math.PI,
                     false);
    this.context.fill();
  }

  make_sick() { this.infectedState = InfectedState.ASYMPTOMATIC; }

  next_day(random) {
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
    if (this.is_sick()) {
      this.sick_days++;
    }
  }

  is_contagious() { return this.infectedState == InfectedState.PRESYMPTOMATIC; }

  is_sick() {
    const sick_states = new Set([
      InfectedState.ASYMPTOMATIC, InfectedState.PRESYMPTOMATIC,
      InfectedState.SYMPTOMATIC
    ]);
    return sick_states.has(this.infectedState);
  }

  can_work() {
    const no_work_states = new Set([
      InfectedState.SYMPTOMATIC, InfectedState.DEAD
    ]);
    return !no_work_states.has(this.infectedState);
  }
}
