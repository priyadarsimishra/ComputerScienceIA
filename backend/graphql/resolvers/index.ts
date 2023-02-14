import studentResolver from "./student";
import teacherResolver from "./teacher";
import courseResolver from "./course";
import nodeResolver from "./node";
import assignmentsResolver from "./assignments";
import teacherCodeResolver from "./teacherCode";
import { Student } from "../../models/Student";
import { Teacher } from "../../models/Teacher";


export default {
  Query: {
    ...studentResolver.Query,
    ...teacherResolver.Query,
    ...courseResolver.Query,
    ...nodeResolver.Query,
    ...assignmentsResolver.Query,
    ...teacherCodeResolver.Query
  },
  Mutation: {
    ...studentResolver.Mutation,
    ...teacherResolver.Mutation,
    ...courseResolver.Mutation,
    ...nodeResolver.Mutation,
    ...assignmentsResolver.Mutation,
    ...teacherCodeResolver.Mutation,
    editProfile: async(_, { id, type, name, email, grade, school, profilePicURL }, { res, req }) => {
      if (!req.isAuth) {
        return new Error("Not Authenticated!");
      }

      if(type === 'student') 
      {
        let student = await Student.findOne({_id: id})
        if(name && name !== "") {
          student.username = name
          student.markModified("username")
        }
  
        if(email && email !== "") {
          student.email = email
          student.markModified("email")
        }
  
        if(grade) {
          student.grade = grade
          student.markModified("grade")
        }
  
        if(school && school !== "") {
          student.school = school
          student.markModified("school")
        }

        if(profilePicURL) {
          student.profilePic = profilePicURL
          student.markModified("profilePicURL")
        }

        await student.save();

        return true;
      }
      else(type === 'teacher')
      {
        let teacher = await Teacher.findOne({_id: id})
        if(name && name !== "") {
          teacher.username = name
          teacher.markModified("username")
        }
  
        if(email && email !== "") {
          teacher.email = email
          teacher.markModified("email")
        }
    
        if(school && school !== "") {
          teacher.school = school
          teacher.markModified("school")
        }
  
        if(profilePicURL) {
          teacher.profilePic = profilePicURL
          teacher.markModified("profilePicURL")
        }

        await teacher.save();

        return true;      
      }
      return false;
    },
  },
};
