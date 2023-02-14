import {
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Divider,
  FormHelperText,
  Flex,
  Tag,
  Input,
  Text,
  Box,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Upload } from 'antd';
const { Dragger } = Upload;
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

const MCQForm = ({ number, readyToSubmit, questions, setFormError, formError }) => {
  const [image, setImage] = useState<any>(null);
  const { colorMode } = useColorMode();
  // const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  // const bgColor = useColorModeValue("white.50", "gray.800")
  // const borderColor  = useColorModeValue("#2C4187", "#9DECF9")
  const [answerColors, setAnswerColors] = useState<boolean[]>([]); // true - green, false - red -> last false is option for multi select
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  // const [questionError, setQuestionError] = useState<boolean>();
  const [choice1, setChoice1] = useState<string>("");
  const [choice2, setChoice2] = useState<string>("");
  const [choice3, setChoice3] = useState<string>("");
  const [choice4, setChoice4] = useState<string>("");
  // const [choice5, setChoice5] = useState<string>("");
  useEffect(() => {setAnswerColors([
    false,
    false,
    false,
    false,
    // false,
  ])}, [])
  
  useEffect(() => {
    if(formError[formError.length - 1] !== "") {
      if(question !== "" && choice1 !== "" && choice2 !== "" && choice3 !== "" && choice4 !== "" && answerColors.indexOf(true) !== -1) {
        setFormError([...formError, ""])
        // console.log("here");
      }
      else {
        setFormError([...formError, "Need to fill out questions properly"]);
        // console.log("here");
      }
    }
    else {
      if(question === "" || choice1 === "" || choice2 === "" || choice3 === "" || choice4 === "" || answerColors.indexOf(true) === -1) {
        setFormError([...formError, "Need to fill out questions properly"]);
        // console.log("here");
      }
    }
  }, [question, choice1, choice2, choice3, choice4, answerColors])

  useEffect(() => {
    if (readyToSubmit) {
      let answerChoices = [
        choice1,
        choice2,
        choice3,
        choice4,
        // choice5 === "" ? undefined : choice5,
      ];

      let questionObject = {
        question: question,
        answerChoices: answerChoices,
        answers: answerColors,
        imagePicObj: image,
      };

      let yesAdd: boolean = true;
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].question === question) yesAdd = false;
      }
      console.log("QO: ", questionObject)
      if (yesAdd) questions.push(questionObject);
    }

  }, [readyToSubmit]);

  return (
    <Box mb="2" mt="3">
      <VStack>
        <FormControl>
          <Flex>
            <FormLabel>Question #{number}</FormLabel>
            <Flex>
              <Text fontWeight="bold" ml="3">
                Multi-select Question?
              </Text>
              <Switch
                color="red"
                size="md"
                ml="3"
                mr="5"
                mt="4px"
                onChange={() => setMultiSelect(!multiSelect)}
              />
              {/* TODO: add action prop to remove upload error on prod: https://stackoverflow.com/questions/60414352/next-js-ant-design-dragger-file-upload-fails-on-deployed-instance */}
            </Flex>
          </Flex>
          <Textarea
            placeholder="Enter the question here"
            size="sm"
            variant="outline"
            style={{ resize: "none" }}
            value={question}
            onChange={(evt) => setQuestion(evt.target.value)}
            mt="2"
          />
          <FormHelperText>
            {multiSelect
              ? "Click on multiple letters to set the correct answers!"
              : "Click on the letter to set the correct answer!"}
          </FormHelperText>
          <Flex mt="3" justifyContent="center" align="center">
            <Tag
              size="lg"
              colorScheme={answerColors[0] ? "green" : "red"}
              onClick={() => {
                if (!multiSelect) {
                  setAnswerColors([
                    !answerColors[0],
                    false,
                    false,
                    false,
                    // false,
                  ]);
                } else {
                  setAnswerColors([
                    !answerColors[0],
                    answerColors[1],
                    answerColors[2],
                    answerColors[3],
                    // answerColors[4],
                  ]);
                }
              }}
            >
              A
            </Tag>
            <Input
              ml="2"
              placeholder="Answer choice A"
              size="sm"
              variant="outline"
              style={{ resize: "none" }}
              value={choice1}
              onChange={(evt) => setChoice1(evt.target.value)}
            />
          </Flex>
          <Flex mt="3" justifyContent="center" align="center">
            <Tag
              size="lg"
              colorScheme={answerColors[1] ? "green" : "red"}
              onClick={() => {
                if (!multiSelect) {
                  setAnswerColors([
                    false,
                    !answerColors[1],
                    false,
                    false,
                    // false,
                  ]);
                } else {
                  setAnswerColors([
                    answerColors[0],
                    !answerColors[1],
                    answerColors[2],
                    answerColors[3],
                    // answerColors[4],
                  ]);
                }
              }}
            >
              B
            </Tag>
            <Input
              ml="2"
              placeholder="Answer choice B"
              size="sm"
              variant="outline"
              style={{ resize: "none" }}
              value={choice2}
              onChange={(evt) => setChoice2(evt.target.value)}
            />
          </Flex>
          <Flex mt="3" justifyContent="center" align="center">
            <Tag
              size="lg"
              colorScheme={answerColors[2] ? "green" : "red"}
              onClick={() => {
                if (!multiSelect) {
                  setAnswerColors([
                    false,
                    false,
                    !answerColors[2],
                    false,
                    // false,
                  ]);
                } else {
                  setAnswerColors([
                    answerColors[0],
                    answerColors[1],
                    !answerColors[2],
                    answerColors[3],
                    // answerColors[4],
                  ]);
                }
              }}
            >
              C
            </Tag>
            <Input
              ml="2"
              placeholder="Answer choice C"
              size="sm"
              variant="outline"
              style={{ resize: "none" }}
              value={choice3}
              onChange={(evt) => setChoice3(evt.target.value)}
            />
          </Flex>
          <Flex mt="3" justifyContent="center" align="center">
            <Tag
              size="lg"
              colorScheme={answerColors[3] ? "green" : "red"}
              onClick={() => {
                if (!multiSelect) {
                  setAnswerColors([
                    false,
                    false,
                    false,
                    !answerColors[3],
                    // false,
                  ]);
                } else {
                  setAnswerColors([
                    answerColors[0],
                    answerColors[1],
                    answerColors[2],
                    !answerColors[3],
                    // answerColors[4],
                  ]);
                }
              }}
            >
              D
            </Tag>
            <Input
              ml="2"
              placeholder="Answer choice D"
              size="sm"
              variant="outline"
              style={{ resize: "none" }}
              value={choice4}
              onChange={(evt) => setChoice4(evt.target.value)}
            />
          </Flex>
          {/* {multiSelect ? (
            <Flex mt="3" justifyContent="center" align="center">
              <Tag
                size="lg"
                colorScheme={answerColors[4] ? "green" : "red"}
                onClick={() => {
                  if (!multiSelect) {
                    setAnswerColors([
                      false,
                      false,
                      false,
                      false,
                      !answerColors[4],
                    ]);
                  } else {
                    setAnswerColors([
                      answerColors[0],
                      answerColors[1],
                      answerColors[2],
                      answerColors[3],
                      !answerColors[4],
                    ]);
                  }
                }}
              >
                E
              </Tag>
              <Input
                ml="2"
                placeholder="Answer choice E"
                size="sm"
                variant="outline"
                style={{ resize: "none" }}
                value={choice5}
                onChange={(evt) => setChoice5(evt.target.value)}
              />
            </Flex>
          ) : null} */}
          <Dragger 
            multiple={false} 
            onChange={(event) => setImage(event.file)}
            style={{backgroundColor: (colorMode === "light" ? "#F7FAFC" : "#171923"), marginTop:"10px"}}
            // itemRender={(_, file) => {
            //   return <p style={{color: (colorMode === "light" ? "#2C4187" : "#9DECF9")}}>{file.name}</p>
            // }}
            // TODO: try to make the progress text color better for dark mode
            maxCount={1}
          >
            <Flex alignItems="center" justifyContent="center">
              <UploadOutlined style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9"), fontSize: "18px", marginTop: "-5px"}}/>
              <p className="ant-upload-text" style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9"), fontWeight: "bold", marginLeft:"8px"}}>Upload</p>
            </Flex>
            <p  className="ant-upload-text" style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}>You can upload an image for the question above!</p>
          </Dragger>
        </FormControl>

      </VStack>
      <Divider orientation="horizontal" mt="4" />
    </Box>
  );
};

export default MCQForm;
