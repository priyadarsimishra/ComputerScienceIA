import {  Tag, Tooltip, Box, Flex, Input, Spinner, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, FormErrorMessage, FormControl, NumberInputStepper, Radio, RadioGroup, Stack, Text, useColorMode, Divider } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MCQComponent from './MCQComponent';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
import * as XLSX from "xlsx";

const MultipleChoiceStructure = ({ readyToSubmit, questions, name, setName, loading, nameError, setFormError, formError, setQuestionCount, setType }) => {
  const [value, setValue] = useState("manual");
  const [numOfQuestions, setNumOfQuestions] = useState<string>("2"); // using a string will be converted to number later
  const [listOfQuestions, setListOfQuestions] = useState<any>([]);
  const [sheetParsed, setSheetParsed] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setType(value);
  }, [value])

  useEffect(() => {
    setQuestionCount(numOfQuestions)
  }, [numOfQuestions])

  useEffect(() => {
    if(sheetParsed)
      setFormError([""]);
  }, [sheetParsed]);

  const keysToLowerCase = (obj) => {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj={}
    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = obj[key];
    }
    return newobj
  }
  const getAnswersArray = (answers) => {
    let answersArray = [false, false, false, false, false];
    for(let i = 0; i < answers.length; i++) {
      let answer = answers[i].toLowerCase().trim();
      if(answer == 'a') answersArray[0] = true;
      else if(answer == 'b') answersArray[1] = true;
      else if(answer == 'c') answersArray[2] = true;
      else if(answer == 'd') answersArray[3] = true;
    }
    return answersArray;
  }
  useEffect(() => {
    if(sheetParsed && listOfQuestions?.length > 0 && value === 'spreadsheet'){
      let questionsList = listOfQuestions;
      for(let i = 0; i < questionsList.length; i++) {
        let questionsListFiltered = keysToLowerCase(questionsList[i]);
        questionsList[i] = questionsListFiltered;
      }
      // console.log("IN MCQ FORM: ", questionsList);
      for(let i = 0; i < questionsList.length; i++) {
        let questionParsed = questionsList[i];
        let answerChoices = [questionParsed['a'], questionParsed['b'], questionParsed['c'], questionParsed['d'], null]
        let imagePicObj = questionParsed['image']
        let answers = getAnswersArray(questionParsed['answer'].split(","))
        let questionObj = {
          question: questionParsed['question'],
          answerChoices: answerChoices,
          answers: answers,
          imagePicObj: imagePicObj,
        }
        questions.push(questionObj);
      }
      setSheetParsed(false);
    }
  }, [sheetParsed])

  const showMCForms = () => {
    if(numOfQuestions === "0" || numOfQuestions === "") {
      setNumOfQuestions("1");
      return;
    }
    let num = parseInt(numOfQuestions);
    let arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push(i);
    }
    return (
      <div>
        {arr.map((item, index) => (
          <MCQComponent key={index} number={item} readyToSubmit={readyToSubmit} questions={questions} setFormError={setFormError} formError={formError}/>
        ))}
      </div>
    )
  }

  return (
    <div>
      {loading ? 
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Spinner
            thickness='15px'
            speed='1.20s'
            emptyColor={(colorMode === 'light' ? "#2C4187": "#9DECF9")}
            width="150px"
            height="150px"
          />
          <Text fontSize="24px" textAlign="center" mt="5" fontWeight="bold" color={(colorMode === "light" ? "#4299E1" :"#9DECF9")}>Loading...</Text>   
        </Flex>
      : 
        <Stack>
          <FormControl isInvalid={(nameError && nameError !== "") ? true: false}>
            <Flex alignItems="center">
              <Text fontWeight="bold">Assignment Name </Text>
              <Input
                placeholder="Assignment Name"
                width="30%"
                ml="10"
                value={name}
                onChange={(evt) => { setName(evt.target.value); }}
              />
            </Flex>
            <FormErrorMessage>{nameError}</FormErrorMessage>
          </FormControl>
          <Flex alignItems="center">
            <Text fontWeight="bold">Question Input Format </Text>
            <RadioGroup onChange={setValue} value={value} ml="3">
              <Radio size="md" name="manual" value="manual" color="#C2C2C2">Manual</Radio>
              <Radio size="md" name="spreadsheet" value="spreadsheet" ml="3" color="#C2C2C2">Spreadsheet</Radio>
            </RadioGroup>
          </Flex>
          <Divider mt="5" mb="5" />
          {
            value === "manual" ?
              <Box>
                <Flex alignItems="center">
                  <Text fontWeight="bold">Number of Questions </Text>
                  <NumberInput value={numOfQuestions} ml="4" onChange={setNumOfQuestions} min={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
                {showMCForms()}
              </Box>
              : 
              <Box>
                <Flex flexDirection="column" mb="6">
                    <Flex flexDirection="column">
                        <Text fontSize="18px">
                            <b>Spreadsheet File Format</b> (case sensitive)
                        </Text>
                        <Text fontSize="12px" fontWeight="light">Hover over the tags to get more information.</Text>
                    </Flex>
                    <Flex justifyContent={"space-between"} mt="2">
                        <Tooltip label="This is the text for the question.">
                            <Tag colorScheme="cyan">Question</Tag>
                        </Tooltip>
                        <Tooltip label="This is the image URL from google drive or online">
                            <Tag colorScheme="cyan">Image</Tag>
                        </Tooltip>
                        <Tooltip label="Answer Choice A">
                            <Tag colorScheme="cyan">A</Tag>
                        </Tooltip>
                        <Tooltip label="Answer Choice B">
                            <Tag colorScheme="cyan">B</Tag>
                        </Tooltip>
                        <Tooltip label="Answer Choice C">
                            <Tag colorScheme="cyan">C</Tag>
                        </Tooltip>
                        <Tooltip label="Answer Choice D">
                            <Tag colorScheme="cyan">D</Tag>
                        </Tooltip>
                        <Tooltip label="List the answer option (A/B/C/D) or answer options for multi select questions separated by commas like 'A,B,C'">
                            <Tag colorScheme="cyan">Answer</Tag>
                        </Tooltip>
                    </Flex>
                </Flex>
                <Dragger 
                  multiple={false} 
                  maxCount={1} 
                  style={{backgroundColor: (colorMode === "light" ? "#F7FAFC" : "#171923")}}
                  beforeUpload={file => {
                    var f = file;
                    const reader = new FileReader();
                    let sheetRows = []
                    reader.onload = (evt) => {
                        const bstr = evt.target.result;
                        const wb = XLSX.read(bstr, { type: "binary" });
                        wb.SheetNames.forEach((sheet) => {
                            let rowObject = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
                            let jsonObject: string = JSON.stringify(rowObject);
                            sheetRows.push(JSON.parse(jsonObject));
                            // setListOfQuestions(JSON.parse(jsonObject));
                        });
                        setListOfQuestions(sheetRows[0]);
                        // TODO: make sure the [0] works for all spreadsheets (aka ones with only one sheet)
                        setSheetParsed(true);
                    };
                    reader.readAsBinaryString(f);
                    return false
                  }}
              >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined type="inbox" style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}/>
                </p>
                <p className="ant-upload-text" style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}>Click or drag file to this area to upload</p>
                <p className="ant-upload-hint" style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}>
                  Upload Spreadsheet files based on the proper format presented above.
                </p>
              </Dragger>
              </Box>
          }

        </Stack>
      }
    </div>
  )
}

export default MultipleChoiceStructure;