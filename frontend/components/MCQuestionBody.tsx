import { Container, Flex, Tag, Box, useColorMode, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const MCQuestionBody: React.FC<any> = ({
  question,
  answerChoices,
  isMultiSelect,
  initialState,
  answerOptions,
  questionNum,
  questionCompleted,
  correctAnswerOptions,
  wrongAnswerChosen,
}) => {
  const [answerSelected, setAnswerSelect] = useState<boolean[]>(initialState);
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("gray.50", "gray.800")
  const borderColor  = useColorModeValue("#2C4187", "#9DECF9")
  
  useEffect(() => {
    answerOptions[questionNum - 1] = answerSelected;
    setAnswerSelect(answerSelected);
  }, [answerSelected]);

  // TODO: fix the multi selection question issue with colors

  return (
    <div>
      <Flex flexDirection="column">
        <Container
          maxW="100%"
          border="2px solid"
          p="3"
          bgColor={bgColor}
          borderColor={borderColor}
          borderRadius="8"
        >
          {question}
        </Container>
        {isMultiSelect ? 
          <Text fontWeight="light" bgClip="text" bgGradient={titleText} fontSize="11px" mt="1" ml="1">This is a multi select question, read instructions carefully!</Text>
        : null}
        {questionCompleted ? (
          <Flex mt="5" flexDirection="column" maxW="100%">
            {answerChoices?.map((answerChoice, index) => (
              <Flex key={index}>
                {answerChoice == null ? null : (
                  <Flex mt="3" alignItems="baseline">
                    <Tag
                      size="lg"
                      bgColor={
                        (wrongAnswerChosen[index] &&
                          correctAnswerOptions[index]!) == true
                          ? "green"
                          : wrongAnswerChosen[index] !=
                              correctAnswerOptions[index]! &&
                            !correctAnswerOptions[index]
                          ? "red"
                          : ""
                      }
                      color={
                        (wrongAnswerChosen[index] &&
                          correctAnswerOptions[index]!) == true
                          ? (colorMode === "light" ? "white": "#9DECF9")
                          : wrongAnswerChosen[index] !=
                              correctAnswerOptions[index]! &&
                            !correctAnswerOptions[index]
                          ? "white"
                          : (colorMode === "light" ? "black":"white")
                      }
                    >
                      {index + 1 == 1 ? "A" : null}
                      {index + 1 == 2 ? "B" : null}
                      {index + 1 == 3 ? "C" : null}
                      {index + 1 == 4 ? "D" : null}
                      {/* {index + 1 == 5 ? "E" : null} */}
                    </Tag>
                    <Box
                      ml="2"
                      size="100%"
                      style={{ resize: "none" }}
                      p="1"
                      borderRadius="4"
                      bgColor={bgColor}
                      pl="2"
                      pr="2"
                    >
                      {answerChoice}
                    </Box>
                  </Flex>
                )}
              </Flex>
            ))}
          </Flex>
        ) : (
          <Flex 
            mt="5" 
            flexDirection="column" 
            maxW="100%"
          >
            {answerChoices?.map((answerChoice, index) => (
              <Flex key={index}>
                {answerChoice == null ? null : (
                  <Flex mt="3" alignItems="center">
                    <Tag
                      size="lg"
                      onClick={() => {
                        if (isMultiSelect) {
                          if (index == 0)
                            setAnswerSelect([
                              !answerSelected[0],
                              answerSelected[1],
                              answerSelected[2],
                              answerSelected[3],
                              answerSelected[4],
                            ]);
                          else if (index == 1)
                            setAnswerSelect([
                              answerSelected[0],
                              !answerSelected[1],
                              answerSelected[2],
                              answerSelected[3],
                              answerSelected[4],
                            ]);
                          else if (index == 2)
                            setAnswerSelect([
                              answerSelected[0],
                              answerSelected[1],
                              !answerSelected[2],
                              answerSelected[3],
                              answerSelected[4],
                            ]);
                          else if (index == 3)
                            setAnswerSelect([
                              answerSelected[0],
                              answerSelected[1],
                              answerSelected[2],
                              !answerSelected[3],
                              answerSelected[4],
                            ]);
                          else if (index == 4)
                            setAnswerSelect([
                              answerSelected[0],
                              answerSelected[1],
                              answerSelected[2],
                              answerSelected[3],
                              !answerSelected[4],
                            ]);
                        } else {
                          if (index == 0)
                            setAnswerSelect([
                              !answerSelected[0],
                              false,
                              false,
                              false,
                              false,
                            ]);
                          else if (index == 1)
                            setAnswerSelect([
                              false,
                              !answerSelected[1],
                              false,
                              false,
                              false,
                            ]);
                          else if (index == 2)
                            setAnswerSelect([
                              false,
                              false,
                              !answerSelected[2],
                              false,
                              false,
                            ]);
                          else if (index == 3)
                            setAnswerSelect([
                              false,
                              false,
                              false,
                              !answerSelected[3],
                              false,
                            ]);
                          else if (index == 4)
                            setAnswerSelect([
                              false,
                              false,
                              false,
                              false,
                              !answerSelected[4],
                            ]);
                        }
                      }}
                      bgColor={answerSelected[index] ? borderColor : ""}
                      color={answerSelected[index] ? (colorMode === "light" ? "white": "#2C4187") : (colorMode === "light" ? "#2C4187": "#9DECF9")}
                    >
                      {index + 1 == 1 ? "A" : null}
                      {index + 1 == 2 ? "B" : null}
                      {index + 1 == 3 ? "C" : null}
                      {index + 1 == 4 ? "D" : null}
                      {index + 1 == 5 ? "E" : null}
                    </Tag>
                    <Box
                      ml="2"
                      size="100%"
                      style={{ resize: "none" }}
                      p="1"
                      borderRadius="4"
                      bgColor={bgColor}
                      pl="2"
                      pr="2"
                    >
                      {answerChoice}
                    </Box>
                  </Flex>
                )}
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    </div>
  );
};

export default MCQuestionBody;
