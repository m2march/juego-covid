// require Person, Workplace

class GameMap {

  constructor(context, random, {canvas_width, canvas_height}) { 
    this.random = random;
    this.context = context;

    
    let workspaces_margin_width = canvas_width * GameMap.workspace_margin_width;
    let workspaces_max_width = canvas_width * GameMap.workspace_width_prop;
    let houses_max_width = (canvas_width - (workspaces_max_width * 2) -
                            workspaces_margin_width * 2);
    let houses_margin_height = canvas_height * GameMap.houses_margin_height;
    let houses_max_height = canvas_height - houses_margin_height * 2;
    let houses_x = workspaces_max_width + workspaces_margin_width;
    let houses_y = houses_margin_height;
    
    this.initHousesGrid({houses_max_width, canvas_height});
    this.initHouses({houses_max_width, houses_max_height, houses_x, houses_y});
    this.initWorkplaces({workspaces_max_width,
                         canvas_width, canvas_height});
  }

  initHousesGrid({houses_max_width, canvas_height}) {
    let adjusted_width = houses_max_width / GameMap.p_width_ratio;
    var r = 1;
    var c = Game.p_total;
    let canvas_ratio = adjusted_width / canvas_height;
    var ratio = r / c;
    for (var i = 1; i <= Game.p_total; i++) {
      let temp_r = i;
      let temp_c = Game.p_total / temp_r;
      if (Math.round(temp_c) != temp_c) {
        continue;
      }
      let temp_ratio = temp_r / temp_c;
      if (Math.abs(canvas_ratio - temp_ratio) < Math.abs(canvas_ratio - ratio)) {
        r = temp_r;
        c = temp_c;
        ratio = temp_ratio;
      }
    }
    this.p_per_col = c;
    this.p_per_row = r;
  }

  initHouses({houses_max_width, houses_max_height, houses_x, houses_y}) {
    this.houses_width = houses_max_width;
    this.houses_height = houses_max_height;

    let person_height = this.houses_height / this.p_per_col;
    let person_width = this.houses_width / this.p_per_row;

    this.person_width = Math.min(person_width, person_height * GameMap.p_width_ratio);
    this.person_height = this.person_width / GameMap.p_width_ratio;

    this.houses_width = this.person_width * this.p_per_row;
    this.houses_height = this.person_height * this.p_per_col;
    
    this.houses_x = houses_x;
    this.houses_y = houses_y;

    let first_sick = Math.round(this.random.uniform() * Game.p_total);
    let houses_x_margin = this.houses_x;
    let houses_y_margin = this.houses_y;

    this.people = new Array();
    for (var r = 0; r < this.p_per_col; r++) {
      for (var c = 0; c < this.p_per_row; c++) {
        let index = c + this.p_per_row * r;
        let x = this.person_width * c;
        let y = this.person_height * r;
        this.people.push(new Person(this.context, this.random,
          {
            index: index, 
            x: houses_x_margin + x,
            y: houses_y_margin + y,
            infectedState: index == first_sick ? InfectedState.HEALTHY : InfectedState.ASYMPTOMATIC,
            p_width: this.person_width,
            p_height: this.person_height
          }
        ));
      }
    }
  }

  initWorkplaces({workspaces_max_width, canvas_width, canvas_height}) {
    this.workspace_width = Math.min(workspaces_max_width / Game.w_per_row,
                                    canvas_height / Game.w_per_col);
    this.workspace_height = this.workspace_width;

    this.workspaces_x = [
      0,
      canvas_width - workspaces_max_width
    ]

    let workspace_x_margin = ((workspaces_max_width - 
                               (this.workspace_width * Game.w_per_row)
                              ) / (Game.w_per_row + 1))
    let workspace_y_margin = ((canvas_height -
                               (this.workspace_height * Game.w_per_col)
                              ) / (Game.w_per_col + 1))

    this.workspaces = new Array();
    for (var s = 0; s < 2; s++) {
      for (var r = 0; r < Game.w_per_col; r++) {
        for (var c = 0; c < Game.w_per_row; c++) {
          let x = (this.workspaces_x[s] + this.workspace_width * c +
                   workspace_x_margin * (c + 1));
          let y = (this.workspace_height * r +
                   workspace_y_margin * (r + 1));
          this.workspaces.push(new Workplace(this.context,
            {
              x: x,
              y: y,
              width: this.workspace_width,
              height: this.workspace_height
            }
          ));
        }
      }
    }
  }

  draw() {
    this.people.forEach((p) => p.draw());
    this.workspaces.forEach((w) => w.draw());
  }

}

// Map class static variables

GameMap.workspace_width_prop = 0.19;
GameMap.workspace_margin_width = 0.01;
GameMap.houses_margin_height = 0.01

// People
GameMap.p_width_ratio = 1.5;
