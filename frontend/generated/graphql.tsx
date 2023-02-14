import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Assignment = {
  __typename?: 'Assignment';
  name: Scalars['String'];
  questions: Array<Maybe<McQuestion>>;
  resources: Array<Maybe<Resource>>;
  studentScores: Array<Maybe<AssignmentScore>>;
  type: Scalars['String'];
};

export type AssignmentScore = {
  __typename?: 'AssignmentScore';
  nodeID: Scalars['ID'];
  studentID: Scalars['ID'];
  studentScore: Scalars['Float'];
};

export type AuthData = {
  __typename?: 'AuthData';
  accessToken: Scalars['String'];
  authType: Scalars['String'];
  refreshToken: Scalars['String'];
  tokenExpiration: Scalars['Int'];
  type: Scalars['String'];
  userID: Scalars['ID'];
};

export type Course = {
  __typename?: 'Course';
  courseCode: Scalars['String'];
  courseLink: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nodes: Array<Maybe<Node>>;
  numOfStudents: Scalars['Int'];
  teacherID: Scalars['ID'];
};

export type InputMcQuestion = {
  answerChoices: Array<InputMaybe<Scalars['String']>>;
  answers: Array<InputMaybe<Scalars['Boolean']>>;
  imagePicObj: Scalars['String'];
  question: Scalars['String'];
};

export type McQuestion = {
  __typename?: 'MCQuestion';
  answerChoices: Array<Maybe<Scalars['String']>>;
  answers: Array<Maybe<Scalars['Boolean']>>;
  imagePicObj: Scalars['String'];
  question: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMCQAssignment?: Maybe<Assignment>;
  addNode?: Maybe<Node>;
  addNodesFromSpreadSheet?: Maybe<Course>;
  addResourceToNode: Resource;
  addStatusToNode: Status;
  addStudentScoreToAssignment?: Maybe<AssignmentScore>;
  addTeacherCodes?: Maybe<Array<Maybe<TeacherCode>>>;
  createCourse?: Maybe<Course>;
  deleteMCQAssignment?: Maybe<Assignment>;
  deleteNode: Scalars['Boolean'];
  deleteResourceFromNode: Resource;
  editProfile: Scalars['Boolean'];
  getCoursesBasedOnID?: Maybe<Array<Maybe<Course>>>;
  getNodesBasedOnCourse?: Maybe<Array<Maybe<Node>>>;
  getStudentsBasedOnCourse?: Maybe<Array<Maybe<Student>>>;
  getTwoNodesInProgress?: Maybe<Array<Maybe<Node>>>;
  joinCourse?: Maybe<Student>;
  loginStudent: AuthData;
  loginTeacher: AuthData;
  logout: Scalars['Boolean'];
  registerStudent: AuthData;
  registerTeacher: AuthData;
  setStudentProfile: Student;
  setTeacherProfile: Teacher;
  updateNode?: Maybe<Node>;
};


export type MutationAddMcqAssignmentArgs = {
  name: Scalars['String'];
  node: Scalars['ID'];
  questions: Array<InputMaybe<InputMcQuestion>>;
  type: Scalars['String'];
};


export type MutationAddNodeArgs = {
  assignments?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  course: Scalars['ID'];
  description: Scalars['String'];
  name: Scalars['String'];
  parent: Array<InputMaybe<Scalars['String']>>;
  positionID: Scalars['String'];
  skills?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type: Scalars['String'];
};


export type MutationAddNodesFromSpreadSheetArgs = {
  course: Scalars['ID'];
  nodes: Scalars['String'];
};


export type MutationAddResourceToNodeArgs = {
  id: Scalars['ID'];
  link: Scalars['String'];
  resourceName: Scalars['String'];
  type: Scalars['String'];
};


export type MutationAddStatusToNodeArgs = {
  nodeID: Scalars['ID'];
  state: Scalars['String'];
  studentID: Scalars['ID'];
};


export type MutationAddStudentScoreToAssignmentArgs = {
  nameOfAssignment: Scalars['String'];
  nodeID: Scalars['ID'];
  studentID: Scalars['ID'];
  studentScore: Scalars['Float'];
};


export type MutationAddTeacherCodesArgs = {
  number: Scalars['Int'];
};


