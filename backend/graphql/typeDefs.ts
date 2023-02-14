import gql from "graphql-tag";

const typeDefs = gql`
  # Auth TypeDefs
  input RegisterStudentInput {
    username: String!
    email: String!
    type: String!
    authType: String!
    password: String!
  }

  input RegisterTeacherInput {
    username: String!
    email: String!
    type: String!
    password: String!
    teacherCode: String!
  }

  # Student & Teacher Schemas
  type Student {
    id: ID!
    type: String!
    authType: String!
    username: String!
    email: String!
    password: String!
    profilePic: String!,
    grade: Int!,
    school: String!,
    courses: [Course!]
  }

  type Teacher {
    id: ID!
    type: String!
    username: String!
    email: String!
    password: String!
    profilePic: String!,
    school: String!,
    courses: [Course!]
  }

  type TeacherCode {
    id: ID!
    code: String!
  }

  # Course Types
  type Course {
    id: ID!
    name: String!
    description: String!
    teacherID: ID!
    courseCode: String!
    courseLink: String!
    numOfStudents: Int!
    nodes: [Node]!
  }

  type Status {
    studentID: ID!
    nodeID: ID!
    state: String!
  }

  type Node {
    id: ID!
    positionID: String!
    type: String!
    name: String!
    skills: [String]!
    parent: [String]!
    description: String!
    assignments: [Assignment]!
    resources: [Resource]!
    status: [Status]!
    course: ID!
  }

  input InputMCQuestion {
    question: String!
    answerChoices: [String]!
    answers: [Boolean]!
    imagePicObj: String!
  }

  type MCQuestion {
    question: String!
    answerChoices: [String]!
    answers: [Boolean]!
    imagePicObj: String!
  }

  type Resource {
    resourceName: String!
    type: String!
    link: String!
  }

  type Assignment {
    type: String!
    name: String!
    questions: [MCQuestion]!
    studentScores: [AssignmentScore]! 
    resources: [Resource]!
  }

  type AssignmentScore {
    nodeID: ID!
    studentID: ID!
    studentScore: Float!
  }

  type AuthData {
    userID: ID!
    authType: String!
    type: String!
    accessToken: String!
    refreshToken: String!
    tokenExpiration: Int!
  }

  type Query {
    getStudents: [Student]
    getStudent(id: ID!): Student
    getTeachers: [Teacher]
    getTeacher(id: ID!): Teacher
    getCourse(id: ID!): Course
  }

  type Mutation {
    logout: Boolean!
    loginStudent(email: String!, password: String!): AuthData!
    getStudentsBasedOnCourse(courseID: ID!): [Student]
    loginTeacher(email: String!, password: String!): AuthData!
    registerStudent(registerStudentInput: RegisterStudentInput!): AuthData!
    registerTeacher(registerTeacherInput: RegisterTeacherInput!): AuthData!
    setStudentProfile(id: ID!, profilePicURL: String!, grade: Int!, school: String!): Student!
    setTeacherProfile(id: ID!, profilePicURL: String!, school: String!): Teacher!
    editProfile(id: ID!, type: String!, name: String, email: String, grade: Int, school: String, profilePicURL: String): Boolean!
    createCourse(name: String!, description: String!, id: ID!, courseCode: String!): Course
    getCoursesBasedOnID(id: ID!): [Course]
    joinCourse(id: ID!, courseCode: String!): Student
    deleteCourse(id: ID!, teacherID: ID!): Boolean!
    deleteNode(positionID: String!, course: ID!): Boolean!
    updateNode(id: ID!, newName: String!): Node
    getTwoNodesInProgress(courseID: ID!, studentID: ID!): [Node]
    addResourceToNode(id: ID!, resourceName: String!, type: String!, link: String!): Resource!  
    addStatusToNode(studentID: ID!, nodeID: ID!, state: String!): Status!  
    deleteResourceFromNode(id: ID!, resourceName: String!): Resource!
    getNodesBasedOnCourse(courseID: ID!): [Node]
    addTeacherCodes(number: Int!): [TeacherCode]
    addNode(
      positionID: String!
      type: String!
      name: String!
      skills: [String]
      parent: [String]!
      description: String!
      assignments: [String]
      course: ID!
    ): Node
    addNodesFromSpreadSheet(nodes: String!, course: ID!): Course
    addMCQAssignment(
      node: ID!
      name: String!
      type: String!
      questions: [InputMCQuestion]!
    ): Assignment
    deleteMCQAssignment(id: ID!, name: String!): Assignment
    addStudentScoreToAssignment(
      nodeID: ID!
      studentID: ID!
      studentScore: Float!
      nameOfAssignment: String!
    ): AssignmentScore
  }
`;

export default typeDefs;
