import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Badge, Tag, Skeleton, SkeletonText, useColorMode, useColorModeValue, useMediaQuery } from "@chakra-ui/react";
import {useAuth} from "../AuthContext";
import { useGetNodesBasedOnCourseMutation } from "../generated/graphql";
import { whiteLightMode, grayDarkMode } from '../colors';

const SmallNodeProgressCard: React.FC<any> = ({name, description, parent, positionID, node, courseID}) => {
    const { colorMode } = useColorMode()
    const bgColor = useColorModeValue("gray.200", "gray.900") 
    const borderColor = useColorModeValue("#E2E8F0", "gray.800")
    const [mastery, setMastery] = useState(-1);
    const [nodeTypeColor, setNodeTypeColor] = useState<any>();
    const [nodeType, setNodeType] = useState<any>("");
    const { getTokenInfo } :any = useAuth();
    const [getNodesBasedOnCourse, {loading: nodeLoading}] = useGetNodesBasedOnCourseMutation();
    const [isLargerThan980] = useMediaQuery('(min-width: 980px)')

    const getChildrenOfNode = (nodes, nodePositionID) => {
        let children = []
        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i]?.parent.indexOf(nodePositionID) != -1) {
            children.push(nodes[i]);
            }
        }
        return children;
    } 

    useEffect(() => {
        if(node)
        {
            let numOfAssignment = node.assignments.length;
            let totalScore = 0;

            if(numOfAssignment === 0)
            {
                setMastery(0);
                return;
            }

            for(let i = 0; i < numOfAssignment; i++){
                let assignment = node.assignments[i];
                for(let j = 0; j < assignment.studentScores?.length; j++)
                {
                    if(assignment.studentScores[j].studentID === getTokenInfo()?.userID)
                    {
                        totalScore += (assignment?.studentScores[j].studentScore);
                    }
                }
            }

            let nodes = []

            getNodesBasedOnCourse({
                variables: { 
                    courseID: courseID,
                }
            }).then((data) => {
                nodes = data.data.getNodesBasedOnCourse;
                let children = getChildrenOfNode(nodes, positionID);
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
                setMastery(currNodeMastery);
            });
        

            // === "Unit"
            if(parent.length === 0)
            {
                setNodeTypeColor("red")
                setNodeType("Course")
            }
            else if(parent.length === 1) // Unit
            {
                setNodeTypeColor("blue")
                setNodeType("Unit")
            }
            else if(parent.length === 2) // Enduring Understanding
            {
                setNodeTypeColor("purple")
                setNodeType("Enduring Understanding")
            }
            else if(parent.length === 3) // Topic
            {
                setNodeTypeColor("cyan")
                setNodeType("Topic")
            }
            else if(parent.length === 4) // Objective
            {
                setNodeTypeColor("pink")
                setNodeType("Objective")
            }
            else if(parent.length === 5) // Essential Knowledge
            {
                setNodeTypeColor("orange")
                setNodeType("Essential Knowledge")
            }
        }
        
    }, [node])

    return (
        <Flex w="100%" flexDirection="column" bgColor={bgColor} borderRadius="4" border="2px solid" borderColor={borderColor} boxShadow="md" p="1" mt='3'>
            <Flex justifyContent="space-between" alignItems="center">
                <Box>   
                    <Text fontSize="12px" fontWeight="bold" isTruncated>{name}</Text>
                    <Badge rounded="full" px="2" fontSize="9px" mt="-2" colorScheme={nodeTypeColor}>
                        {nodeType}
                    </Badge>      
                </Box>
                {mastery === -1 || nodeLoading ? 
                    <Skeleton>
                        <SkeletonText></SkeletonText>
                    </Skeleton>
                :  
                <Tag bgColor={mastery > 80 ? "green.400": (mastery <= 30 ? "red.400": "yellow.600")}>
                    <Text color='white' fontWeight="bold" fontSize={"9px"}>{mastery}% Mastered</Text>
                </Tag>
                }
                
            </Flex>
            <Flex mt="-1">
                <Text noOfLines={2} fontSize="10px">
                    {description === "-1" ? "No description": description}
                </Text>
            </Flex>
        </Flex>
    )
}

export default SmallNodeProgressCard;
