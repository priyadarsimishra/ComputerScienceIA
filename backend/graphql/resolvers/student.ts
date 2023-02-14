import { IStudent, Student } from "../../models/Student";
import { ICourse, Course } from "../../models/Course";
import { createAccessToken, createRefreshToken } from "../../utils";
import bcrypt from "bcryptjs";

const studentResolver = {
  Query: {
    getStudents: async (_, args, context) => {
      if (!context.req.isAuth) {
        return new Error("Not Authenticated!");
      }

      try {
        const students: IStudent[] = await Student.find({}).populate("courses");
        return students;
      } catch (err) {
        console.log(err);
      }
    },
    getStudent: async (_, { id }, context) => {
      if (!context.req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      try {
        const student: IStudent = await Student.findById(id).populate(
          "courses"
        );
        if (student) {
          return student;
        } else {
          return new Error("This student does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    getStudentsBasedOnCourse: async(_, { courseID }, { res, req }) => {
      if (!req.isAuth) {
        return new Error("Not Authenticated!");
      }

      let students: IStudent[] = await Student.find({courses: {"$in": courseID}})
      return students;
    },
    registerStudent: async (
      _,
      { registerStudentInput: { username, email, type, authType, password } },
      { res, req },
      info
    ) => {
      const currStudent: IStudent = await Student.findOne({ email: email });

      if (currStudent) {
        return new Error("Student already exists!");
      }

      const salt: String = await bcrypt.genSalt(10);
      const hashedPassword: String = await bcrypt.hash(password, salt);

      const newStudent: IStudent = new Student({
        type: type,
        authType: authType,
        username: username,
        email: email,
        password: hashedPassword,
        grade: 0,
        school: "",
        profilePic: "",
        courses: [],
      });

      const accessToken = createAccessToken(newStudent.id, "student");
      const refreshToken = createRefreshToken(newStudent.id, "student");
      // refresh token in cookie
      // res.cookie("jid", createRefreshToken(newStudent.id, "student"), {
      //   httpOnly: true,
      //   path: "/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      await newStudent.save();

      return {
        userID: newStudent.id,
        authType: authType,
        accessToken: accessToken,
        refreshToken: refreshToken,
        type: "student",
        tokenExpiration: 30,
      };
    },
    setStudentProfile: async(_, { id, profilePicURL, grade, school }, { res, req }) => {
      if (!req.isAuth) {
        return new Error("Not Authenticated!");
      }

      let student: IStudent = await Student.findOne({_id: id})

      if(!student) {
        return new Error("Student not found");
      }

      student.profilePic = profilePicURL
      student.grade = grade
      student.school = school;

      student.markModified("profilePic");
      student.markModified("grade");
      student.markModified("school");

      await student.save();

      return student;
    },
    loginStudent: async (_, { email, password }, { res, req }) => {
      const student: IStudent = await Student.findOne({ email: email });

      if (!student) {
        return new Error("No Student with this email address exists!");
      }

      const isEqual = await bcrypt.compare(password, student.password);
      if (!isEqual) {
        return new Error("Password is incorrect!");
      }

      const accessToken = createAccessToken(student.id, "student");
      const refreshToken = createRefreshToken(student.id, "student");
      // res.cookie("jid", createRefreshToken(student.id, "student"), {
      //   httpOnly: true,
      //   path: "/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // }); // refresh token in cookie

      return {
        userID: student.id,
        type: "student",
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpiration: 30,
      };
    },
    joinCourse: async (_, { id, courseCode }, context, info) => {
      if (!context.req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }
      let course: ICourse = await Course.findOne({ courseCode: courseCode });
      let student: IStudent = await Student.findOne({ _id: id }).populate(
        "courses"
      );

      if (!course) {
        return new Error("Course not found");
      }

      if (!student) {
        return new Error("Student not found");
      }
      
      await Student.updateOne({ _id: id }, { $addToSet: { courses: course } });
      course.numOfStudents+=1;
      await course.markModified('numOfStudents');

    
      let result = await student.save();
      await course.save()
      
      return result;
    },
    logout: async (_, args, { res, req }, info) => {
      // res.cookie("jid", "", {
      //   httpOnly: true,
      //   path: "/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      return true;
    },
  },
};

export default studentResolver;