export type MutationCreateCourseArgs = {
  courseCode: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationDeleteMcqAssignmentArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationDeleteNodeArgs = {
  course: Scalars['ID'];
  positionID: Scalars['String'];
};


export type MutationDeleteResourceFromNodeArgs = {
  id: Scalars['ID'];
  resourceName: Scalars['String'];
};


export type MutationEditProfileArgs = {
  email?: InputMaybe<Scalars['String']>;
  grade?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  profilePicURL?: InputMaybe<Scalars['String']>;
  school?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};


export type MutationGetCoursesBasedOnIdArgs = {
  id: Scalars['ID'];
};


export type MutationGetNodesBasedOnCourseArgs = {
  courseID: Scalars['ID'];
};


export type MutationGetStudentsBasedOnCourseArgs = {
  courseID: Scalars['ID'];
};


export type MutationGetTwoNodesInProgressArgs = {
  courseID: Scalars['ID'];
  studentID: Scalars['ID'];
};


export type MutationJoinCourseArgs = {
  courseCode: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationLoginStudentArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginTeacherArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterStudentArgs = {
  registerStudentInput: RegisterStudentInput;
};


export type MutationRegisterTeacherArgs = {
  registerTeacherInput: RegisterTeacherInput;
};


export type MutationSetStudentProfileArgs = {
  grade: Scalars['Int'];
  id: Scalars['ID'];
  profilePicURL: Scalars['String'];
  school: Scalars['String'];
};


export type MutationSetTeacherProfileArgs = {
  id: Scalars['ID'];
  profilePicURL: Scalars['String'];
  school: Scalars['String'];
};


export type MutationUpdateNodeArgs = {
  id: Scalars['ID'];
  newName: Scalars['String'];
};

export type Node = {
  __typename?: 'Node';
  assignments: Array<Maybe<Assignment>>;
  course: Scalars['ID'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  parent: Array<Maybe<Scalars['String']>>;
  positionID: Scalars['String'];
  resources: Array<Maybe<Resource>>;
  skills: Array<Maybe<Scalars['String']>>;
  status: Array<Maybe<Status>>;
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCourse?: Maybe<Course>;
  getStudent?: Maybe<Student>;
  getStudents?: Maybe<Array<Maybe<Student>>>;
  getTeacher?: Maybe<Teacher>;
  getTeachers?: Maybe<Array<Maybe<Teacher>>>;
};


export type QueryGetCourseArgs = {
  id: Scalars['ID'];
};


export type QueryGetStudentArgs = {
  id: Scalars['ID'];
};


export type QueryGetTeacherArgs = {
  id: Scalars['ID'];
};

export type RegisterStudentInput = {
  authType: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  type: Scalars['String'];
  username: Scalars['String'];
};

export type RegisterTeacherInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  teacherCode: Scalars['String'];
  type: Scalars['String'];
  username: Scalars['String'];
};

export type Resource = {
  __typename?: 'Resource';
  link: Scalars['String'];
  resourceName: Scalars['String'];
  type: Scalars['String'];
};

export type Status = {
  __typename?: 'Status';
  nodeID: Scalars['ID'];
  state: Scalars['String'];
  studentID: Scalars['ID'];
};

export type Student = {
  __typename?: 'Student';
  authType: Scalars['String'];
  courses?: Maybe<Array<Course>>;
  email: Scalars['String'];
  grade: Scalars['Int'];
  id: Scalars['ID'];
  password: Scalars['String'];
  profilePic: Scalars['String'];
  school: Scalars['String'];
  type: Scalars['String'];
  username: Scalars['String'];
};

export type Teacher = {
  __typename?: 'Teacher';
  courses?: Maybe<Array<Course>>;
  email: Scalars['String'];
  id: Scalars['ID'];
  password: Scalars['String'];
  profilePic: Scalars['String'];
  school: Scalars['String'];
  type: Scalars['String'];
  username: Scalars['String'];
};

export type TeacherCode = {
  __typename?: 'TeacherCode';
  code: Scalars['String'];
  id: Scalars['ID'];
};

export type AddMcqAssignmentMutationVariables = Exact<{
  node: Scalars['ID'];
  name: Scalars['String'];
  type: Scalars['String'];
  questions: Array<InputMaybe<InputMcQuestion>> | InputMaybe<InputMcQuestion>;
}>;


export type AddMcqAssignmentMutation = { __typename?: 'Mutation', addMCQAssignment?: { __typename?: 'Assignment', name: string, type: string, questions: Array<{ __typename?: 'MCQuestion', question: string, answerChoices: Array<string | null | undefined>, answers: Array<boolean | null | undefined> } | null | undefined> } | null | undefined };

export type AddNodeMutationVariables = Exact<{
  positionID: Scalars['String'];
  type: Scalars['String'];
  name: Scalars['String'];
  parent: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
  description: Scalars['String'];
  course: Scalars['ID'];
}>;


export type AddNodeMutation = { __typename?: 'Mutation', addNode?: { __typename?: 'Node', name: string, course: string, description: string, type: string, parent: Array<string | null | undefined>, skills: Array<string | null | undefined>, positionID: string, assignments: Array<{ __typename?: 'Assignment', name: string } | null | undefined> } | null | undefined };

export type AddNodesFromSpreadSheetMutationMutationVariables = Exact<{
  course_id: Scalars['ID'];
  nodes: Scalars['String'];
}>;


export type AddNodesFromSpreadSheetMutationMutation = { __typename?: 'Mutation', addNodesFromSpreadSheet?: { __typename?: 'Course', name: string, courseCode: string, teacherID: string } | null | undefined };

export type AddResourceToNodeMutationVariables = Exact<{
  id: Scalars['ID'];
  resourceName: Scalars['String'];
  type: Scalars['String'];
  link: Scalars['String'];
}>;


export type AddResourceToNodeMutation = { __typename?: 'Mutation', addResourceToNode: { __typename?: 'Resource', type: string, resourceName: string, link: string } };

export type AddStatusToNodeMutationVariables = Exact<{
  studentId: Scalars['ID'];
  nodeId: Scalars['ID'];
  state: Scalars['String'];
}>;


export type AddStatusToNodeMutation = { __typename?: 'Mutation', addStatusToNode: { __typename?: 'Status', nodeID: string, studentID: string, state: string } };

export type AddStudentScoreToAssignmentMutationVariables = Exact<{
  nodeID: Scalars['ID'];
  studentID: Scalars['ID'];
  studentScore: Scalars['Float'];
  nameOfAssignment: Scalars['String'];
}>;


export type AddStudentScoreToAssignmentMutation = { __typename?: 'Mutation', addStudentScoreToAssignment?: { __typename?: 'AssignmentScore', nodeID: string, studentID: string, studentScore: number } | null | undefined };

export type CreateCourseMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
  teacherID: Scalars['ID'];
  courseCode: Scalars['String'];
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse?: { __typename?: 'Course', name: string, courseCode: string, description: string, courseLink: string, id: string, teacherID: string } | null | undefined };

export type DeleteMcqAssignmentMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
}>;


export type DeleteMcqAssignmentMutation = { __typename?: 'Mutation', deleteMCQAssignment?: { __typename?: 'Assignment', name: string, type: string } | null | undefined };

export type MutationMutationVariables = Exact<{
  positionID: Scalars['String'];
  course: Scalars['ID'];
}>;


export type MutationMutation = { __typename?: 'Mutation', deleteNode: boolean };

export type DeleteResourceFromNodeMutationVariables = Exact<{
  id: Scalars['ID'];
  resourceName: Scalars['String'];
}>;


export type DeleteResourceFromNodeMutation = { __typename?: 'Mutation', deleteResourceFromNode: { __typename?: 'Resource', link: string, resourceName: string, type: string } };

export type EditProfileMutationVariables = Exact<{
  id: Scalars['ID'];
  type: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  grade?: InputMaybe<Scalars['Int']>;
  school?: InputMaybe<Scalars['String']>;
  profilePicURL?: InputMaybe<Scalars['String']>;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: boolean };

export type GetCoursesBasedOnIdMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCoursesBasedOnIdMutation = { __typename?: 'Mutation', getCoursesBasedOnID?: Array<{ __typename?: 'Course', id: string, name: string, description: string, courseCode: string, courseLink: string, nodes: Array<{ __typename?: 'Node', name: string, description: string, id: string, parent: Array<string | null | undefined>, positionID: string, skills: Array<string | null | undefined>, type: string, status: Array<{ __typename?: 'Status', nodeID: string, studentID: string, state: string } | null | undefined>, resources: Array<{ __typename?: 'Resource', resourceName: string, type: string, link: string } | null | undefined>, assignments: Array<{ __typename?: 'Assignment', name: string, studentScores: Array<{ __typename?: 'AssignmentScore', nodeID: string, studentID: string, studentScore: number } | null | undefined> } | null | undefined> } | null | undefined> } | null | undefined> | null | undefined };

