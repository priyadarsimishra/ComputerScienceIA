import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  Box,
  VStack,
  StackDivider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import StudentProgressCard from "../../../../components/StudentProgressCard";
import { useAuth } from "../../../../AuthContext";
import { useGetCoursesBasedOnIdMutation, useGetStudentsBasedOnCourseMutation } from "../../../../generated/graphql";
import { getMasteryOfStudent, getChildrenOfNodeOnSameLayer, getCourseMastery } from "../../../../utils"
import Loading from "../../../../components/Loading";
import { grayDarkMode } from "../../../../colors";
import Head from "next/head";

const ClassProgress: React.FC<any> = ({  }) => {
  const { colorMode } = useColorMode();
  const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF,#2C4187)", `linear(to-t,${grayDarkMode},blue.500, ${grayDarkMode})`)
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const { setAccessToken, getTokenInfo, accessToken, refreshToken, setRefreshToken } : any = useAuth();
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState<any>();
  const [currNode, setCurrNode] = useState<any>();
  const [prevNode, setPrevNode]  = useState<any>();
  const [currStudents, setCurrStudents] = useState<any>([]);
  const [courseMastery, setCourseMastery] = useState(0);
  const [getCoursesBasedOnID, {loading: courseLoading}] = useGetCoursesBasedOnIdMutation();
  const [getStudentsBasedOnCourse, {loading: studentLoading}] = useGetStudentsBasedOnCourseMutation();
  // console.log(prevNode);
  // if(currCourse && currStudents)
  //   console.log(getMasteryOfStudent(currCourse, currCourse?.nodes[0], currStudents[0]?.id));
  
  useEffect(() => {
    fetch("http://localhost:5001/refresh_token", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({refreshToken: localStorage.getItem("refreshToken")})
    }).then(async (res) => {
      const { accessToken, refreshToken } = await res.json();
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    });
  }, []);

  useEffect(() => {
    if(accessToken !== null) {
      const getCourses = async () => {
        let {data} = await getCoursesBasedOnID({
          variables: { 
            id: getTokenInfo()?.userID
          }
        })
        let courses = data.getCoursesBasedOnID;
        setCourses(courses)
        setCurrCourse(data.getCoursesBasedOnID[0])
      } 
  
      getCourses();
    }
  }, [accessToken])

  useEffect(() => {
    if(currCourse !== undefined) {
      const getStudents = async () => {
        let { data } = await getStudentsBasedOnCourse({
          variables: { 
            courseID: currCourse?.id
          }
        })

        setCurrStudents(data.getStudentsBasedOnCourse)
        // setCurrNode(currCourse?.nodes[0])
        let currNodeCopy;
        for(let i = 0; i < currCourse?.nodes.length; i++) {
          if(currCourse?.nodes[i].parent.length === 0) {
            currNodeCopy = currCourse?.nodes[i];
            setCurrNode(currCourse?.nodes[i])
            break;
          }
        }
        setPrevNode(undefined)
        let mastery = getCourseMastery(currCourse, currNodeCopy, data.getStudentsBasedOnCourse);
        // console.log(mastery);
        setCourseMastery((mastery ? mastery : 0));
      }

      getStudents()
    }
  }, [currCourse])

  const setNewCourse = (name) => {
    for (let i = 0; i < courses.length; i++) {
      if(courses[i].name === name) {
        setCurrCourse(courses[i]);
        break;
      }
    }
  }
  const setNewPrevNode = (prevNode) => {
    for (let i = 0; i < currCourse?.nodes.length; i++) {
      if(currCourse?.nodes[i].positionID === prevNode.parent[prevNode.parent.length - 1]) { 
        setPrevNode(currCourse?.nodes[i])
        return;
      }
    }
    setPrevNode(undefined);
  }

  const setNewCurrNode = (name) => {
    let children = getChildrenOfNodeOnSameLayer(currCourse, currNode?.positionID)    
    let newNode;
    for (let i = 0; i < children.length; i++) {
      if(children[i].name === name) {
        newNode = children[i];
        setCurrNode(children[i]);
        break;
      }
    }
    let mastery = getCourseMastery(currCourse, newNode, currStudents);
    setCourseMastery((mastery ? mastery : 0));
    setNewPrevNode(newNode)
  }

  return (
    <div>
      <Head>
        <title>Class Progress</title>
      </Head>
      {courseLoading ? <Loading /> :

        <div>
          <Navbar type="teacher" />
          <Flex w="100%" h="92.7vh">
            <Flex flexDirection="column" w="50%" bgGradient={bgColorGradient}>
              <Flex p="4" w="100%">
                <Menu>
                  <MenuButton
                    as={Button}
                    px={4}
                    py={2}
                    transition='all 0.2s'
                    borderRadius='md'
                    border="1px solid white"
                    colorScheme="messenger"
                    boxShadow="1px 1px 16px #0066FF,-1px -1px 16px #0099FF;"
                    // color="white"
                    // _hover={{ bg: 'blue.400' }}
                    // _expanded={{ bg: 'white.400' }}
                    // _focus={{ boxShadow: 'outline' }}                    
                  >
                    {currCourse?.name} <ChevronDownIcon />
                  </MenuButton>
                  <MenuList>
                    {courses?.map((course, index) => (
                      <MenuItem key={index} value={course.name} onClick={(evt) => {
                        const target = evt.target as HTMLInputElement
                        setNewCourse(target.value)
                      }}>{course.name}</MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Flex>
              <Flex
                w="100%"
                justifyContent="center"
                flexDirection="column"
              >
                <Flex justifyContent="center" alignItems="center">
                  <CircularProgress
                    value={courseMastery}
                    color={(colorMode === "light" ? "pink.500": "pink.400")}
                    // bg="blue.800"
                    size="35vh"
                    // mb="auto"
                    mt="15vh"
                  >
                    <CircularProgressLabel color={(colorMode === "light" ? "pink.100": "pink.200")} fontWeight="bold">
                      {courseMastery}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </Flex>
                <Text mr="auto" ml="auto" fontSize="24px" fontWeight="bold" color="white">
                  Class&apos;s Mastery
                </Text>
                <Flex mt="4" w="100%" justifyContent="center">
                  <Menu>
                    <MenuButton 
                      as={Button} 
                      rightIcon={<ChevronDownIcon />} 
                      boxShadow="2px 2px 16px #F48FB1,-2px -2px 16px #EC407A;"
                      colorScheme="pink" 
                      border="1px solid white"
                      bgGradient="white"                 
                      fontWeight="bold"
                    >
                      {currNode?.name}
                    </MenuButton>
                    <MenuList>
                      {getChildrenOfNodeOnSameLayer(currCourse, currNode?.positionID).length === 0 ? 
                        <MenuItem fontWeight="bold">No more nodes.</MenuItem>
                      : 
                        (getChildrenOfNodeOnSameLayer(currCourse, currNode?.positionID).map((node, index) => (
                          <MenuItem value={node.name} key={index} onClick={(evt) => {
                            const target = evt.target as HTMLInputElement
                            setNewCurrNode(target.value)
                          }}>{node.name}</MenuItem>
                        )))
                      }
                      
                    </MenuList>
                  </Menu>
                </Flex> 
                {prevNode ? 
                  <Text 
                    color="white" 
                    textAlign="center" 
                    mt="10" 
                    fontSize="18px" 
                    fontWeight="extrabold" 
                    onClick={() => {
                      setCurrNode(prevNode);
                      let mastery = getCourseMastery(currCourse, prevNode, currStudents);
                      setCourseMastery(mastery ? mastery : 0);
                      setNewPrevNode(prevNode);
                    }}> <ChevronLeftIcon 
                  /> 
                  {prevNode.name}
                  </Text> : null}
              </Flex>
            </Flex>
            <Flex
              w="50%"
              // border="2px solid black"
              preserveScrollBarGap
              scrollBehavior="inside"
            >
              <VStack
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
                align="stretch"
                w="100%"
                p="5"
                h="100%"
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
                {currStudents?.length === 0 ? <Text mt="15" fontSize="38px" bgClip="text" bgGradient={titleText} fontWeight="bold" textAlign="center">No students were found.</Text>:
                  (currStudents?.map((student, index) => (
                    <StudentProgressCard name={student.username} studentId={student?.id} currNodeId={currNode?.id} profilePic={student.profilePic} mastery={(getMasteryOfStudent(currCourse, currNode, currStudents[index]?.id) ? getMasteryOfStudent(currCourse, currNode, currStudents[index]?.id): 0)} key={index} />
                  )))
                }
              </VStack>
            </Flex>
          </Flex>
        </div>
      }
      
    </div>
  );
};

export default ClassProgress;
