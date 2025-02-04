export class Position {
  x: number = 0;
  y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  addPosition(posAdd: Position) {
    this.x += posAdd.x;
    this.y += posAdd.y;
  }
}
