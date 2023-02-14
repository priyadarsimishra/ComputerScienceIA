import { AddIcon } from '@chakra-ui/icons';
import { Button, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, FormControl, FormErrorMessage, Input, Box, Text, Radio, RadioGroup } from '@chakra-ui/react';
import router from 'next/router';
import React, { useState, useEffect} from 'react'
import { useAddResourceToNodeMutation } from '../generated/graphql';

const ResourcesModal = ({ nodeID }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [resourceName, setResourceName] = useState("");
  const [link, setLink] = useState("");
  const [resourceNameError, setResourceNameError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [value, setValue] = useState("YouTube");

  const [addResource, loading] = useAddResourceToNodeMutation();

  useEffect(() => {
    if(resourceName !== null)
    {
      if(resourceName.length === 0) 
        setResourceNameError("Resource name is required.")
      else {
        if(resourceName.length < 4) setResourceNameError("Resource name is short. (minimum characters: 4)")
        else setResourceNameError("");
      }
    }
  }, [resourceName])

  useEffect(() => {
    if(link !== null)
    {
      if(link.length === 0) 
        setLinkError(`${value} Link is required.`)
      else {
        setLinkError("");
      }
    }
  }, [link, value])

  const submitForm = async () => {
    
    let resource = await addResource({
      variables: {
        id: nodeID,
        resourceName: resourceName,
        type: value,
        link: link
      }
    })

    setResourceName("");
    setValue("YouTube");
    setLink("");
    onClose();
    router.reload();
  }

  return (
    <Box>
        <Button 
          onClick={onOpen}
          colorScheme={"pink"}
          leftIcon={<AddIcon />}
          variant="outline"
          fontSize="16px"
        >
          Add Resource
        </Button>

        <Modal 
            isOpen={isOpen} 
            size={"6xl"}
            onClose={() => {
            onClose();
            }}
            closeOnOverlayClick={false}
            isCentered
            preserveScrollBarGap
            scrollBehavior="inside"
        >
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Add a Resource! 💪</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isInvalid={(resourceNameError && resourceNameError !== "") ? true: false}>
                    <Flex alignItems="center">
                        <Text fontWeight="bold">Resource Name</Text>
                        <Input
                            placeholder="Resource Name"
                            width="50%"
                            ml="10"
                            value={resourceName}
                            onChange={(evt) => { setResourceName(evt.target.value); }}
                        />
                    </Flex>
                    <FormErrorMessage>{resourceNameError}</FormErrorMessage>
                </FormControl>
                <Flex alignItems="center" mt="2">
                    <Text fontWeight="bold">Question Input Format </Text>
                    <RadioGroup onChange={setValue} value={value} ml="3" colorScheme="red">
                        <Radio size="md" name="YouTube" value="YouTube">YouTube</Radio>
                        <Radio size="md" name="Web Link" value="Web" ml="3">Web Link</Radio>
                    </RadioGroup>
                </Flex>
                <FormControl isInvalid={(linkError && linkError !== "") ? true: false} mt="5">
                    <Flex alignItems="center">
                        <Text fontWeight="bold">{value} Link</Text>
                        <Input
                            placeholder={`${value} Link`}
                            width="80%"
                            ml="10"
                            value={link}
                            onChange={(evt) => { setLink(evt.target.value); }}
                        />
                    </Flex>
                    <FormErrorMessage>{linkError}</FormErrorMessage>
                </FormControl>
            </ModalBody>

            <ModalFooter>
            <Button
                colorScheme="linkedin"
                onClick={() => {
                  if(resourceNameError === "" && linkError === "") {
                    submitForm();
                  }
                }}
            >
                Submit
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </Box>
  )
}


export default ResourcesModal;