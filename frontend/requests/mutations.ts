import gql from "graphql-tag";

const REGISTER_STUDENT = gql`
  mutation registerStudent(
    $username: String!
    $email: String!
    $type: String!
  ) {
    registerStudent(
      registerStudentInput: { username: $username, email: $email, type: $type }
    ) {
      id
      username
      email
      type
    }
  }
`;

const REGISTER_TEACHER = gql`
  mutation registerTeacher(
    $username: String!
    $email: String!
    $type: String!
  ) {
    registerTeacher(
      registerTeacherInput: { username: $username, email: $email, type: $type }
    ) {
      id
      username
      email
      type
    }
  }
`;

const CREATE_COURSE = gql`
  mutation CreateCourseMutation(
    $name: String!
    $description: String!
    $teacherID: ID!
  ) {
    createCourse(name: $name, description: $description, id: $teacherID) {
      name
      courseCode
      description
      courseLink
      id
      teacherID
    }
  }
`;

const JOIN_COURSE = gql`
  mutation JoinCourseMutation($id: ID!, $courseCode: String!) {
    joinCourse(id: $id, courseCode: $courseCode) {
      username
      email
      courses {
        id
        name
        courseCode
        courseLink
        description
        teacherID
      }
    }
  }
`;

const ADD_NODE = gql`
  mutation addNode(
    $positionID: String!
    $type: String!
    $name: String!
    $parent: [String]!
    $description: String!
    $course: ID!
  ) {
    addNode(
      positionID: $positionID
      type: $type
      name: $name
      parent: $parent
      description: $description
      course: $course
    ) {
      name
      assignments
      course
      description
      type
      parent
      skills
      positionID
    }
  }
`;

const ADD_NODES_FROM_SPREADSHEET = gql`
  mutation AddNodesFromSpreadSheetMutation($course_id: ID!, $nodes: String!) {
    addNodesFromSpreadSheet(course: $course_id, nodes: $nodes) {
      name
      courseCode
      teacherID
    }
  }
`;

export {
  REGISTER_STUDENT,
  REGISTER_TEACHER,
  CREATE_COURSE,
  JOIN_COURSE,
  ADD_NODE,
  ADD_NODES_FROM_SPREADSHEET,
};
