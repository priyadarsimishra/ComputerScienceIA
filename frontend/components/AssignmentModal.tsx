import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Flex,
  Button,
  IconButton,
  Box,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  useColorMode,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {useAddStudentScoreToAssignmentMutation} from "../generated/graphql";
import MCQuestionBody from "./MCQuestionBody";
import { useAuth } from "../AuthContext";

const AssignmentModal: React.FC<any> = ({ assignment, node }) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("white.50", "gray.800")
  const borderColor  = useColorModeValue("#2C4187", "#9DECF9")
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questionObjs, _] = useState(assignment?.questions);
  const [questionNum, setQuestionNum] = useState<number>(1);
  const [currMastery, setCurrMastery] = useState<any>(0);
  const [questionButtonSelected, setQuestionButtonSelected] = useState<
    boolean[]
  >([]);
  const [answerOptions, setAnswerOptions] = useState<boolean[][]>([]);
  const [correctAnswerOptions, setCorrectAnswerOptions] = useState<boolean[][]>(
    []
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [numberOfQuestionsCorrect, setNumberOfQuestionsCorrect] = useState<
    number
  >(0);
  const [questionsIncorrect, setQuestionsIncorrect] = useState([]);
  const [wrongOptionsChosen, setWrongOptionsChosen] = useState([]);
  const [displayResultScreen, setDisplayResultScreen] = useState<boolean>(
    false
  );
  const toast = useToast();
  const auth: any = useAuth();
  const [
    addStudentScoreToAssignment,
    { loading },
  ] = useAddStudentScoreToAssignmentMutation();

  // console.log(answerOptions);
  // console.log(assignment);
  // console.log(questionObjs[0]?.imagePicObj);

  const resetAll = () => {
    setQuestionNum(1);
    setQuestionButtonSelected([]);
    setCorrectAnswerOptions([]);
    setIsSubmitted(false);
    setNumberOfQuestionsCorrect(0);
    setQuestionsIncorrect([]);
    setWrongOptionsChosen([]);
    setDisplayResultScreen(false);
  };

  useEffect(() => {
    let currID = auth.getTokenInfo()?.userID;
    if(assignment != null && assignment.studentScores?.length !== 0){
      for(let i = 0; i < assignment.studentScores?.length; i++){
        if(assignment.studentScores[i].studentID === currID) {
          setCurrMastery(assignment.studentScores[i].studentScore);
        }
      }
    }
    else {
      setCurrMastery(0);
    }
  },[assignment])

  useEffect(() => {
    answerOptions?.splice(0, answerOptions?.length);
    questionButtonSelected.push(true);
    answerOptions?.push([false, false, false, false, false]);
    correctAnswerOptions?.push(questionObjs[0]?.answers);

    for (let i = 1; i < questionObjs?.length; i++) {
      questionButtonSelected.push(false);
      answerOptions?.push([false, false, false, false, false]);
      correctAnswerOptions?.push(questionObjs[i]?.answers);
    }

    setQuestionButtonSelected(questionButtonSelected);
    setAnswerOptions(answerOptions!);
    setCorrectAnswerOptions(correctAnswerOptions!);
  }, [isOpen]);

  useEffect(() => {
    if (isSubmitted) {
      let numCorrect: number = 0;
      let questionsIncorrect = [];
      let wrongOptionChosen = [];

      for (let i = 0; i < questionObjs?.length; i++) {
        if(questionObjs[i]?.answers.indexOf(true) == questionObjs[i]?.answers.lastIndexOf(true)) {
          // not multi select
          let indexOfCorrectAnswer = questionObjs[i]?.answers.indexOf(true);
          if (
            questionObjs[i]?.answers[indexOfCorrectAnswer] ==
            answerOptions[i][indexOfCorrectAnswer]
          ) {
            numCorrect++;
          } else {
            questionsIncorrect.push(questionObjs[i]);
            let choices = ["A", "B", "C", "D"];
            wrongOptionChosen.push(choices[answerOptions[i]?.indexOf(true)]);
          }
        }
        else {
          // is multi select
          // console.log("multi select");
          let indices = []
          for(let j = 0; j < questionObjs[i]?.answers.length; j++) {
            if(questionObjs[i]?.answers[j]) indices.push(j);
          }
          let wrong = 0;
          let correct = 0;
          for(let k = 0; k < questionObjs[i]?.answers.length; k++) {
            if (questionObjs[i]?.answers[k] && 
              (questionObjs[i]?.answers[k] !== 
              answerOptions[i][k])
            ) {
              wrong++;
              let choices = ["A", "B", "C", "D"];
              wrongOptionChosen.push(choices[k]);
            }
            else if(!questionObjs[i]?.answers[k] && (questionObjs[i]?.answers[k] !== 
              answerOptions[i][k])) {
                wrong++;
                let choices = ["A", "B", "C", "D"];
                wrongOptionChosen.push(choices[k]);
            }
          }

          if(wrong === 0) numCorrect++;
          else questionsIncorrect.push(questionObjs[i]);
        }
      }

      const addData =  async(length) => {
        const { data } = await addStudentScoreToAssignment({
          variables: {
            nodeID: node.data.dbID,
            studentID: auth?.getTokenInfo().userID,
            studentScore: (numCorrect / length) * 100,
            nameOfAssignment: assignment.name,
          },
        });

        // console.log(data);
      }

      addData(questionObjs?.length);
      setWrongOptionsChosen(wrongOptionChosen);
      setNumberOfQuestionsCorrect(numCorrect);
      setQuestionsIncorrect(questionsIncorrect);
      setIsSubmitted(false);
      setDisplayResultScreen(true);
      setQuestionNum(questionObjs?.length + 1);

      // setQuestionsCompleted(true);
      // console.log("correct: ", numCorrect);
      // console.log("incorrect questions: ", questionsIncorrect);
      // console.log("options wrong chose: ", wrongOptionChosen);
    }
  }, [isSubmitted]);

  return (
    <div>
      <Flex
        onClick={onOpen}
        colorScheme="blue"
        bg={bgColor}
        w="100%"
        mb="5"
        p="3"
        boxShadow="lg"
        rounded={{ sm: "lg" }}
        borderWidth={1.5}
        borderColor={borderColor}
        style={{
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex w="85%" alignItems="center"> 
          <Flex>
              <Image src="/assignmenticon.png" w="50px" maxW="50px" h="50px"/>
          </Flex>        
          <Text 
            noOfLines={1} 
            fontWeight="bold" 
            fontSize="1.8vh" 
            bgClip="text"
            bgGradient={titleText}
            ml="3"
          >
            {assignment?.name}
          </Text>
        </Flex>
        <Box>
        <CircularProgress value={Math.round(currMastery)} color={(colorMode === "light" ? 'blue.500': 'cyan.500')}>
          <CircularProgressLabel color={(colorMode === "light" ? 'blue.500': 'cyan.500')} fontWeight="bold">{Math.round(currMastery) !== undefined ? Math.round(currMastery): 0}%</CircularProgressLabel>
        </CircularProgress>
        </Box>
      </Flex>
      <Modal
        isOpen={isOpen}
        size={"6xl"}
        onClose={() => {
          if(displayResultScreen)
            router.reload();
          resetAll();
          answerOptions.splice(0, answerOptions?.length);

          answerOptions?.push([false, false, false, false, false]);
          for (let i = 1; i < questionObjs?.length; i++) {
            answerOptions?.push([false, false, false, false, false]);
          }

          setAnswerOptions(answerOptions);

          onClose();
        }}
        closeOnOverlayClick={false}
        isCentered
        preserveScrollBarGap
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{assignment?.name}</ModalHeader>
          {displayResultScreen ? (
            <ModalBody>
              {questionNum == questionObjs?.length + 1 ? (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  <CircularProgress
                    size="150px"
                    value={
                      Math.round((numberOfQuestionsCorrect / questionObjs?.length) * 100)
                    }
                    color={borderColor}
                    thickness="5px"
                  >
                    <CircularProgressLabel
                      color={borderColor}
                      fontWeight="bolder"
                    >
                      {Math.round((numberOfQuestionsCorrect / questionObjs?.length) * 100)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text fontWeight="bolder" fontSize="5xl">
                    You got {numberOfQuestionsCorrect} out of{" "}
                    {questionObjs.length}
                    {numberOfQuestionsCorrect == questionObjs.length ? "!" : ""}
                  </Text>
                  <Text fontWeight="medium">
                    {numberOfQuestionsCorrect < questionObjs.length / 2
                      ? "Keep trying to achieve Mastery! As they say - practice makes perfect!"
                      : numberOfQuestionsCorrect == questionObjs.length
                      ? "Congratulations! You got all the questions right! You are on your way towards Mastery"
                      : "Great Job! Keep working to enhance your skills"}
                  </Text>
                </Flex>
              ) : (
                <Box>
                  {questionObjs.map((questionObj, index) => {
                    if (index + 1 == questionNum) {
                      return (
                        <>
                          <ModalBody key={index}>
                            {questionObjs[index]?.imagePicObj !== "" ? 
                              <Flex w="100%" h="30vh" maxH="30vh" justifyContent="center" alignItems="center" mb="5"> 
                                <Image src={questionObjs[index]?.imagePicObj}  h="30vh" objectFit={'cover'} />
                              </Flex>
                            : null
                            }
                            <MCQuestionBody
                              question={questionObjs[index]?.question}
                              answerChoices={questionObjs[index]?.answerChoices}
                              isMultiSelect={
                                questionObjs[index]?.answers.indexOf(true) != questionObjs[index]?.answers.lastIndexOf(true)
                              }
                              initialState={answerOptions[index]!}
                              answerOptions={answerOptions!}
                              setAnswerOptions={setAnswerOptions!}
                              questionNum={questionNum}
                              questionCompleted={true}
                              correctAnswerOptions={
                                correctAnswerOptions[index]!
                              }
                              wrongAnswerChosen={answerOptions[index]!}
                            />
                          </ModalBody>
                        </>
                      );
                    }
                  })}
                </Box>
              )}
            </ModalBody>
          ) : (
            <ModalBody>
              {questionObjs.map((questionObj, index) => {
                if (index + 1 == questionNum) {
                  return (
                    <>
                      <ModalBody key={index}>
                        {questionObjs[index]?.imagePicObj !== "" ? 
                          <Flex w="100%" h="30vh" maxH="30vh" justifyContent="center" alignItems="center" mb="5"> 
                            <Image src={questionObjs[index]?.imagePicObj}  h="30vh" objectFit={'cover'} />
                          </Flex>
                        : null
                        }
                        <MCQuestionBody
                          question={questionObjs[index]?.question}
                          answerChoices={questionObjs[index]?.answerChoices}
                          isMultiSelect={
                            questionObjs[index]?.answers.indexOf(true) != questionObjs[index]?.answers.lastIndexOf(true)
                          }
                          initialState={answerOptions[index]!}
                          answerOptions={answerOptions!}
                          setAnswerOptions={setAnswerOptions!}
                          questionNum={questionNum}
                        />
                      </ModalBody>
                    </>
                  );
                }
              })}
            </ModalBody>
          )}

          <ModalFooter>
            {displayResultScreen ? (
              <Flex w="100%">
                <Flex
                  w="100%"
                  // justifyContent="center"
                  css={{ 
                    overflowY: "hidden",
                    overflowX: "auto",
                    position: "relative",
                    '&::-webkit-scrollbar': { 
                      display: "none"
                    },
                    "border-radius": "5px",
                  }}
                >
                  {questionObjs?.map((questionObj, index) => (
                    <IconButton
                      key={index}
                      aria-label="correct/incorrect"
                      mr="2"
                      bgColor={
                        questionsIncorrect.indexOf(questionObj) == -1
                          ? "green"
                          : "red"
                      }
                      icon={
                        questionsIncorrect.indexOf(questionObj) == -1 ? (
                          <CheckIcon />
                        ) : (
                          <CloseIcon />
                        )
                      }
                      onClick={() => {
                        setQuestionNum(index + 1);
                      }}
                      _hover={{bgColor:(questionsIncorrect.indexOf(questionObj) == -1
                        ? "green.400"
                        : "red.400")}}
                      color={"white"}
                    />
                  ))}
                            
                </Flex>
                <Button
                  bgColor={(colorMode === "light" ? "purple.800": "purple.400")}
                  _hover={{bgColor: (colorMode === "light" ? "purple.700": "purple.300")}}
                  color={"white"}
                  onClick={() => {
                    setQuestionNum(questionObjs.length + 1);
                  }}
                  ml="2"
                  pl="6"
                  pr="6"
                >
                  Result
                </Button>     
              </Flex>

            ) : (
              <Flex w="100%">
                <Flex 
                  w="100%"
                  // justifyContent="center"
                  css={{ 
                    overflowY: "hidden",
                    overflowX: "auto",
                    position: "relative",
                    '&::-webkit-scrollbar': { 
                      display: "none"
                    },
                    "border-radius": "5px",
                  }}
                >
                  {questionObjs?.map((questionObj, index) => (
                    <Button
                      key={index}
                      mr="2"
                      onClick={() => {
                        setQuestionNum(index + 1);
                        for (let i = 0; i < questionButtonSelected.length; i++) {
                          if (index == i) {
                            questionButtonSelected[
                              index
                            ] = !questionButtonSelected[index];
                          } else {
                            questionButtonSelected[i] = false;
                          }
                        }
                        setQuestionButtonSelected(questionButtonSelected);
                      }}
                      bgColor={
                        questionButtonSelected[index] ||
                        answerOptions[index]?.indexOf(true) != -1
                          ? "blue.600"
                          : null
                      }
                      color={
                        questionButtonSelected[index] ||
                        answerOptions[index]?.indexOf(true) != -1
                          ? "white"
                          : null
                      }
                    >
                      {index + 1}
                    </Button>
                  ))}
                </Flex>
                <Button
                  ml="5"
                  colorScheme="telegram"
                  pl="6"
                  pr="6"
                  isLoading={isSubmitted}
                  onClick={() => {
                    let add: boolean = true;

                    for (let i = 0; i < answerOptions.length; i++) {
                      if (add && answerOptions[i]?.indexOf(true) < 0) {
                        add = false;
                      }
                    }

                    if (add) {
                      setQuestionNum(questionObjs.length + 1);
                      setIsSubmitted(true);
                    } else {
                      toast({
                        title: "Submission Error",
                        description:
                          "Answer all the questions before submitting!",
                        status: "error",
                        duration: 4000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  Submit
                </Button>
              </Flex>

            )}
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AssignmentModal;
