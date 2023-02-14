import { Teacher, ITeacher } from "../../models/Teacher";
import { TeacherCode } from "../../models/TeacherCode";
import { createAccessToken, createRefreshToken } from "../../utils";
import bcrypt from "bcryptjs";

const teacherResolver = {
  Query: {
    getTeachers: async (_, args, context) => {
      if (!context.req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      try {
        const teachers: any = await Teacher.find({});
        await teachers.populate("courses");
        return teachers;
      } catch (err) {
        console.log(err);
      }
    },
    getTeacher: async (_, { id }, context) => {
      if (!context.req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }
      try {
        const teacher: ITeacher = await Teacher.findOne({ _id: id }).populate(
          "courses"
        );
        if (teacher) {
          return teacher;
        } else {
          return new Error("This teacher does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    registerTeacher: async (
      _,
      { registerTeacherInput: { username, email, password, type, teacherCode } },
      { req, res },
      info
    ) => {
      
      const currTeacher: ITeacher = await Teacher.findOne({ email: email });

      if (currTeacher) {
        return new Error("Teacher already exists!");
      }

      let result = await TeacherCode.findOne({code: teacherCode})
      // console.log(result);
      if(!result) {
        return new Error("This is not a valid teacher code")
      }

      await TeacherCode.deleteOne({code: teacherCode})

      const salt: String = await bcrypt.genSalt(10);
      const hashedPassword: String = await bcrypt.hash(password, salt);

      const newTeacher: ITeacher = new Teacher({
        type: type,
        username: username,
        email: email,
        password: hashedPassword,
        school: "",
        profilePic: "",
        courses: [],
      });

      const accessToken = createAccessToken(newTeacher.id, "teacher");
      const refreshToken = createRefreshToken(newTeacher.id, "teacher");
      // refresh token in cookie
      // res.cookie("jid", createRefreshToken(newTeacher.id, "teacher"), {
      //   httpOnly: true,
      //   path: "/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      await newTeacher.save();

      return {
        userID: newTeacher.id,
        type: "teacher",
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpiration: 30,
      };
    },
    setTeacherProfile: async(_, { id, profilePicURL, school }, { res, req }) => {
      if (!req.isAuth) {
        return new Error("Not Authenticated!");
      }

      let teacher: ITeacher = await Teacher.findOne({_id: id})

      if(!teacher) {
        return new Error("Student not found");
      }

      teacher.profilePic = profilePicURL
      teacher.school = school;

      teacher.markModified("profilePic");
      teacher.markModified("grade");
      teacher.markModified("school");

      await teacher.save();

      return teacher;
    },
    loginTeacher: async (_, { email, password }, { res, req }) => {
      const teacher: ITeacher = await Teacher.findOne({ email: email });

      if (!teacher) {
        return new Error("No Teacher with this email address exists!");
      }

      const isEqual = await bcrypt.compare(password, teacher.password);
      if (!isEqual) {
        return new Error("Password is incorrect!");
      }

      const accessToken = createAccessToken(teacher.id, "teacher");
      const refreshToken = createRefreshToken(teacher.id, "teacher");

      // res.cookie("jid", createRefreshToken(teacher.id, "teacher"), {
      //   httpOnly: true,
      //   path: "/refresh_token",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // }); // refresh token in cookie

      return {
        userID: teacher.id,
        type: "teacher",
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpiration: 30,
      };
    },
  },
};

export default teacherResolver;