export type GetCourseDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCourseDetailsQuery = { __typename?: 'Query', getCourse?: { __typename?: 'Course', id: string, name: string, courseCode: string, courseLink: string, description: string, teacherID: string, numOfStudents: number, nodes: Array<{ __typename?: 'Node', name: string, type: string, description: string, id: string, course: string, parent: Array<string | null | undefined>, skills: Array<string | null | undefined>, positionID: string, status: Array<{ __typename?: 'Status', nodeID: string, studentID: string, state: string } | null | undefined>, resources: Array<{ __typename?: 'Resource', resourceName: string, type: string, link: string } | null | undefined>, assignments: Array<{ __typename?: 'Assignment', name: string, type: string, questions: Array<{ __typename?: 'MCQuestion', question: string, answerChoices: Array<string | null | undefined>, answers: Array<boolean | null | undefined>, imagePicObj: string } | null | undefined>, studentScores: Array<{ __typename?: 'AssignmentScore', nodeID: string, studentID: string, studentScore: number } | null | undefined> } | null | undefined> } | null | undefined> } | null | undefined };

export type GetNodesBasedOnCourseMutationVariables = Exact<{
  courseID: Scalars['ID'];
}>;


export type GetNodesBasedOnCourseMutation = { __typename?: 'Mutation', getNodesBasedOnCourse?: Array<{ __typename?: 'Node', name: string, type: string, description: string, id: string, course: string, parent: Array<string | null | undefined>, status: Array<{ __typename?: 'Status', nodeID: string, studentID: string, state: string } | null | undefined>, resources: Array<{ __typename?: 'Resource', resourceName: string, type: string, link: string } | null | undefined>, assignments: Array<{ __typename?: 'Assignment', name: string, type: string, questions: Array<{ __typename?: 'MCQuestion', question: string, answerChoices: Array<string | null | undefined>, answers: Array<boolean | null | undefined>, imagePicObj: string } | null | undefined>, studentScores: Array<{ __typename?: 'AssignmentScore', nodeID: string, studentID: string, studentScore: number } | null | undefined> } | null | undefined> } | null | undefined> | null | undefined };

export type GetStudentDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetStudentDetailsQuery = { __typename?: 'Query', getStudent?: { __typename?: 'Student', id: string, username: string, email: string, type: string, profilePic: string, grade: number, school: string, courses?: Array<{ __typename?: 'Course', name: string, courseCode: string, description: string, courseLink: string, id: string, teacherID: string }> | null | undefined } | null | undefined };

export type GetStudentsBasedOnCourseMutationVariables = Exact<{
  courseID: Scalars['ID'];
}>;


export type GetStudentsBasedOnCourseMutation = { __typename?: 'Mutation', getStudentsBasedOnCourse?: Array<{ __typename?: 'Student', id: string, username: string, email: string, profilePic: string, grade: number, school: string } | null | undefined> | null | undefined };

export type GetTeacherDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTeacherDetailsQuery = { __typename?: 'Query', getTeacher?: { __typename?: 'Teacher', username: string, email: string, id: string, type: string, profilePic: string, school: string, courses?: Array<{ __typename?: 'Course', name: string, courseCode: string, description: string, courseLink: string, id: string, teacherID: string, numOfStudents: number }> | null | undefined } | null | undefined };

export type GetTwoNodesInProgressMutationVariables = Exact<{
  courseID: Scalars['ID'];
  studentID: Scalars['ID'];
}>;


export type GetTwoNodesInProgressMutation = { __typename?: 'Mutation', getTwoNodesInProgress?: Array<{ __typename?: 'Node', id: string, name: string, description: string, parent: Array<string | null | undefined>, positionID: string, assignments: Array<{ __typename?: 'Assignment', studentScores: Array<{ __typename?: 'AssignmentScore', studentID: string, studentScore: number } | null | undefined> } | null | undefined> } | null | undefined> | null | undefined };

export type JoinCourseMutationVariables = Exact<{
  id: Scalars['ID'];
  courseCode: Scalars['String'];
}>;


export type JoinCourseMutation = { __typename?: 'Mutation', joinCourse?: { __typename?: 'Student', username: string, email: string, courses?: Array<{ __typename?: 'Course', id: string, name: string, courseCode: string, courseLink: string, description: string, teacherID: string }> | null | undefined } | null | undefined };

export type LoginStudentMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginStudentMutation = { __typename?: 'Mutation', loginStudent: { __typename?: 'AuthData', userID: string, tokenExpiration: number, accessToken: string, refreshToken: string } };

export type LoginTeacherMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginTeacherMutation = { __typename?: 'Mutation', loginTeacher: { __typename?: 'AuthData', userID: string, tokenExpiration: number, accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterStudentMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  type: Scalars['String'];
  authType: Scalars['String'];
}>;


export type RegisterStudentMutation = { __typename?: 'Mutation', registerStudent: { __typename?: 'AuthData', userID: string, authType: string, accessToken: string, refreshToken: string, type: string, tokenExpiration: number } };

export type RegisterTeacherMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  type: Scalars['String'];
  teacherCode: Scalars['String'];
}>;


export type RegisterTeacherMutation = { __typename?: 'Mutation', registerTeacher: { __typename?: 'AuthData', userID: string, accessToken: string, refreshToken: string, type: string, tokenExpiration: number } };

export type SetStudentProfileMutationVariables = Exact<{
  id: Scalars['ID'];
  profilePicUrl: Scalars['String'];
  grade: Scalars['Int'];
  school: Scalars['String'];
}>;


export type SetStudentProfileMutation = { __typename?: 'Mutation', setStudentProfile: { __typename?: 'Student', username: string, email: string, profilePic: string, school: string } };

export type SetTeacherProfileMutationVariables = Exact<{
  id: Scalars['ID'];
  profilePicUrl: Scalars['String'];
  school: Scalars['String'];
}>;


export type SetTeacherProfileMutation = { __typename?: 'Mutation', setTeacherProfile: { __typename?: 'Teacher', username: string, email: string, profilePic: string, school: string } };

export type UpdateNodeMutationVariables = Exact<{
  id: Scalars['ID'];
  newName: Scalars['String'];
}>;


export type UpdateNodeMutation = { __typename?: 'Mutation', updateNode?: { __typename?: 'Node', name: string, course: string, description: string } | null | undefined };


export const AddMcqAssignmentDocument = gql`
    mutation AddMCQAssignment($node: ID!, $name: String!, $type: String!, $questions: [InputMCQuestion]!) {
  addMCQAssignment(node: $node, name: $name, type: $type, questions: $questions) {
    name
    type
    questions {
      question
      answerChoices
      answers
    }
  }
}
    `;
export type AddMcqAssignmentMutationFn = Apollo.MutationFunction<AddMcqAssignmentMutation, AddMcqAssignmentMutationVariables>;

/**
 * __useAddMcqAssignmentMutation__
 *
 * To run a mutation, you first call `useAddMcqAssignmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMcqAssignmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMcqAssignmentMutation, { data, loading, error }] = useAddMcqAssignmentMutation({
 *   variables: {
 *      node: // value for 'node'
 *      name: // value for 'name'
 *      type: // value for 'type'
 *      questions: // value for 'questions'
 *   },
 * });
 */
