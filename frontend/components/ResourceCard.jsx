import React from 'react'
import { Link, IconButton, Flex, Text, LinkBox, Heading, LinkOverlay, Image } from "@chakra-ui/react";
import { useDeleteResourceFromNodeMutation } from "../generated/graphql";
import { AttachmentIcon, CloseIcon } from '@chakra-ui/icons'
import router from 'next/router';

const ResourceCard = ({id, accountType, courseID, name, link, type}) => {

  const [deleteResource, {loading}] = useDeleteResourceFromNodeMutation();

  const handleDeleteResource = async () => {
    let result = await deleteResource({
        variables: {
            id: id,
            resourceName: name,
        }
    })

    router.reload();
  }

  return (
    <LinkBox w='100%' p='3' borderWidth='1px' rounded='md' mt="3" href={link}>
        <Flex>
            <Flex>
                {type === 'YouTube' ? 
                    <Image src="/play-button.png" w="60px" maxW="60px" h="40px"/>
                :                    
                    <AttachmentIcon w="60px" h="40px"/>
                }
            </Flex>         
            <Flex flexDirection="column" ml="3" w="85%">
                <Flex justifyContent={"space-between"}>
                    <LinkOverlay fontWeight="extrabold" fontSize="16px" textAlign="left" href={link} isExternal={true}>
                        {name}
                    </LinkOverlay>
                    {accountType === 'teacher' ?
                    <IconButton
                        w="50px"
                        h="30px"
                        colorScheme='red'
                        variant={"outline"}
                        aria-label='delete resource'
                        icon={<CloseIcon />}
                        onClick={() => handleDeleteResource()}
                    />
                    :null
                    }   
                </Flex>
                <Text fontWeight="light" fontSize="14px" noOfLines={1} textAlign="left">
                    {link}
                </Text>
            </Flex>      
        </Flex>
    </LinkBox>
  )
}

export default ResourceCard;
