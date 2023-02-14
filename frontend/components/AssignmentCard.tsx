import React from 'react'
import { IconButton, Flex, Text, LinkBox, Heading, LinkOverlay, Image, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useDeleteMcqAssignmentMutation } from "../generated/graphql";
import { CloseIcon } from '@chakra-ui/icons'
import router from 'next/router';

const AssignmentCard = ({ name, id, accountType }) => {
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const [deleteNode, {loading}] = useDeleteMcqAssignmentMutation();

  const handleDeleteAssignment = async () => {
    await deleteNode({
        variables: {
            id: id,
            name: name,
        }
    })
    router.reload();
  }

  return (
    <LinkBox w='100%' p='3' borderWidth='1px' rounded='md' mt="3">
        <Flex alignItems="center">
            <Flex>
                <Image src="/assignmenticon.png" w="50px" maxW="50px" h="50px"/>
            </Flex>         
            <Flex flexDirection="column" ml="3" w="85%">
                <Flex justifyContent={"space-between"}>
                    <Text 
                        noOfLines={1} 
                        fontWeight="bold" 
                        fontSize="1.8vh" 
                        bgClip="text"
                        bgGradient={titleText}
                    >
                        {name}
                    </Text>
                    {accountType === 'teacher' ?
                    <IconButton
                        w="50px"
                        h="30px"
                        colorScheme='red'
                        variant={"outline"}
                        aria-label='delete resource'
                        icon={<CloseIcon />}
                        onClick={() => handleDeleteAssignment()}
                    />
                    :null
                    } 
                </Flex>
            </Flex>      
        </Flex>
    </LinkBox>
  )
}

export default AssignmentCard;
