import gql from "graphql-tag";

const GET_STUDENT_DETAILS = gql`
  query ($id: ID!) {
    getStudent(id: $id) {
      id
      username
      email
      type
      courses {
        name
        courseCode
        description
        courseLink
        id
        teacherID
      }
    }
  }
`;

const GET_TEACHER_DETAILS = gql`
  query ($id: ID!) {
    getTeacher(id: $id) {
      username
      email
      id
      type
      courses {
        name
        courseCode
        description
        courseLink
        id
        teacherID
      }
    }
  }
`;

const GET_COURSE_DETAILS = gql`
  query ($id: ID!) {
    getCourse(id: $id) {
      id
      name
      courseCode
      courseLink
      description
      teacherID
      nodes {
        name
        type
        id
        course
        assignments
        parent
        skills
        description
        positionID
      }
    }
  }
`;
export { GET_STUDENT_DETAILS, GET_TEACHER_DETAILS, GET_COURSE_DETAILS };
