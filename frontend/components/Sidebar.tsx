import { Box, Button, Code, Flex, Heading, Image, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useClipboard, Progress, useColorMode, useColorModeValue, Tag } from "@chakra-ui/react";
import { useAuth } from "../AuthContext";
import React, { useState, useEffect } from "react";
import AssignmentInputModal from "./AssignmentInputModal";
import AssignmentModal from "./AssignmentModal";
import AssignmentCard from "./AssignmentCard";
import NodeModifier from "./NodeModifier";
import ResourcesModal from "./ResourcesModal";
import ResourceCard from "./ResourceCard";

const Sidebar = ({ type, course, currentNode }) => {
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("white", "gray.900")
  const borderColor  = useColorModeValue("2C4187", "#9DECF9")
  const[code, setCode] = useState(course?.courseCode);
  const [status, setStatus] = useState<any>(null);
  const[masteryForNode, setMasteryForNode] = useState<any>(0);
  const { hasCopied, onCopy } = useClipboard(code)
  const { getTokenInfo }: any = useAuth();

  // console.log(currentNode?.data.resources);

  const getChildrenOfNode = (nodePositionID) => {
    let children = []
    for(let i = 0; i < course?.nodes.length; i++) {
      if(course.nodes[i].parent.indexOf(nodePositionID) != -1) {
        children.push(course.nodes[i]);
      }
    }
    return children;
  } 

  useEffect(() => {
    if(currentNode)
    {
      // TODO: will be O(n^2) - future update try to make this faster
      // This computes current nodes progress
      let numOfAssignment = currentNode?.data.assignments?.length;
      let children = getChildrenOfNode(currentNode.data.id);
      let totalScore = 0;

      if(numOfAssignment == 0 && children.length === 0) {
        setMasteryForNode(0);
        return;
      }

      for(let i = 0; i < numOfAssignment; i++){
        let assignment = currentNode.data.assignments[i];
        for(let j = 0; j < assignment.studentScores?.length; j++)
        {
          if(assignment.studentScores[j].studentID === getTokenInfo()?.userID)
          {
            totalScore += (assignment?.studentScores[j].studentScore);
          }
        }
      }
      
      let filteredAssignments = []
      for(let i = 0; i < children?.length; i++){
        if(children[i].assignments?.length !== 0)
        {
          for(let j = 0; j < children[i].assignments?.length; j++)
            filteredAssignments.push(children[i].assignments[j]);
        }
      }

      numOfAssignment += filteredAssignments?.length;
      for(let i = 0; i < filteredAssignments?.length; i++){
        let assignment = filteredAssignments[i];
        for(let j = 0; j < assignment.studentScores?.length; j++)
        {
          if(assignment.studentScores[j].studentID === getTokenInfo()?.userID)
          {
            totalScore += (assignment?.studentScores[j].studentScore);
          }
        }
      }

      let currNodeMastery = Math.round(((totalScore/100)/numOfAssignment)*100);
      setMasteryForNode(currNodeMastery);

      let found = false;
      for(let i = 0; i < currentNode.data.status.length; i++) {
        if(currentNode.data.status[i].studentID === getTokenInfo()?.userID) {
          found = true;
          setStatus(currentNode.data.status[i].state);
          break;
        }
      }

      if(!found) setStatus(null);
    }
  }, [currentNode])

  return (
    <Box
      minW="30%"
      maxH={"100%"}
      border="2px"
      bgColor={bgColor}
      borderColor={borderColor}
      borderTopRightRadius={15}
      borderBottomRightRadius={15}
      zIndex={3}
      css={{ 
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
        '&::-webkit-scrollbar': { 
          display: "none"
        },
        "border-radius": "5px",
      }}
    >
      <Stack p="3">
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Heading as="h1" fontWeight="bold" noOfLines={1} color={(colorMode === "light" ? "black": "#9DECF9")}>{course?.name}</Heading>
          <Code mt="2" mb="2" borderRadius="10" p="2" color={(colorMode === "light" ? "blue.800": "#9DECF9")}>
            <Text noOfLines={5}>
              {course?.description}
            </Text>
          </Code>
          <Flex alignItems="center" justifyContent="center">
            <Text mt="2" fontWeight="medium" fontSize="24px">Course Code:  <Code fontSize="20px" colorScheme="blue" fontWeight="bold">{code}</Code></Text>
            <Button onClick={onCopy} ml={2} mt={3.5} h="30px" colorScheme="facebook">
                {hasCopied ? "Copied" : "Copy"}
            </Button>
          </Flex>
          {/* <Text>Current Node: {currentNode?.name}</Text> */}
        </Flex>
      </Stack>
      <Box mt="6" w="100%" alignItems="center" justifyContent="center">
        <Tabs variant='enclosed' colorScheme='linkedin' w="100%" isFitted>
          <TabList>
            <Tab fontSize="15px" fontWeight="bold" whiteSpace="nowrap">📙 Assignments</Tab>
            <Tab fontSize="15px" fontWeight="bold" whiteSpace="nowrap">📚 Resources</Tab>
            <Tab fontSize="15px" fontWeight="bold" whiteSpace="nowrap">🗄 Info</Tab>
          </TabList>
          <TabPanels>
            <TabPanel h="100%">
            {type === "teacher" ? (
              <Box>
                <Box p="3">
                  <AssignmentInputModal
                    id={course?.id}
                    currentNode={currentNode}
                    course={course}
                  />
                </Box>
                <Box 
                  p="3" 
                  mt="5"
                  w="100%"
                  h={window.innerHeight * 0.42}
                  flexDirection="column"
                  css={{ 
                    display: "flex",
                    overflowY: "auto",
                    position: "relative",
                    '&::-webkit-scrollbar': { 
                      display: "none"
                    },
                    "border-radius": "5px",
                  }}
                >
                  {currentNode?.data.assignments?.length === 0 ? <Text textAlign="center" fontSize="2vh" fontWeight="bold" bgClip="text" bgGradient={titleText}>No Assignments are attached to this Node.</Text>: 
                      (
                        currentNode?.data.assignments?.map((assignment, index) => (
                          <AssignmentCard accountType={type} name={assignment.name} id={currentNode.data.dbID} key={index}/>
                        ))
                      )
                    }
                </Box>
              </Box>
            ) : (
              // for students
              <Box p="3" h="100%">
                {status ? 
                  <Flex mb="3" justifyContent="space-between">
                    <Flex>

                    </Flex>
                    <Flex>
                      <Tag colorScheme="yellow">{status}</Tag>
                    </Flex>
                  </Flex>
                : null}
                
                <Box p="2" mt="-4">
                  <Text fontSize="16px" color={(colorMode === "light" ? "pink.600": "pink.200")}><b>{masteryForNode}%</b> Mastery</Text>
                  <Progress hasStripe value={masteryForNode} colorScheme="pink" size="lg" isAnimated={true}/>
                </Box>
                <Flex
                  mt="2"
                  ml="1.5"
                  width="98%"
                  h={window.innerHeight * 0.42}
                  flexDirection="column"
                  p="2"
                  css={{ 
                    display: "flex",
                    overflowY: "auto",
                    position: "relative",
                    '&::-webkit-scrollbar': { 
                      display: "none"
                    },
                    "border-radius": "5px",
                  }}
                >
                  {currentNode?.data.assignments?.length === 0 ? <Text textAlign="center" fontSize="2vh" fontWeight="bold" bgClip="text" bgGradient={titleText}>No Assignments are attached to this Node.</Text>: 
                    (
                      currentNode?.data.assignments?.map((assignment, index) => (
                        <AssignmentModal assignment={assignment} node={currentNode} key={index}/>
                      ))
                    )
                  }
                  
                </Flex>
              </Box>
            )}
            </TabPanel>
            <TabPanel>
              {/* <Flex justifyContent="center" alignItems="center" textAlign="center" flexDirection="column" mt="5"> */}
              <Box p="2">
                {type === 'teacher' ? <ResourcesModal nodeID={currentNode?.data.dbID}/> : null}
                
                <Box 
                  mt="5" 
                  w="100%"
                  h={window.innerHeight * 0.42}
                  flexDirection="column"
                  p="2"
                  css={{ 
                    display: "flex",
                    overflowY: "auto",
                    position: "relative",
                    '&::-webkit-scrollbar': { 
                      display: "none"
                    },
                    "border-radius": "5px",
                  }}
                >
                  {currentNode?.data.resources?.length === 0 ? <Text textAlign="center" fontSize="2vh" fontWeight="bold" bgClip="text" bgGradient={titleText}>No Resources are attached to this Node.</Text>: 
                    (
                      currentNode?.data.resources?.map((resource, index) => (
                        <ResourceCard accountType={type} courseID={course.id} id={currentNode.data.dbID} name={resource.resourceName} type={resource.type} link={resource.link} key={index}/>
                      ))
                    )
                  }
                </Box>
                {/* <Image
                  width="90px"
                  height="90px"
                  src={(colorMode === "light" ? "/MasterItLogo_light.png": "/MasterItLogo_dark.png")}
                  alt="logo"
                />
                
                <Text bgClip="text" bgGradient={titleText} vAlign="center" hAlign="center" fontSize="2.5vh" fontWeight="bold">Resources Are Coming Soon!</Text> */}
              {/* </Flex> */}
              </Box>
            </TabPanel>
            <TabPanel>
              {type === "teacher" ?
                <NodeModifier currentNode={currentNode} course={course}/>
              : null}
              <Box
                h="15vw"
                css={{ 
                  display: "flex",
                  overflowY: "auto",
                  position: "relative",
                  '&::-webkit-scrollbar': { 
                    display: "none"
                  },
                  "border-radius": "5px",
                }}
              >
                {currentNode?.data.description == "-1" ? 
                  <Box textAlign={"center"} mt="10">
                    <Text bgClip="text" bgGradient={titleText} fontSize="2vh" fontWeight="bold">
                      No Description! 
                    </Text>
                    <Text  bgClip="text" bgGradient={titleText} fontSize="2vh" fontWeight="bold">
                      You will be able to add a description to this node in a future update!
                    </Text>
                  </Box> : 
                  (
                    <Box textAlign={"center"} mt="10">
                      <Text bgClip="text" bgGradient={titleText} fontSize="2vh" fontWeight="bold">
                        {currentNode?.data.description}
                      </Text>
                    </Box>
                  )}
                </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

     
    </Box>
  );
};

export default Sidebar;