export function useAddMcqAssignmentMutation(baseOptions?: Apollo.MutationHookOptions<AddMcqAssignmentMutation, AddMcqAssignmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMcqAssignmentMutation, AddMcqAssignmentMutationVariables>(AddMcqAssignmentDocument, options);
      }
export type AddMcqAssignmentMutationHookResult = ReturnType<typeof useAddMcqAssignmentMutation>;
export type AddMcqAssignmentMutationResult = Apollo.MutationResult<AddMcqAssignmentMutation>;
export type AddMcqAssignmentMutationOptions = Apollo.BaseMutationOptions<AddMcqAssignmentMutation, AddMcqAssignmentMutationVariables>;
export const AddNodeDocument = gql`
    mutation addNode($positionID: String!, $type: String!, $name: String!, $parent: [String]!, $description: String!, $course: ID!) {
  addNode(
    positionID: $positionID
    type: $type
    name: $name
    parent: $parent
    description: $description
    course: $course
  ) {
    name
    assignments {
      name
    }
    course
    description
    type
    parent
    skills
    positionID
  }
}
    `;
export type AddNodeMutationFn = Apollo.MutationFunction<AddNodeMutation, AddNodeMutationVariables>;

/**
 * __useAddNodeMutation__
 *
 * To run a mutation, you first call `useAddNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNodeMutation, { data, loading, error }] = useAddNodeMutation({
 *   variables: {
 *      positionID: // value for 'positionID'
 *      type: // value for 'type'
 *      name: // value for 'name'
 *      parent: // value for 'parent'
 *      description: // value for 'description'
 *      course: // value for 'course'
 *   },
 * });
 */
export function useAddNodeMutation(baseOptions?: Apollo.MutationHookOptions<AddNodeMutation, AddNodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNodeMutation, AddNodeMutationVariables>(AddNodeDocument, options);
      }
export type AddNodeMutationHookResult = ReturnType<typeof useAddNodeMutation>;
export type AddNodeMutationResult = Apollo.MutationResult<AddNodeMutation>;
export type AddNodeMutationOptions = Apollo.BaseMutationOptions<AddNodeMutation, AddNodeMutationVariables>;
export const AddNodesFromSpreadSheetMutationDocument = gql`
    mutation AddNodesFromSpreadSheetMutation($course_id: ID!, $nodes: String!) {
  addNodesFromSpreadSheet(course: $course_id, nodes: $nodes) {
    name
    courseCode
    teacherID
  }
}
    `;
export type AddNodesFromSpreadSheetMutationMutationFn = Apollo.MutationFunction<AddNodesFromSpreadSheetMutationMutation, AddNodesFromSpreadSheetMutationMutationVariables>;

/**
 * __useAddNodesFromSpreadSheetMutationMutation__
 *
 * To run a mutation, you first call `useAddNodesFromSpreadSheetMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNodesFromSpreadSheetMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNodesFromSpreadSheetMutationMutation, { data, loading, error }] = useAddNodesFromSpreadSheetMutationMutation({
 *   variables: {
 *      course_id: // value for 'course_id'
 *      nodes: // value for 'nodes'
 *   },
 * });
 */
export function useAddNodesFromSpreadSheetMutationMutation(baseOptions?: Apollo.MutationHookOptions<AddNodesFromSpreadSheetMutationMutation, AddNodesFromSpreadSheetMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNodesFromSpreadSheetMutationMutation, AddNodesFromSpreadSheetMutationMutationVariables>(AddNodesFromSpreadSheetMutationDocument, options);
      }
export type AddNodesFromSpreadSheetMutationMutationHookResult = ReturnType<typeof useAddNodesFromSpreadSheetMutationMutation>;
export type AddNodesFromSpreadSheetMutationMutationResult = Apollo.MutationResult<AddNodesFromSpreadSheetMutationMutation>;
export type AddNodesFromSpreadSheetMutationMutationOptions = Apollo.BaseMutationOptions<AddNodesFromSpreadSheetMutationMutation, AddNodesFromSpreadSheetMutationMutationVariables>;
export const AddResourceToNodeDocument = gql`
    mutation AddResourceToNode($id: ID!, $resourceName: String!, $type: String!, $link: String!) {
  addResourceToNode(
    id: $id
    resourceName: $resourceName
    type: $type
    link: $link
  ) {
    type
    resourceName
    link
  }
}
    `;
export type AddResourceToNodeMutationFn = Apollo.MutationFunction<AddResourceToNodeMutation, AddResourceToNodeMutationVariables>;

/**
 * __useAddResourceToNodeMutation__
 *
 * To run a mutation, you first call `useAddResourceToNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddResourceToNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addResourceToNodeMutation, { data, loading, error }] = useAddResourceToNodeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      resourceName: // value for 'resourceName'
 *      type: // value for 'type'
 *      link: // value for 'link'
 *   },
 * });
 */
export function useAddResourceToNodeMutation(baseOptions?: Apollo.MutationHookOptions<AddResourceToNodeMutation, AddResourceToNodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddResourceToNodeMutation, AddResourceToNodeMutationVariables>(AddResourceToNodeDocument, options);
      }
export type AddResourceToNodeMutationHookResult = ReturnType<typeof useAddResourceToNodeMutation>;
export type AddResourceToNodeMutationResult = Apollo.MutationResult<AddResourceToNodeMutation>;
export type AddResourceToNodeMutationOptions = Apollo.BaseMutationOptions<AddResourceToNodeMutation, AddResourceToNodeMutationVariables>;
export const AddStatusToNodeDocument = gql`
    mutation AddStatusToNode($studentId: ID!, $nodeId: ID!, $state: String!) {
  addStatusToNode(studentID: $studentId, nodeID: $nodeId, state: $state) {
    nodeID
    studentID
    state
  }
}
    `;
export type AddStatusToNodeMutationFn = Apollo.MutationFunction<AddStatusToNodeMutation, AddStatusToNodeMutationVariables>;

