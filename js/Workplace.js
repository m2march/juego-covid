class Workplace {
  constructor(context, {x, y, width, height}) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.center = {
      x: this.x + this.width * 0.5,
      y: this.y + this.height * 0.65
    };

    this.text_center = {
      x: this.x + this.width * 0.6,
      y: this.y + this.height * 0.75
    }

    this.drawing_pos = [
      [2, 45.7],
      [8.1, 45.7],
      [10.8, 8.8],
      [10.8, 24.6],
      [27.4, 33],
      [27.4, 24.3],
      [45.5, 32.1],
      [45.5, 0],
      [0, 0]
    ]
    this.drawing_pos = this.drawing_pos.map(
      (p) => {return [p[0] / 45.8, p[1] / 45.8]}
    );
  }

  draw() {
    let ctx = this.context;
    let margin_x = this.width * 0.05;
    let margin_y = this.height * 0.05;

    let width = this.width - margin_x * 2;
    let height = this.height - margin_y * 2;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    let x = this.x + margin_x;
    let y = this.y + this.height - margin_y;
    ctx.moveTo(x, y);
    this.drawing_pos.map((p) => ctx.lineTo(x + p[0] * width,
                                           y - p[1] * height));
    ctx.stroke();
  }

  draw_count(count) {
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = 'bold 20px sans-serif';
    this.context.fillStyle = InfectedColors[InfectedState.ASYMPTOMATIC];
    this.context.fillText(count.toString(), this.text_center.x, this.text_center.y);
  }
}
