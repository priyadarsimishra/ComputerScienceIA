import React, { useState, useEffect } from "react";
import { 
  Badge, 
  Box, 
  Text, 
  Flex, 
  Image, 
  Button, 
  Code, 
  useClipboard,
  Skeleton,
  useColorMode,
  useColorModeValue,
  useMediaQuery
} from "@chakra-ui/react";
import { useAuth } from "../AuthContext";
import SmallNodeProgressCard from "./SmallNodeProgressCard";
import { grayDarkMode, whiteLightMode } from "../colors";


const CourseIcon: React.FC<any> = ({ name, description, numOfStudents, courseCode, progressNodes, courseID, loading }) => {
  const { getTokenInfo }: any = useAuth();
  const { hasCopied, onCopy } = useClipboard(courseCode)
  const { colorMode } = useColorMode()
  const bgColor = useColorModeValue(whiteLightMode, "gray.700") 
  const titleText = useColorModeValue("black", "white")
  const gradientText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  // console.log("Progress Node: ", progressNodes);
  const [isLargerThan980] = useMediaQuery('(min-width: 980px)')
  
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="center">
      <Box
        bg={bgColor}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
        boxShadow={
          '0px 1px 25px -5px rgb(200 200 200 / 68%), 0 10px 10px -5px rgb(200 200 200 / 68%)'
        }
        mr="5"
        ml="5"
        _hover={{ 
          transform: "scale(1.05)",
          transition: "transform 450ms"
        }}
        w="sm"
        h="lg"
        maxW="sm"
        maxH={(isLargerThan980 ? "lg" : "md")}
      >
        <Image
          src={"/courseDefault.jpeg"}
          alt={"course_default"}
          roundedTop="lg"
        />

        <Box p="4" >
          <Flex alignItems="center" justifyContent="space-between">
            <Box
              fontSize={"22px"}
              fontWeight="bolder"
              as="h4"
              lineHeight="tight"
              isTruncated
              color={titleText}
            >
              {name}
            </Box>
            <Box mt="-5">
              {getTokenInfo()?.type === "teacher" ? 
                <Text fontSize="15px" fontWeight="light"  whiteSpace="nowrap"><b>{numOfStudents}</b> {numOfStudents == 1 ? "student" : "students"}</Text>
              : null}  
              <Badge rounded="full" px="2" fontSize="12px" colorScheme="red">
                Course
              </Badge>       
            </Box>
          </Flex>
          {getTokenInfo()?.type === "teacher" ? 
            <Flex flexDirection="column">
              <Flex justifyContent="space-between" alignContent="center" fontSize="13px" flexDirection="column">
                <Text noOfLines={5}>{description}</Text>              
              </Flex>
              <Flex alignItems="center"  position="absolute" bottom="2">
                <Text mt="2" fontWeight="medium" fontSize="15px">Course Code:  <Code fontSize="15px" colorScheme="blue" fontWeight="bold">{courseCode}</Code></Text>
                <Button onClick={onCopy} ml={2} mt={2.5} h="25px" colorScheme="facebook">
                    {hasCopied ? "Copied" : "Copy"}
                </Button>
                {/* TODO: slight bug when you click on the button it also 
                  routes you to the course page (not really important) */}
              </Flex>
            </Flex>
          : 
            <Flex justifyContent="center" alignItems="center" flexDirection="column" mt="-2">
              {loading ? <Text mt="10" fontSize="16px" fontWeight="bold"  bgClip="text" bgGradient={gradientText}>Loading...</Text> : 
                progressNodes?.length === 0 ?
                  <Text mt="10" fontSize="16px" fontWeight="medium" textAlign="center"  bgClip="text" bgGradient={gradientText}>
                      No Progress Nodes. Get Started on some assignments for progress nodes to show up here!
                  </Text> 
                : 
                (
                  progressNodes?.map((node, key) => (
                    <SmallNodeProgressCard key={key} name={node?.name} description={node?.description} parent={node?.parent} positionID={node?.positionID} node={node} courseID={courseID}/>
                  ))
                )
              }
            </Flex>
          }
        </Box>
      </Box>
    </Flex>
  );
};

export default CourseIcon;