/**
 * __useAddStatusToNodeMutation__
 *
 * To run a mutation, you first call `useAddStatusToNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStatusToNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStatusToNodeMutation, { data, loading, error }] = useAddStatusToNodeMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      nodeId: // value for 'nodeId'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useAddStatusToNodeMutation(baseOptions?: Apollo.MutationHookOptions<AddStatusToNodeMutation, AddStatusToNodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddStatusToNodeMutation, AddStatusToNodeMutationVariables>(AddStatusToNodeDocument, options);
      }
export type AddStatusToNodeMutationHookResult = ReturnType<typeof useAddStatusToNodeMutation>;
export type AddStatusToNodeMutationResult = Apollo.MutationResult<AddStatusToNodeMutation>;
export type AddStatusToNodeMutationOptions = Apollo.BaseMutationOptions<AddStatusToNodeMutation, AddStatusToNodeMutationVariables>;
export const AddStudentScoreToAssignmentDocument = gql`
    mutation AddStudentScoreToAssignment($nodeID: ID!, $studentID: ID!, $studentScore: Float!, $nameOfAssignment: String!) {
  addStudentScoreToAssignment(
    nodeID: $nodeID
    studentID: $studentID
    studentScore: $studentScore
    nameOfAssignment: $nameOfAssignment
  ) {
    nodeID
    studentID
    studentScore
  }
}
    `;
export type AddStudentScoreToAssignmentMutationFn = Apollo.MutationFunction<AddStudentScoreToAssignmentMutation, AddStudentScoreToAssignmentMutationVariables>;

/**
 * __useAddStudentScoreToAssignmentMutation__
 *
 * To run a mutation, you first call `useAddStudentScoreToAssignmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStudentScoreToAssignmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStudentScoreToAssignmentMutation, { data, loading, error }] = useAddStudentScoreToAssignmentMutation({
 *   variables: {
 *      nodeID: // value for 'nodeID'
 *      studentID: // value for 'studentID'
 *      studentScore: // value for 'studentScore'
 *      nameOfAssignment: // value for 'nameOfAssignment'
 *   },
 * });
 */
export function useAddStudentScoreToAssignmentMutation(baseOptions?: Apollo.MutationHookOptions<AddStudentScoreToAssignmentMutation, AddStudentScoreToAssignmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddStudentScoreToAssignmentMutation, AddStudentScoreToAssignmentMutationVariables>(AddStudentScoreToAssignmentDocument, options);
      }
export type AddStudentScoreToAssignmentMutationHookResult = ReturnType<typeof useAddStudentScoreToAssignmentMutation>;
export type AddStudentScoreToAssignmentMutationResult = Apollo.MutationResult<AddStudentScoreToAssignmentMutation>;
export type AddStudentScoreToAssignmentMutationOptions = Apollo.BaseMutationOptions<AddStudentScoreToAssignmentMutation, AddStudentScoreToAssignmentMutationVariables>;
export const CreateCourseDocument = gql`
    mutation CreateCourse($name: String!, $description: String!, $teacherID: ID!, $courseCode: String!) {
  createCourse(
    name: $name
    description: $description
    id: $teacherID
    courseCode: $courseCode
  ) {
    name
    courseCode
    description
    courseLink
    id
    teacherID
  }
}
    `;
export type CreateCourseMutationFn = Apollo.MutationFunction<CreateCourseMutation, CreateCourseMutationVariables>;

/**
 * __useCreateCourseMutation__
 *
 * To run a mutation, you first call `useCreateCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCourseMutation, { data, loading, error }] = useCreateCourseMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      teacherID: // value for 'teacherID'
 *      courseCode: // value for 'courseCode'
 *   },
 * });
 */
export function useCreateCourseMutation(baseOptions?: Apollo.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument, options);
      }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = Apollo.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = Apollo.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
export const DeleteMcqAssignmentDocument = gql`
    mutation DeleteMCQAssignment($id: ID!, $name: String!) {
  deleteMCQAssignment(id: $id, name: $name) {
    name
    type
  }
}
    `;
export type DeleteMcqAssignmentMutationFn = Apollo.MutationFunction<DeleteMcqAssignmentMutation, DeleteMcqAssignmentMutationVariables>;

/**
 * __useDeleteMcqAssignmentMutation__
 *
 * To run a mutation, you first call `useDeleteMcqAssignmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMcqAssignmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMcqAssignmentMutation, { data, loading, error }] = useDeleteMcqAssignmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDeleteMcqAssignmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMcqAssignmentMutation, DeleteMcqAssignmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMcqAssignmentMutation, DeleteMcqAssignmentMutationVariables>(DeleteMcqAssignmentDocument, options);
      }
export type DeleteMcqAssignmentMutationHookResult = ReturnType<typeof useDeleteMcqAssignmentMutation>;
export type DeleteMcqAssignmentMutationResult = Apollo.MutationResult<DeleteMcqAssignmentMutation>;
export type DeleteMcqAssignmentMutationOptions = Apollo.BaseMutationOptions<DeleteMcqAssignmentMutation, DeleteMcqAssignmentMutationVariables>;
export const MutationDocument = gql`
    mutation Mutation($positionID: String!, $course: ID!) {
  deleteNode(positionID: $positionID, course: $course)
}
    `;
export type MutationMutationFn = Apollo.MutationFunction<MutationMutation, MutationMutationVariables>;

/**
 * __useMutationMutation__
 *
 * To run a mutation, you first call `useMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mutationMutation, { data, loading, error }] = useMutationMutation({
 *   variables: {
 *      positionID: // value for 'positionID'
 *      course: // value for 'course'
 *   },
 * });
 */
export function useMutationMutation(baseOptions?: Apollo.MutationHookOptions<MutationMutation, MutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MutationMutation, MutationMutationVariables>(MutationDocument, options);
      }
export type MutationMutationHookResult = ReturnType<typeof useMutationMutation>;
export type MutationMutationResult = Apollo.MutationResult<MutationMutation>;
export type MutationMutationOptions = Apollo.BaseMutationOptions<MutationMutation, MutationMutationVariables>;
export const DeleteResourceFromNodeDocument = gql`
    mutation DeleteResourceFromNode($id: ID!, $resourceName: String!) {
  deleteResourceFromNode(id: $id, resourceName: $resourceName) {
    link
    resourceName
    type
  }
}
    `;
export type DeleteResourceFromNodeMutationFn = Apollo.MutationFunction<DeleteResourceFromNodeMutation, DeleteResourceFromNodeMutationVariables>;

/**
 * __useDeleteResourceFromNodeMutation__
 *
 * To run a mutation, you first call `useDeleteResourceFromNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteResourceFromNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteResourceFromNodeMutation, { data, loading, error }] = useDeleteResourceFromNodeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      resourceName: // value for 'resourceName'
 *   },
 * });
 */
export function useDeleteResourceFromNodeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteResourceFromNodeMutation, DeleteResourceFromNodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteResourceFromNodeMutation, DeleteResourceFromNodeMutationVariables>(DeleteResourceFromNodeDocument, options);
      }
