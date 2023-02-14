import { Node, INode } from "../../models/Node";
import { Course, ICourse } from "../../models/Course";
import { IResource  } from "../../models/Resource";
import { Student } from "../../models/Student";

const toLowerKeys = (obj) => {
  // 👇️ [ ['NAME', 'Tom'], ['AGE', 30] ]
  const entries = Object.entries(obj);

  return Object.fromEntries(
    entries.map(([key, value]) => {
      return [key.toLowerCase(), value];
    }),
  );
}


const nodeResolver = {
  Query: {
  },
  Mutation: {
    getNodesBasedOnCourse: async (_, { courseID }, context) => {
      if (!context.req.isAuth) {
        return new Error("Not Authenticated!");
      }

      const nodes = await Node.find({course: courseID});
    
      return nodes;
    },
    getTwoNodesInProgress: async (_, { courseID, studentID }, context) => {
      if (!context.req.isAuth) {
        return new Error("Not Authenticated!");
      }

      let nodes = await Node.find({ course: courseID, "assignments.0": { "$exists": true } });
      // console.log("Nodes: ",nodes);

      if(nodes.length === 1)
        return [nodes[0]];
      else if(nodes.length == 2)
        return [nodes[0], nodes[1]];
      else if(nodes.length > 3){
        for(let i = nodes.length - 1; i > 0; i--) {
          let randInt = Math.floor(Math.random() * (nodes.length));
          [nodes[i], nodes[randInt]] = [nodes[randInt], nodes[i]]
        }
        return [nodes[0], nodes[1]];
      }

      return [];
    },
    updateNode: async (_, {id, newName}, context, info) => {
      if(!context.req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }
      
      let node = await Node.findOne({_id: id})

      node.name = newName;
      node.markModified("name");
      node.save();

      return node;
    },
    addStatusToNode: async (_, { studentID, nodeID, state }, context, info) => {
      if(!context.req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      let student = await Student.findById(studentID);

      if(!student) {
        return new Error("Student not found");
      }

      let node = await Node.findById(nodeID);

      if(!node) {
        return new Error("Node not found");
      }

      let index = -1;
      for(let i = 0; i < node.status.length; i++) {
        if(node.status[i].studentID == studentID) {
          index = i;
          break;
        }
      }
      let status = {
        studentID: studentID,
        nodeID: nodeID,
        state: state
      }

      if(index == -1) {
        let status = {
          studentID: studentID,
          nodeID: nodeID,
          state: state
        }
        node.status.push(status);
      }
      else {
        node.status[index].state = state;
      }

      // let status = {
      //   studentID: studentID,
      //   nodeID: nodeID,
      //   state: state
      // }
      // node.status.push(status);
      node.markModified("status")
      await node.save();

      return (index === -1 ? status : node.status[index]);
    },
    addNode: async (
      _,
      {
        positionID,
        name,
        type,
        skills,
        parent,
        description,
        assignments,
        course,
      },
      context,
      info
    ) => {
      if(!context.req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      let node: INode = await Node.findOne({
        positionID: positionID,
        course: course,
      });

      if (node) {
        return new Error("This is Node already exists");
      }

      const newNode: INode = new Node({
        positionID: positionID,
        name: name,
        type: type,
        skills: skills,
        parent: parent,
        description: description,
        assignments: assignments,
        course: course,
        resources: [],
        status: []
      });

      await Course.updateOne(
        { _id: course },
        { $addToSet: { nodes: newNode } }
      );

      let result = await newNode.save();

      return result;
    },
    deleteNode: async (
      _,
      {
        positionID,
        course,
      },
      context,
      info
    ) => {
      if(!context.req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      let nodesRemoved = await Node.deleteMany({course: course, parent: {"$in": positionID}});
      let currNodeRemoved = await Node.deleteMany({course: course, positionID: positionID}); 

      let nodes = await Node.find({course: course});
      let currCourse: ICourse = await Course.findOne({_id: course}).populate("nodes");

      if(!nodes) 
        nodes = []
        
      currCourse.nodes = nodes;
      currCourse.markModified("nodes")
      await currCourse.save();


      return true;
    },
    addNodesFromSpreadSheet: async (_, { nodes, course }, {req, res}, info) => {
      if(!req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      let parsedNodes = JSON.parse(JSON.parse(nodes));
      let objs: any[] = [];
      for(let i = 0; i < parsedNodes.length; i++) {
        objs.push(toLowerKeys(parsedNodes[i]));
      }
      
      await objs.forEach(async (obj) => {
        let directParent = obj.id;
        let parents = [];
        for (let i = 1; i < directParent.length; i++) {
          parents.push(directParent.substring(0, i));
        }
        let node = await Node.findOne({
          positionID: directParent,
          course: course,
        });
        if (node) {
          return new Error(
            "There are duplicate IDs. Make sure to give nodes unique IDs"
          );
        }
        const newNode: INode = new Node({
          positionID: obj.id,
          name: obj.name,
          type: obj.type,
          skills: obj.skills,
          parent: parents,
          description: (!obj.description ? "-1": obj.description),
          assignments: [],
          course: course,
          resources: [],
          status: []
        });
        await Course.updateOne(
          { _id: course },
          { $addToSet: { nodes: newNode } }
        );
        let result = await newNode.save();
      });
      let currCourse: ICourse = await Course.findOne({_id: course});
      return currCourse;
    },
    deleteResourceFromNode: async (_, { id, resourceName }, {req, res}, info) => {
      if(!req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      let node = await Node.findById(id);
  
      if(!node) {
        return new Error("Node does not exist");
      }
  
      let index = -1;
      for(let i = 0; i < node.resources.length; i++) {
        if(node.resources[i].resourceName === resourceName) {
          index = i;
          break;
        }
      }
  
      if(index === -1) 
        return new Error("Resource does not exist");
  
      let resource = node.resources[index];
      node.resources.splice(index, 1);
      node.markModified("resources");
      await node.save()
  
      return resource;
    },
    addResourceToNode: async (_, { id, resourceName, type, link }, {req, res}, info) => {
      if(!req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }
      
      let node = await Node.findById(id);
      // console.log(node);
      if(!node) {
        return new Error("This node does exist.")
      }

      let resource: IResource = {
        resourceName: resourceName,
        type: type,
        link: link,
      }

      node.resources.push(resource);
      node.markModified("resources")
      await node.save()

      return resource;
    },
  }
};

export default nodeResolver;
