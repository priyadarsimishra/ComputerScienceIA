import { Course, ICourse } from "../../models/Course";
import { Teacher, ITeacher } from "../../models/Teacher";
import { Node } from "../../models/Node";

const courseResolver = {
  Query: {
    getCourse: async (_, { id }, context) => {
      if(!context.req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }      
      try {
        const course: ICourse = await Course.findById(id).populate("nodes");
        if (course) {
          return course;
        } else {
          return new Error("This course does not exist");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    getCoursesBasedOnID: async (_, { id }, context) => {
      if(!context.req.isAuth){ // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }     
      let courses: ICourse[] = await Course.find({ teacherID: id }).populate("nodes");
      // console.log(courses);

      return courses;
    },
    createCourse: async (_, { name, description, id, courseCode }, context, info) => {
      if (!context.req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      const teacher: ITeacher = await Teacher.findById(id).populate("courses");
      // makes sure the course code is unique
      let course: ICourse = await Course.findOne({
        courseCode: courseCode,
      });
      // while (course) {
      //   uniqueCourseCode =
      //     getRandomString(3) +
      //     "-" +
      //     getRandomString(3) +
      //     "-" +
      //     getRandomString(3);
      //   course = await Course.findOne({ courseCode: uniqueCourseCode });
      // }

      if(course)
      {
        return new Error("This course code is already in use. Please generate a new code");
      }

      // creates new course
      const newCourse: ICourse = new Course({
        name: name,
        description: description,
        teacherID: id,
        courseCode: courseCode,
        courseLink: "",
        numOfStudents: 0, 
        nodes: [],
      });

      const result = await newCourse.save();

      // adds course to teacher's course list
      await Teacher.updateOne(
        { _id: id },
        { $addToSet: { courses: newCourse } }
      );

      await teacher.save();

      return result;
    },
    deleteCourse: async (_, { id, teacherID }, context, info) => {
      if (!context.req.isAuth) {
        // uses the middleware to check auth based on JWT in header
        return new Error("Not Authenticated!");
      }

      let result = await Course.deleteOne({id: id});
      let nodesRemoved = await Node.deleteMany({course: id});

      let teacher: ITeacher = await Teacher.findOne({_id: teacherID}).populate("courses");

      let courses = teacher.courses;

      for(let i = 0; i < courses.length; i++) {
        if(courses[i].id === id) {
          courses.splice(i, 1);
          break;
        }
      }

      // TODO: write code to remove from student's courses array

      teacher.courses = courses;
      await teacher.markModified("courses");
      await teacher.save();

      return false;
    },
  },
};

function getRandomString(length: number) {
  let randomChars: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result: string = "";
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

export default courseResolver;