export type DeleteResourceFromNodeMutationHookResult = ReturnType<typeof useDeleteResourceFromNodeMutation>;
export type DeleteResourceFromNodeMutationResult = Apollo.MutationResult<DeleteResourceFromNodeMutation>;
export type DeleteResourceFromNodeMutationOptions = Apollo.BaseMutationOptions<DeleteResourceFromNodeMutation, DeleteResourceFromNodeMutationVariables>;
export const EditProfileDocument = gql`
    mutation EditProfile($id: ID!, $type: String!, $name: String, $email: String, $grade: Int, $school: String, $profilePicURL: String) {
  editProfile(
    id: $id
    type: $type
    name: $name
    email: $email
    grade: $grade
    school: $school
    profilePicURL: $profilePicURL
  )
}
    `;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      type: // value for 'type'
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      grade: // value for 'grade'
 *      school: // value for 'school'
 *      profilePicURL: // value for 'profilePicURL'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const GetCoursesBasedOnIdDocument = gql`
    mutation GetCoursesBasedOnID($id: ID!) {
  getCoursesBasedOnID(id: $id) {
    id
    name
    description
    courseCode
    courseLink
    nodes {
      name
      description
      id
      parent
      positionID
      skills
      status {
        nodeID
        studentID
        state
      }
      resources {
        resourceName
        type
        link
      }
      assignments {
        name
        studentScores {
          nodeID
          studentID
          studentScore
        }
      }
      type
    }
  }
}
    `;
export type GetCoursesBasedOnIdMutationFn = Apollo.MutationFunction<GetCoursesBasedOnIdMutation, GetCoursesBasedOnIdMutationVariables>;

/**
 * __useGetCoursesBasedOnIdMutation__
 *
 * To run a mutation, you first call `useGetCoursesBasedOnIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetCoursesBasedOnIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getCoursesBasedOnIdMutation, { data, loading, error }] = useGetCoursesBasedOnIdMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCoursesBasedOnIdMutation(baseOptions?: Apollo.MutationHookOptions<GetCoursesBasedOnIdMutation, GetCoursesBasedOnIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetCoursesBasedOnIdMutation, GetCoursesBasedOnIdMutationVariables>(GetCoursesBasedOnIdDocument, options);
      }
export type GetCoursesBasedOnIdMutationHookResult = ReturnType<typeof useGetCoursesBasedOnIdMutation>;
export type GetCoursesBasedOnIdMutationResult = Apollo.MutationResult<GetCoursesBasedOnIdMutation>;
export type GetCoursesBasedOnIdMutationOptions = Apollo.BaseMutationOptions<GetCoursesBasedOnIdMutation, GetCoursesBasedOnIdMutationVariables>;
export const GetCourseDetailsDocument = gql`
    query getCourseDetails($id: ID!) {
  getCourse(id: $id) {
    id
    name
    courseCode
    courseLink
    description
    teacherID
    numOfStudents
    nodes {
      name
      type
      description
      id
      course
      status {
        nodeID
        studentID
        state
      }
      resources {
        resourceName
        type
        link
      }
      assignments {
        name
        type
        questions {
          question
          answerChoices
          answers
          imagePicObj
        }
        studentScores {
          nodeID
          studentID
          studentScore
        }
      }
      parent
      skills
      positionID
    }
  }
}
    `;

/**
 * __useGetCourseDetailsQuery__
 *
 * To run a query within a React component, call `useGetCourseDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCourseDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetCourseDetailsQuery, GetCourseDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseDetailsQuery, GetCourseDetailsQueryVariables>(GetCourseDetailsDocument, options);
      }
export function useGetCourseDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseDetailsQuery, GetCourseDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseDetailsQuery, GetCourseDetailsQueryVariables>(GetCourseDetailsDocument, options);
        }
export type GetCourseDetailsQueryHookResult = ReturnType<typeof useGetCourseDetailsQuery>;
export type GetCourseDetailsLazyQueryHookResult = ReturnType<typeof useGetCourseDetailsLazyQuery>;
export type GetCourseDetailsQueryResult = Apollo.QueryResult<GetCourseDetailsQuery, GetCourseDetailsQueryVariables>;
export const GetNodesBasedOnCourseDocument = gql`
    mutation getNodesBasedOnCourse($courseID: ID!) {
  getNodesBasedOnCourse(courseID: $courseID) {
    name
    type
    description
    id
    course
    parent
    status {
      nodeID
      studentID
      state
    }
    resources {
      resourceName
      type
      link
    }
    assignments {
      name
      type
      questions {
        question
        answerChoices
        answers
        imagePicObj
      }
      studentScores {
        nodeID
        studentID
        studentScore
      }
    }
  }
}
    `;
export type GetNodesBasedOnCourseMutationFn = Apollo.MutationFunction<GetNodesBasedOnCourseMutation, GetNodesBasedOnCourseMutationVariables>;

/**
 * __useGetNodesBasedOnCourseMutation__
 *
 * To run a mutation, you first call `useGetNodesBasedOnCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetNodesBasedOnCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getNodesBasedOnCourseMutation, { data, loading, error }] = useGetNodesBasedOnCourseMutation({
 *   variables: {
 *      courseID: // value for 'courseID'
 *   },
 * });
 */
export function useGetNodesBasedOnCourseMutation(baseOptions?: Apollo.MutationHookOptions<GetNodesBasedOnCourseMutation, GetNodesBasedOnCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetNodesBasedOnCourseMutation, GetNodesBasedOnCourseMutationVariables>(GetNodesBasedOnCourseDocument, options);
      }
export type GetNodesBasedOnCourseMutationHookResult = ReturnType<typeof useGetNodesBasedOnCourseMutation>;
export type GetNodesBasedOnCourseMutationResult = Apollo.MutationResult<GetNodesBasedOnCourseMutation>;
export type GetNodesBasedOnCourseMutationOptions = Apollo.BaseMutationOptions<GetNodesBasedOnCourseMutation, GetNodesBasedOnCourseMutationVariables>;
export const GetStudentDetailsDocument = gql`
    query getStudentDetails($id: ID!) {
  getStudent(id: $id) {
    id
    username
    email
    type
    profilePic
    grade
    school
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

/**
 * __useGetStudentDetailsQuery__
 *
 * To run a query within a React component, call `useGetStudentDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudentDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudentDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStudentDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>(GetStudentDetailsDocument, options);
      }
export function useGetStudentDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>(GetStudentDetailsDocument, options);
        }
export type GetStudentDetailsQueryHookResult = ReturnType<typeof useGetStudentDetailsQuery>;
export type GetStudentDetailsLazyQueryHookResult = ReturnType<typeof useGetStudentDetailsLazyQuery>;
export type GetStudentDetailsQueryResult = Apollo.QueryResult<GetStudentDetailsQuery, GetStudentDetailsQueryVariables>;
export const GetStudentsBasedOnCourseDocument = gql`
    mutation GetStudentsBasedOnCourse($courseID: ID!) {
  getStudentsBasedOnCourse(courseID: $courseID) {
    id
    username
    email
    profilePic
    grade
    school
  }
}
    `;
export type GetStudentsBasedOnCourseMutationFn = Apollo.MutationFunction<GetStudentsBasedOnCourseMutation, GetStudentsBasedOnCourseMutationVariables>;

/**
 * __useGetStudentsBasedOnCourseMutation__
 *
 * To run a mutation, you first call `useGetStudentsBasedOnCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetStudentsBasedOnCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getStudentsBasedOnCourseMutation, { data, loading, error }] = useGetStudentsBasedOnCourseMutation({
 *   variables: {
 *      courseID: // value for 'courseID'
 *   },
 * });
 */
