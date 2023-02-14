class Node {
  type: string;
  name: string;
  children: Array<any>; // TODO: might be able to remove this field
  parent: Array<string>;
  data: { id: string, dbID: string, label: string, assignments: [], resources: [], status: [], description: string};
  locked: boolean;
  grabbable: boolean;
  position: { x: number, y: number };

  constructor(type: string, name: string, children: Array<any>, parent: Array<string>, data: { id: string, dbID: string, label: string, assignments: [], resources: [], status: [], description: string }, locked: boolean, grabbable: boolean, position: { x: number, y: number }) {
    this.type = type;
    this.name = name;
    this.children = children;
    this.parent = parent;
    this.data = data;
    this.locked = locked;
    this.grabbable = grabbable;
    this.position = position;
  }
}



export default Node;
