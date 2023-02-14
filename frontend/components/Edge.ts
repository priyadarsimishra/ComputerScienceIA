class Edge {
  type: string;
  id: string;
  source: string;
  target: string;

  constructor(type: string, id: string, source: string, target: string) {
    this.type = type;
    this.id = id;
    this.source = source;
    this.target = target;
  }
}

export default Edge;