export function useGetStudentsBasedOnCourseMutation(baseOptions?: Apollo.MutationHookOptions<GetStudentsBasedOnCourseMutation, GetStudentsBasedOnCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetStudentsBasedOnCourseMutation, GetStudentsBasedOnCourseMutationVariables>(GetStudentsBasedOnCourseDocument, options);
      }
export type GetStudentsBasedOnCourseMutationHookResult = ReturnType<typeof useGetStudentsBasedOnCourseMutation>;
export type GetStudentsBasedOnCourseMutationResult = Apollo.MutationResult<GetStudentsBasedOnCourseMutation>;
export type GetStudentsBasedOnCourseMutationOptions = Apollo.BaseMutationOptions<GetStudentsBasedOnCourseMutation, GetStudentsBasedOnCourseMutationVariables>;
export const GetTeacherDetailsDocument = gql`
    query getTeacherDetails($id: ID!) {
  getTeacher(id: $id) {
    username
    email
    id
    type
    profilePic
    school
    courses {
      name
      courseCode
      description
      courseLink
      id
      teacherID
      numOfStudents
    }
  }
}
    `;

/**
 * __useGetTeacherDetailsQuery__
 *
 * To run a query within a React component, call `useGetTeacherDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeacherDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeacherDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTeacherDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>(GetTeacherDetailsDocument, options);
      }
export function useGetTeacherDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>(GetTeacherDetailsDocument, options);
        }
export type GetTeacherDetailsQueryHookResult = ReturnType<typeof useGetTeacherDetailsQuery>;
export type GetTeacherDetailsLazyQueryHookResult = ReturnType<typeof useGetTeacherDetailsLazyQuery>;
export type GetTeacherDetailsQueryResult = Apollo.QueryResult<GetTeacherDetailsQuery, GetTeacherDetailsQueryVariables>;
export const GetTwoNodesInProgressDocument = gql`
    mutation GetTwoNodesInProgress($courseID: ID!, $studentID: ID!) {
  getTwoNodesInProgress(courseID: $courseID, studentID: $studentID) {
    id
    name
    description
    parent
    positionID
    assignments {
      studentScores {
        studentID
        studentScore
      }
    }
  }
}
    `;
export type GetTwoNodesInProgressMutationFn = Apollo.MutationFunction<GetTwoNodesInProgressMutation, GetTwoNodesInProgressMutationVariables>;

/**
 * __useGetTwoNodesInProgressMutation__
 *
 * To run a mutation, you first call `useGetTwoNodesInProgressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetTwoNodesInProgressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getTwoNodesInProgressMutation, { data, loading, error }] = useGetTwoNodesInProgressMutation({
 *   variables: {
 *      courseID: // value for 'courseID'
 *      studentID: // value for 'studentID'
 *   },
 * });
 */
export function useGetTwoNodesInProgressMutation(baseOptions?: Apollo.MutationHookOptions<GetTwoNodesInProgressMutation, GetTwoNodesInProgressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetTwoNodesInProgressMutation, GetTwoNodesInProgressMutationVariables>(GetTwoNodesInProgressDocument, options);
      }
export type GetTwoNodesInProgressMutationHookResult = ReturnType<typeof useGetTwoNodesInProgressMutation>;
export type GetTwoNodesInProgressMutationResult = Apollo.MutationResult<GetTwoNodesInProgressMutation>;
export type GetTwoNodesInProgressMutationOptions = Apollo.BaseMutationOptions<GetTwoNodesInProgressMutation, GetTwoNodesInProgressMutationVariables>;
export const JoinCourseDocument = gql`
    mutation JoinCourse($id: ID!, $courseCode: String!) {
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
export type JoinCourseMutationFn = Apollo.MutationFunction<JoinCourseMutation, JoinCourseMutationVariables>;

/**
 * __useJoinCourseMutation__
 *
 * To run a mutation, you first call `useJoinCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinCourseMutation, { data, loading, error }] = useJoinCourseMutation({
 *   variables: {
 *      id: // value for 'id'
 *      courseCode: // value for 'courseCode'
 *   },
 * });
 */
export function useJoinCourseMutation(baseOptions?: Apollo.MutationHookOptions<JoinCourseMutation, JoinCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinCourseMutation, JoinCourseMutationVariables>(JoinCourseDocument, options);
      }
export type JoinCourseMutationHookResult = ReturnType<typeof useJoinCourseMutation>;
export type JoinCourseMutationResult = Apollo.MutationResult<JoinCourseMutation>;
export type JoinCourseMutationOptions = Apollo.BaseMutationOptions<JoinCourseMutation, JoinCourseMutationVariables>;
export const LoginStudentDocument = gql`
    mutation LoginStudent($email: String!, $password: String!) {
  loginStudent(email: $email, password: $password) {
    userID
    tokenExpiration
    accessToken
    refreshToken
  }
}
    `;
export type LoginStudentMutationFn = Apollo.MutationFunction<LoginStudentMutation, LoginStudentMutationVariables>;

/**
 * __useLoginStudentMutation__
 *
 * To run a mutation, you first call `useLoginStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginStudentMutation, { data, loading, error }] = useLoginStudentMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginStudentMutation(baseOptions?: Apollo.MutationHookOptions<LoginStudentMutation, LoginStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginStudentMutation, LoginStudentMutationVariables>(LoginStudentDocument, options);
      }
export type LoginStudentMutationHookResult = ReturnType<typeof useLoginStudentMutation>;
export type LoginStudentMutationResult = Apollo.MutationResult<LoginStudentMutation>;
export type LoginStudentMutationOptions = Apollo.BaseMutationOptions<LoginStudentMutation, LoginStudentMutationVariables>;
export const LoginTeacherDocument = gql`
    mutation LoginTeacher($email: String!, $password: String!) {
  loginTeacher(email: $email, password: $password) {
    userID
    tokenExpiration
    accessToken
    refreshToken
  }
}
    `;
export type LoginTeacherMutationFn = Apollo.MutationFunction<LoginTeacherMutation, LoginTeacherMutationVariables>;

/**
 * __useLoginTeacherMutation__
 *
 * To run a mutation, you first call `useLoginTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginTeacherMutation, { data, loading, error }] = useLoginTeacherMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginTeacherMutation(baseOptions?: Apollo.MutationHookOptions<LoginTeacherMutation, LoginTeacherMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginTeacherMutation, LoginTeacherMutationVariables>(LoginTeacherDocument, options);
      }
export type LoginTeacherMutationHookResult = ReturnType<typeof useLoginTeacherMutation>;
export type LoginTeacherMutationResult = Apollo.MutationResult<LoginTeacherMutation>;
export type LoginTeacherMutationOptions = Apollo.BaseMutationOptions<LoginTeacherMutation, LoginTeacherMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterStudentDocument = gql`
    mutation registerStudent($username: String!, $email: String!, $password: String!, $type: String!, $authType: String!) {
  registerStudent(
    registerStudentInput: {username: $username, email: $email, password: $password, type: $type, authType: $authType}
  ) {
    userID
    authType
    accessToken
    refreshToken
    type
    tokenExpiration
  }
}
    `;
export type RegisterStudentMutationFn = Apollo.MutationFunction<RegisterStudentMutation, RegisterStudentMutationVariables>;

/**
 * __useRegisterStudentMutation__
 *
 * To run a mutation, you first call `useRegisterStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerStudentMutation, { data, loading, error }] = useRegisterStudentMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      type: // value for 'type'
 *      authType: // value for 'authType'
 *   },
 * });
 */
