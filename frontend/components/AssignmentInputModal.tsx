import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
  Box,
  Text,
  useColorMode,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AddIcon } from "@chakra-ui/icons";
import Node from "./Node";
import MultipleChoiceForm from "./MultipleChoiceForm";
import { useAddMcqAssignmentMutation } from "../generated/graphql";
// import Loading from "../components/Loading";
import { storage } from "../firebase";
import { v4 } from "uuid";

 interface Question {
  question: string;
  answerChoices: string[];
  answers: boolean[];
  imagePicObj: any
}

const AssignmentInputModal: React.FC<any> = ({ id, currentNode, course }) => {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("white.50", "gray.800")
  const borderColor  = useColorModeValue("#2C4187", "#9DECF9")
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [typeOfAssignment, setTypeOfAssignment] = useState<string>("");
  const [readyToSubmit, setReadyToSubmit] = useState<any>(false);
  const [value, setValue] = useState<any>();
  const [questionCount, setQuestionCount] = useState<any>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<any>([]);
  const [
    addMCQAssignment,
    { loading: assignmentLoading },
  ] = useAddMcqAssignmentMutation();
  const mcqListRef = storage.ref();
  // Form Validation
  useEffect(() => {
    if(name !== null)
    {
      if(name.length === 0) 
        setNameError("Assignment name is required.")
      else {
        if(name.length < 4) setNameError("Name is short. (minimum characters: 4)")
        else setNameError("");
      }
    }
  }, [name])
  
  // console.log("QUESTIONS: ", questions);
  // console.log("LOADING: ", loading);

  const submitAssignments = async (node_id) => {
    let questionObjs = []
    for(let i = 0; i < questions.length; i++) {
      let image = questions[i].imagePicObj;
      console.log(image?.originFileObj);
      if(image == undefined || image == null) {
        let questionObj = {
          question: questions[i].question,
          answerChoices: questions[i].answerChoices,
          answers: questions[i].answers,
          imagePicObj: "",
        }
        questionObjs.push(questionObj);
      }
      else if(image?.originFileObj?.name !== undefined && image?.originFileObj?.name !== null) {
        let imageRef = mcqListRef.child(`mcq_images/${image?.originFileObj?.name + v4()}`);
        let snapshot = await imageRef.put(image?.originFileObj)
        let downloadURL = await snapshot.ref.getDownloadURL()
        // setLoadingMessage("Uploading Images...");
        let questionObj = {
          question: questions[i].question,
          answerChoices: questions[i].answerChoices,
          answers: questions[i].answers,
          imagePicObj: downloadURL,
        }
        questionObjs.push(questionObj);
      }
      else {
        // google drive image
        if(image?.indexOf("drive") !== -1) {
        // https://drive.google.com/file/d/1rMsPrn7yv6P9ggz0w3ElPROHspfqljIf/view?usp=sharing 
          let url = image.split("/");
          // setLoadingMessage("Saving Images from Google Drive...");
          let questionObj = {
            question: questions[i].question,
            answerChoices: questions[i].answerChoices,
            answers: questions[i].answers,
            imagePicObj: `http://drive.google.com/uc?export=view&id=${url[5]}`,
          }
          questionObjs.push(questionObj);
        }
        else {
          let questionObj = {
            question: questions[i].question,
            answerChoices: questions[i].answerChoices,
            answers: questions[i].answers,
            imagePicObj: "",
          }
          questionObjs.push(questionObj);
        }
      }
    }

    const { data } = await addMCQAssignment({
      variables: {
        node: node_id,
        name: name,
        type: "mcq",
        questions: questionObjs,
      },
    });

    setReadyToSubmit(false);
    router.reload();
  };
  
  useEffect(() => {
    if (readyToSubmit && name && name.length != 0) {
      let currNodeID = "";
      for (let i = 0; i < course.nodes?.length; i++) {
        if (course.nodes[i].positionID === currentNode?.data.id) {
          currNodeID = course.nodes[i].id;
        }
      }

      const setAssignments = async () => {
        await submitAssignments(currNodeID);
      };
      setAssignments();
    } 
  }, [readyToSubmit, questions, name]);

  return (
    <div>
      <Button
        onClick={onOpen}
        variant="outline"
        leftIcon={<AddIcon />}
        colorScheme="teal"
        fontSize="16px"
      >
        Assignment
      </Button>

      <Modal
        isOpen={isOpen}
        size={"6xl"}
        onClose={() => {
          onClose();
          setTypeOfAssignment("");
        }}
        closeOnOverlayClick={false}
        isCentered
        preserveScrollBarGap
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {typeOfAssignment === "" ? (
              <Text>Pick the Type of Assignment! 📘</Text>
            ) : (
              <Text>
                {typeOfAssignment === "mc"
                  ? "Multiple Choice Assignment 🗂"
                  : null}
                {typeOfAssignment === "fill-in-blank"
                  ? "Fill in the Blank Assignment 📝"
                  : null}
                {typeOfAssignment === "random flashcards"
                  ? "Random Flashcards Assignment 📒"
                  : null}
                {typeOfAssignment === "drag and drop"
                  ? "Drag and Drop Assignment 📖"
                  : null}
                {typeOfAssignment === "replit" ? "Embed a Replit 🖥" : null}
              </Text>
            )}
          </ModalHeader>
          <ModalBody>
            {/* https://drive.google.com/file/d/1ZlYAVeM5vqnalZT8xK6_3kjfFW7u-mFW/view?usp=sharing */}
            {typeOfAssignment === "" ? (
              <Box>
                <Flex justifyContent="space-between" alignItems="center" w="100%">
                  <Box
                    bg={bgColor}
                    p="4"
                    boxShadow="2xl"
                    rounded={{ sm: "lg" }}
                    borderWidth="2px"
                    borderColor={borderColor}
                    onClick={() => setTypeOfAssignment("mc")}
                    fontSize="18px"
                    fontWeight="bold"
                    textAlign="center"
                    ml="2" 
                    mr="2"
                  >
                    <Text>Multiple Choice 🗂</Text>
                  </Box>
                  <Box
                    bg={bgColor}
                    p="4"
                    boxShadow="2xl"
                    rounded={{ sm: "lg" }}
                    borderWidth="2px"
                    borderColor={borderColor}
                    onClick={() => setTypeOfAssignment("fill-in-blank")}
                    fontSize="18px"
                    fontWeight="bold"
                    textAlign="center"
                    ml="2" 
                    mr="2"
                  >
                    <Text>Fill in the Blanks 📝</Text>
                  </Box>
                  <Box
                    bg={bgColor}
                    p="4"
                    boxShadow="2xl"
                    rounded={{ sm: "lg" }}
                    borderWidth="2px"
                    borderColor={borderColor}
                    onClick={() => setTypeOfAssignment("random flashcards")}
                    fontSize="18px"
                    fontWeight="bold"
                    textAlign="center"
                    ml="2" 
                    mr="2"
                  >
                    <Text>Randomized Flashcards 📒</Text>
                  </Box>
                  <Box
                    bg={bgColor}
                    p="4"
                    boxShadow="2xl"
                    rounded={{ sm: "lg" }}
                    borderWidth="2px"
                    borderColor={borderColor}
                    onClick={() => setTypeOfAssignment("drag and drop")}
                    fontSize="18px"
                    fontWeight="bold"
                    textAlign="center"
                    ml="2" 
                    mr="2"
                  >
                    <Text>Drag and Drop 📖</Text>
                  </Box>
                  <Box
                    bg={bgColor}
                    p="4"
                    boxShadow="2xl"
                    rounded={{ sm: "lg" }}
                    borderWidth="2px"
                    borderColor={borderColor}
                    onClick={() => setTypeOfAssignment("replit")}
                    fontSize="18px"
                    fontWeight="bold"
                    textAlign="center"
                    ml="2" 
                    mr="2"
                  >
                    <Text>Embed a Replit 🖥</Text>
                  </Box>
                </Flex>
              </Box>
            ) : (
              <Box>
                {typeOfAssignment === "mc" ? (
                  <Box>
                    <MultipleChoiceForm
                      name={name}
                      readyToSubmit={readyToSubmit}
                      questions={questions}
                      setName={setName}
                      loading={assignmentLoading}
                      nameError={nameError}
                      setFormError={setFormError}
                      formError={formError}
                      setQuestionCount={setQuestionCount}
                      setType={setValue}
                    />
                  </Box>
                ) : null}
                {typeOfAssignment === "fill-in-blank" ? (
                  <Box>
                    <Text textAlign="center" bgClip="text" bgGradient={titleText} fontSize="30px" fontWeight="bold">Coming Soon...</Text>
                  </Box>
                ) : null}
                {typeOfAssignment === "random flashcards" ? (
                  <Box>
                    <Text textAlign="center" bgClip="text" bgGradient={titleText} fontSize="30px" fontWeight="bold">Coming Soon...</Text>
                  </Box>
                ) : null}
                {typeOfAssignment === "drag and drop" ? (
                  <Box>
                    <Text textAlign="center" bgClip="text" bgGradient={titleText} fontSize="30px" fontWeight="bold">Coming Soon...</Text>
                  </Box>
                ) : null}
                {typeOfAssignment === "replit" ? 
                  <Box>
                    <Text textAlign="center" bgClip="text" bgGradient={titleText} fontSize="30px" fontWeight="bold">Coming Soon...</Text>
                  </Box> 
                : null}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            {assignmentLoading ? 
              null
            : 
              (
                typeOfAssignment !== "" ? (
                  <Flex>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      mr="3"
                      onClick={() => setTypeOfAssignment("")}
                    >
                      Back
                    </Button>
                    <Button
                      colorScheme="linkedin"
                      onClick={() => {
                        if(value === "spreadsheet") {
                          if(formError[0] === "" && nameError == "") {
                            setReadyToSubmit(true);
                          }
                          else {
                            toast({
                              title: "Course Creation Error",
                              description: "No file was attached!",
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            })
                          }
                        }
                        else {
                          if(nameError == "") {
                            let count = 0;
                            for(let i = 0; i < formError.length; i++) {
                              if(formError[i] === "") count++;
                            }
                            if(count === parseInt(questionCount)) 
                            {
                              setReadyToSubmit(true);
                            } 
                            else {
                              toast({
                                title: "Course Creation Error",
                                description: "Make sure you have filled the form properly!",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                              })
                            }
                          }
                        }
                        
                      }}
                    >
                      Submit
                    </Button>
                  </Flex>
                ) : null
              )
            
            }
            
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AssignmentInputModal;
