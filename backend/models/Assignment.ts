export interface IAssignment {
  type: string;
  name: string;
  questions: [
    {
      question: string;
      answerChoices: string[];
      answers: boolean[];
    }
  ];
  studentScores: any[],
}