export function useRegisterStudentMutation(baseOptions?: Apollo.MutationHookOptions<RegisterStudentMutation, RegisterStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterStudentMutation, RegisterStudentMutationVariables>(RegisterStudentDocument, options);
      }
export type RegisterStudentMutationHookResult = ReturnType<typeof useRegisterStudentMutation>;
export type RegisterStudentMutationResult = Apollo.MutationResult<RegisterStudentMutation>;
export type RegisterStudentMutationOptions = Apollo.BaseMutationOptions<RegisterStudentMutation, RegisterStudentMutationVariables>;
export const RegisterTeacherDocument = gql`
    mutation registerTeacher($username: String!, $email: String!, $password: String!, $type: String!, $teacherCode: String!) {
  registerTeacher(
    registerTeacherInput: {username: $username, email: $email, password: $password, type: $type, teacherCode: $teacherCode}
  ) {
    userID
    accessToken
    refreshToken
    type
    tokenExpiration
  }
}
    `;
export type RegisterTeacherMutationFn = Apollo.MutationFunction<RegisterTeacherMutation, RegisterTeacherMutationVariables>;

/**
 * __useRegisterTeacherMutation__
 *
 * To run a mutation, you first call `useRegisterTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerTeacherMutation, { data, loading, error }] = useRegisterTeacherMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      type: // value for 'type'
 *      teacherCode: // value for 'teacherCode'
 *   },
 * });
 */
export function useRegisterTeacherMutation(baseOptions?: Apollo.MutationHookOptions<RegisterTeacherMutation, RegisterTeacherMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterTeacherMutation, RegisterTeacherMutationVariables>(RegisterTeacherDocument, options);
      }
export type RegisterTeacherMutationHookResult = ReturnType<typeof useRegisterTeacherMutation>;
export type RegisterTeacherMutationResult = Apollo.MutationResult<RegisterTeacherMutation>;
export type RegisterTeacherMutationOptions = Apollo.BaseMutationOptions<RegisterTeacherMutation, RegisterTeacherMutationVariables>;
export const SetStudentProfileDocument = gql`
    mutation SetStudentProfile($id: ID!, $profilePicUrl: String!, $grade: Int!, $school: String!) {
  setStudentProfile(
    id: $id
    profilePicURL: $profilePicUrl
    grade: $grade
    school: $school
  ) {
    username
    email
    profilePic
    school
  }
}
    `;
export type SetStudentProfileMutationFn = Apollo.MutationFunction<SetStudentProfileMutation, SetStudentProfileMutationVariables>;

/**
 * __useSetStudentProfileMutation__
 *
 * To run a mutation, you first call `useSetStudentProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetStudentProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setStudentProfileMutation, { data, loading, error }] = useSetStudentProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      profilePicUrl: // value for 'profilePicUrl'
 *      grade: // value for 'grade'
 *      school: // value for 'school'
 *   },
 * });
 */
export function useSetStudentProfileMutation(baseOptions?: Apollo.MutationHookOptions<SetStudentProfileMutation, SetStudentProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetStudentProfileMutation, SetStudentProfileMutationVariables>(SetStudentProfileDocument, options);
      }
export type SetStudentProfileMutationHookResult = ReturnType<typeof useSetStudentProfileMutation>;
export type SetStudentProfileMutationResult = Apollo.MutationResult<SetStudentProfileMutation>;
export type SetStudentProfileMutationOptions = Apollo.BaseMutationOptions<SetStudentProfileMutation, SetStudentProfileMutationVariables>;
export const SetTeacherProfileDocument = gql`
    mutation SetTeacherProfile($id: ID!, $profilePicUrl: String!, $school: String!) {
  setTeacherProfile(id: $id, profilePicURL: $profilePicUrl, school: $school) {
    username
    email
    profilePic
    school
  }
}
    `;
export type SetTeacherProfileMutationFn = Apollo.MutationFunction<SetTeacherProfileMutation, SetTeacherProfileMutationVariables>;

/**
 * __useSetTeacherProfileMutation__
 *
 * To run a mutation, you first call `useSetTeacherProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTeacherProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTeacherProfileMutation, { data, loading, error }] = useSetTeacherProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      profilePicUrl: // value for 'profilePicUrl'
 *      school: // value for 'school'
 *   },
 * });
 */
export function useSetTeacherProfileMutation(baseOptions?: Apollo.MutationHookOptions<SetTeacherProfileMutation, SetTeacherProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTeacherProfileMutation, SetTeacherProfileMutationVariables>(SetTeacherProfileDocument, options);
      }
export type SetTeacherProfileMutationHookResult = ReturnType<typeof useSetTeacherProfileMutation>;
export type SetTeacherProfileMutationResult = Apollo.MutationResult<SetTeacherProfileMutation>;
export type SetTeacherProfileMutationOptions = Apollo.BaseMutationOptions<SetTeacherProfileMutation, SetTeacherProfileMutationVariables>;
export const UpdateNodeDocument = gql`
    mutation UpdateNode($id: ID!, $newName: String!) {
  updateNode(id: $id, newName: $newName) {
    name
    course
    description
  }
}
    `;
export type UpdateNodeMutationFn = Apollo.MutationFunction<UpdateNodeMutation, UpdateNodeMutationVariables>;

/**
 * __useUpdateNodeMutation__
 *
 * To run a mutation, you first call `useUpdateNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNodeMutation, { data, loading, error }] = useUpdateNodeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      newName: // value for 'newName'
 *   },
 * });
 */
export function useUpdateNodeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNodeMutation, UpdateNodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNodeMutation, UpdateNodeMutationVariables>(UpdateNodeDocument, options);
      }
export type UpdateNodeMutationHookResult = ReturnType<typeof useUpdateNodeMutation>;
export type UpdateNodeMutationResult = Apollo.MutationResult<UpdateNodeMutation>;
export type UpdateNodeMutationOptions = Apollo.BaseMutationOptions<UpdateNodeMutation, UpdateNodeMutationVariables>;