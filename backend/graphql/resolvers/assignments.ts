import { IAssignment } from "models/Assignment";
import { Node, INode } from "../../models/Node";

const assignmentsResolver = {
  Query: {},
  Mutation: {
    addMCQAssignment: async (
      _,
      { node, name, type, questions },
      { req, res },
      info
    ) => {
      // TODO: add check auth code
      if (!req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }
      const nodeToBeAssignedTo: INode = await Node.findOne({ _id: node });

      if (!nodeToBeAssignedTo) {
        throw new Error("No such Node Exists in the Graph!");
      }

      let assignment: IAssignment = {
        name: name,
        type: type,
        questions: questions,
        studentScores: [],
      };

      // for(let i = 0; i < nodeToBeAssignedTo.assignments.length; i++){
      //   if(nodeToBeAssignedTo.assignments[i].name === assignment.name)
      //     throw new Error ("This assignment is already part of this assignment!");
      // }

      nodeToBeAssignedTo.assignments.push(assignment);

      await nodeToBeAssignedTo.save();

      return nodeToBeAssignedTo.assignments[
        nodeToBeAssignedTo.assignments.length - 1
      ];
    },
    deleteMCQAssignment: async (
      _,
      { id, name },
      { req, res },
      info
    ) => {
      // TODO: add check auth code
      if (!req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }
      let node = await Node.findById(id);
  
      if(!node) {
        return new Error("Node does not exist");
      }
  
      let index = -1;
      for(let i = 0; i < node.assignments.length; i++) {
        if(node.assignments[i].name === name) {
          index = i;
          break;
        }
      }
  
      if(index === -1) 
        return new Error("Resource does not exist");
  
      let assignment = node.assignments[index];
      node.assignments.splice(index, 1);
      node.markModified("assignments");
      await node.save()
  
      return assignment;
    },
    addStudentScoreToAssignment: async (
      _,
      { nodeID, studentID, studentScore, nameOfAssignment },
      { req, res },
      info
    ) => {
      if (!req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      const node: INode = await Node.findOne({ _id: nodeID });

      if(!node) throw new Error("No such Node Exists in the Graph!");

      let index;

      for (let i = 0; i < node?.assignments.length; i++) {
        if (node.assignments[i].name === nameOfAssignment) {
          index = i;
          break;
        }
      }

      // TODO: check if name of assignment doesn't exist

      let studentScoreObj: any = {
        nodeID: nodeID,
        studentID: studentID,
        studentScore: studentScore,
      };

      // Modifies previous student score - TODO: just confirm later it works
      if(node.assignments[index].studentScores.length !== 0)
      { 
        for(let i = 0; i < node?.assignments[index].studentScores.length; i++)
        { 
          if(node.assignments[index].studentScores[i].studentID == studentID && node.assignments[index].studentScores[i].studentScore < studentScore)
          { 
            node.assignments[index].studentScores[i] = studentScoreObj;
            await node.markModified('assignments');
            await node.save();
            return node.assignments[index].studentScores[i];
          }
          else if(node.assignments[index].studentScores[i].studentID == studentID && node.assignments[index].studentScores[i].studentScore >= studentScore)
          {
            return node.assignments[index].studentScores[i];
          }
        }
      }
      
      // adding a new assignment's scores
      if(node.assignments[index].studentScores.length == 0)
      {
        node.assignments[index].studentScores = [studentScoreObj];
      }
      else
      { 
        node.assignments[index].studentScores?.push(studentScoreObj);
      }
      
      // console.log(node.assignments[index].studentScores)
      await node.markModified('assignments');
      await node.save();
      
      return node.assignments[index].studentScores[
        node.assignments[index].studentScores?.length - 1
      ];
    },
  },
};

export default assignmentsResolver;
