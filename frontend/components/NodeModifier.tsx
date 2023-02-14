import { DeleteIcon, PlusSquareIcon, EditIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Accordion, AccordionButton, AccordionIcon, Text, AccordionItem, AccordionPanel, Input, Flex, FormLabel, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useUpdateNodeMutation, useMutationMutation, useAddNodeMutation } from "../generated/graphql";
import { useRouter } from 'next/router';
import React, {useState, useEffect} from 'react'

const NodeModifier: React.FC<any> = ({currentNode, course}) => {
const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("white", "gray.900")
  const borderColor  = useColorModeValue("2C4187", "#9DECF9")
  const router = useRouter();
  const [newName, setNewName] = useState<any>();
  const [updateName, setUpdateName] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const[updateNode, {loading: updateNodeLoading}] = useUpdateNodeMutation();
  const[deleteNode, {loading: deleteNodeLoading}] = useMutationMutation();
  const[addNode, {loading: addNodeLoading}] = useAddNodeMutation();

  const getChildrenOfNode = (nodePositionID) => {
    let children = []
    course?.nodes.forEach(node => {
        if(node.parent[node.parent?.length - 1] === nodePositionID) {
            children.push(node);
        }
    });

    return children;
  }  
//   console.log(getChildrenOfNode(currentNode?.data.id));
//   console.log(currentNode)

  const addNewNode = async () => {
    let children: any[] = getChildrenOfNode(currentNode?.data.id);
    if(children.length + 1 > 10) {
        return;
    }
    let max = 0;
    if(children.length != 0) {
        for(let i = 0; i < children?.length; i++) {
            if(parseInt(children[i].positionID) > max)
                max = (parseInt(children[i].positionID));
        }
        max += 1;
    }
    else{
        max = (parseInt(currentNode.data.id)*10 + 1);
    }   

    let type = "";
    if(currentNode.data.id.length == 1)
        type = "Unit"
    else if(currentNode.data.id.length == 2) 
        type = "Enduring Understanding"
    else if(currentNode.data.id.length == 3) 
        type = "Topic"
    else if(currentNode.data.id.length == 4) 
        type = "Objective"
    else if(currentNode.data.id.length == 5) 
        type = "Essential Knowledge"

    await addNode({
        variables: { 
            positionID: max+"",
            type: type,
            name: newName,
            parent: (children?.length == 0 ? [...currentNode.parent, currentNode.data.id]: children[0].parent),
            description: "-1",
            course: course.id,
        }
    })

    router.reload();
  }

  const deleteCurrentNode = async () => {
    await deleteNode({
        variables: { 
            positionID: currentNode.data.id,
            course: course.id,
        }
    })

    router.reload();
  }
  
  const deleteCourse = async () => {
    // await deleteNode({
    //     variables: { 
    //         positionID: currentNode.data.id,
    //         course: course.id,
    //     }
    // })

    // router.reload();
  }


  const updateButtonSubmit = async () => {
    if(updateName !== currentNode.name && updateName !== undefined) {
        await updateNode({
            variables: { 
                id: currentNode.data.dbID,
                newName: updateName,
            }
        })
        router.reload();
    }
  }



  return (
    <Accordion allowMultiple color={(colorMode === "light" ? "#2C4187": "#9DECF9")}>
        <AccordionItem pb={2} pt={2}>
            <AccordionButton>
                <Flex flex='1' textAlign='left' fontWeight={"bold"} alignItems="center">
                    Add Node <PlusSquareIcon ml="2" fontSize="16px"/>
                </Flex>
                <AccordionIcon />
            </AccordionButton>
                {currentNode?.data.id.length > 5 ? 
                    <AccordionPanel pb={2}>
                        <Text bgClip="text" bgGradient={titleText}>Max amount of layers allowed right now are <b>6</b>. Future Update will include more layers</Text>
                    </AccordionPanel>
                : 
                    (getChildrenOfNode(currentNode?.data.id).length == 10 ? 
                        <AccordionPanel pb={2}>
                            <Text bgClip="text" bgGradient={titleText}>Max amount of nodes per layer is <b>10</b></Text>
                        </AccordionPanel>
                    : 
                        <AccordionPanel pb={2}>
                            <Flex justifyContent="center" alignItems="center">
                                <FormLabel
                                    fontWeight="bold"
                                    fontSize="1.5vh"
                                    bgClip="text"
                                    bgGradient={titleText}
                                    mt="2"
                                >
                                    Node
                                </FormLabel>
                                <Input
                                    w="100%"
                                    name="name"
                                    type="name"
                                    autoComplete="Node name"
                                    placeholder="Node name"
                                    required
                                    value={newName}
                                    onChange={(evt) => setNewName(evt.target.value)}
                                />
                                <Button ml="2" leftIcon={<AddIcon />} colorScheme="facebook" onClick={addNewNode} fontSize="1.4vh">
                                    Add
                                </Button>
                            </Flex>
                        </AccordionPanel>
                    )
                    
                }
        </AccordionItem>
        <AccordionItem pb={2} pt={2}>
            <AccordionButton>
                <Flex flex='1' textAlign='left' fontWeight={"bold"} alignItems="center">
                    Update Node Name <EditIcon ml="2" fontSize="16px" />
                </Flex>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={2}>
                <Flex justifyContent="center" alignItems="center">
                    <FormLabel
                        fontWeight="bold"
                        fontSize="1.5vh"
                        bgClip="text"
                        bgGradient={titleText}
                        mt="2"
                        whiteSpace="nowrap"
                    >
                        Name
                    </FormLabel>
                    <Input
                        w="100%"
                        name="name"
                        type="name"
                        autoComplete="New node name"
                        placeholder="New node name"
                        required
                        value={updateName}
                        onChange={(evt) => setUpdateName(evt.target.value)}
                    />
                    <Button pl="8" pr="8" ml="2" leftIcon={<EditIcon />} colorScheme="facebook" onClick={updateButtonSubmit} fontSize="1.4vh">
                        Update
                    </Button>
                </Flex>
            </AccordionPanel>
        </AccordionItem>
        {currentNode?.data.id === "1" ?  
            <AccordionItem pb={2} pt={2}>
                <AccordionButton>
                    <Flex flex='1' textAlign='left' fontWeight={"bold"} alignItems="center">
                        Delete Course <DeleteIcon ml="2" fontSize="16px" />
                    </Flex>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={2}>
                    <Text color="red"fontSize="1.4vh"><b style={{textDecoration: 'underline'}}>Warning:</b> Deleting from this node will delete the entire course.</Text>
                    <Button onClick={onOpen} mt="3" leftIcon={<CloseIcon fontSize="18px"/>} colorScheme="red">Delete Course</Button>
                </AccordionPanel>
                <Modal 
                    blockScrollOnMount={true} 
                    isOpen={isOpen} 
                    onClose={onClose} 
                    closeOnOverlayClick={false}
                    isCentered
                    preserveScrollBarGap
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Are you sure?</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                Deleting the course will delete all assignments, resources and will remove students attached to this course, and this action cannot be <b style={{textDecoration: 'underline', color: "red"}}>undone.</b>
                            </Text>  
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={() => deleteCourse()} w="100%" leftIcon={<CloseIcon fontSize="18px"/>} colorScheme="red">Delete</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </AccordionItem>
        :
            <AccordionItem pb={2} pt={2}>
                <AccordionButton>
                    <Flex flex='1' textAlign='left' fontWeight={"bold"} alignItems="center">
                        Delete Node <DeleteIcon ml="2" fontSize="16px" />
                    </Flex>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={2}>
                    <Text color="red"fontSize="1.4vh"><b style={{textDecoration: 'underline'}}>Warning:</b> Deleting a Node also deletes all of its children nodes.</Text>
                    <Button  onClick={onOpen} mt="3" leftIcon={<CloseIcon fontSize="18px"/>} colorScheme="red">Delete Node</Button>
                </AccordionPanel>
                <Modal 
                    blockScrollOnMount={true} 
                    isOpen={isOpen} 
                    onClose={onClose} 
                    closeOnOverlayClick={false}
                    isCentered
                    preserveScrollBarGap
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Are you sure?</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                Deleting a Node also deletes all of its children nodes, and this action cannot be <b style={{textDecoration: 'underline', color: "red"}}>undone.</b>
                            </Text>  
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={() => deleteCurrentNode()} w="100%" leftIcon={<CloseIcon fontSize="18px"/>} colorScheme="red">Delete</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </AccordionItem>
        }
            
       
    </Accordion>
  )
}


export default NodeModifier;
