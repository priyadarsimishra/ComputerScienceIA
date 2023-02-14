import { ITeacherCode, TeacherCode } from "../../models/TeacherCode";

const teacherCodeResolver = {
  Query: {},
  Mutation: {
    addTeacherCodes: async (
      _,
      { number },
      { req, res },
      info
    ) => {      
      let arr: any[] = []
      for(let i = 0; i < number; i++) {
        let code: ITeacherCode = new TeacherCode({
            code: getRandomString(5)+"-"+getRandomString(5),
        }) 
        arr.push(code);
        await code.save();
      }

      return arr
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

export default teacherCodeResolver;
