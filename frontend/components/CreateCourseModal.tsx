import React, { useEffect, useState } from 'react'
import { Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, useDisclosure, Button, Modal, Stack, Input, Box, Textarea, Divider, Spinner, useToast, useColorMode, useClipboard, Code, useColorModeValue, FormErrorMessage, FormControl, Table, TableCaption, TableContainer, Th, Thead, Tr, Tag, Tooltip } from '@chakra-ui/react';
import { CheckCircleOutlined, InboxOutlined } from '@ant-design/icons';
import * as XLSX from "xlsx";
import Dragger from 'antd/lib/upload/Dragger';
import 'antd/dist/antd.css';
import { useRouter } from 'next/router';
import {
    useCreateCourseMutation,
    useAddNodesFromSpreadSheetMutationMutation,
    useAddNodeMutation,
  } from "../generated/graphql";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";

const CreateCourseModal: React.FC<any> = ({ id }) => {
    const { colorMode } = useColorMode();
    const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
    const toast = useToast()

    const router = useRouter();
    const getRandomString = (length: number) => {
        let randomChars: string =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result: string = "";
        for (let i = 0; i < length; i++) {
            result += randomChars.charAt(
                Math.floor(Math.random() * randomChars.length)
            );
        }
        return result;
    }

    const [name, setName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [requestComplete, setRequestComplete] = useState<boolean>(false);
    const [courseCode, setCourseCode] = useState(getRandomString(3) + "-" + getRandomString(3) + "-" + getRandomString(3));
    const [listOfNodes, setListOfNodes] = useState<string>("");
    const { hasCopied, onCopy } = useClipboard(courseCode)
    const [nameError, setNameError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [courseCodeError, setCourseCodeError] = useState<string | null>(null);
    const [
        createCourse,
        { loading: courseLoading },
      ] = useCreateCourseMutation();
    const [
        addNodesFromSpreadSheet,
        { loading: nodesLoading },
      ] = useAddNodesFromSpreadSheetMutationMutation();
    const[addNode, {loading: addNodeLoading}] = useAddNodeMutation();
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Validation of Forms
  useEffect(() => {
    if(name !== null)
    {
      if(name.length === 0) 
        setNameError("Name is required.")
      else {
        if(name.length < 4) setNameError("Name is short. (minimum characters: 4)")
        else setNameError("");
      }
    }
  }, [name])

  useEffect(() => {
    if(description !== null)
    {
      if(description === "") setDescriptionError("Description is required.")
      else{
        if(description.length < 6) setDescriptionError("Description is too short. (minimum characters: 6)");
        else setDescriptionError("");
      }
    }
  }, [description]);

  useEffect(() => {
    if(courseCode !== null)
    {
      if(courseCode === "") setCourseCode(getRandomString(3) + "-" + getRandomString(3) + "-" + getRandomString(3))
      else{
        if(courseCode.length < 5) setCourseCodeError("Course code is too short. (minimum characters: 5)");
        else if(courseCode.length > 11) setCourseCodeError("Course code is too long. (maximum characters: 11)")
        else setCourseCodeError("");
      }
    }
  }, [courseCode]);

    const submitCourse = async () => {
        // first create course
        const course = await createCourse({
            variables: {
                name: name,
                description: description,
                teacherID: id,
                courseCode: courseCode
            }
        })
        // second add to the course the nodes (optional)
        if(listOfNodes != "")
        {
            const nodes = await addNodesFromSpreadSheet({
                variables: {
                    course_id: course.data.createCourse.id,
                    nodes: listOfNodes,
                },
            });
    
        }
        else
        {
            const node = await addNode({
                variables: {
                    positionID: "1",
                    type: "Course",
                    name: course.data.createCourse.name,
                    parent: [],
                    description: course.data.createCourse.description,
                    course: course.data.createCourse.id,
                },
            });
        }
        
        setLoading(false);
        setRequestComplete(true);
    }

    const resetAll = () => {
        setName("");
        setDescription("");
        setListOfNodes("")
    };

    return (
        <>
            <Button
                onClick={onOpen}
                colorScheme="pink"
                rightIcon={<AddIcon fontSize="14px"/>}
            >
                Create Course
            </Button>
            <Modal
                size="4xl"
                isOpen={isOpen}
                onClose={( ) => {
                    if(requestComplete){
                        resetAll();
                        onClose();
                        router.push({
                            pathname: "/dashboard/teacher",
                            query: { id: id },
                        }, null, {shallow: true});
                        setRequestComplete(false);
                    }
                    else
                    {
                        onClose();
                    }
                }}
                isCentered
                closeOnOverlayClick={false}
                preserveScrollBarGap
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader >{loading ? "": <Text fontWeight="bold">Create a Course! 💡</Text>}</ModalHeader>
                    {loading ? "": <ModalCloseButton />}
                    {loading ? 
                        <ModalBody>
                            <Flex flexDirection="column" justifyContent={"center"} alignItems="center">
                                    <Spinner
                                        thickness='12px'
                                        speed='0.5s'
                                        emptyColor='gray.200'
                                        color='blue.500'
                                        width="150px"
                                        height="150px"
                                    />
                                    <Text mt='5' fontSize="18px" fontWeight="bold">
                                        {courseLoading ? "Creating the Course Right Now...": ((nodesLoading ? "Adding your Nodes to the Course Now...": (addNodeLoading ? "Adding the Course Node to the Course Now...": null)))}
                                    </Text>
                            </Flex>
                        </ModalBody> 
                    : 
                    (requestComplete ? 
                        <ModalBody>
                            <Flex flexDirection="column" justifyContent={"center"} alignItems="center">
                                    <CheckCircleOutlined
                                        style={{ 
                                            fontSize: "150px",
                                            color: (colorMode === "light" ? "#38A169": "#68D391"),
                                        }}
                                    />
                                     <Text mt='5' fontSize="24px" fontWeight="bold">
                                        Your Course was created!
                                    </Text>
                                    <Flex justifyContent="center" alignItems="center">
                                        <Text mt='2' fontSize="20px" fontWeight="light">
                                            Course Code: <Code fontSize="20px" colorScheme="blue" fontWeight="bold">{courseCode}</Code>
                                        </Text>
                                        <Button onClick={onCopy} ml={2} mt={2} h="30px" colorScheme="facebook">
                                            {hasCopied ? "Copied" : "Copy"}
                                        </Button>
                                    </Flex>

                            </Flex>
                        </ModalBody>
                    :
                        <ModalBody>
                            <Stack>
                                <FormControl isInvalid={(nameError && nameError !== "") ? true: false}>
                                    <Flex justifyContent="space-between" alignItems="center">
                                        <Text fontWeight="bold" fontSize="18px" bgClip="text" bgGradient={titleText} mt="-7">Name </Text>
                                        <Flex flexDirection={"column"} w="100%">
                                            <Input
                                                placeholder="Course name"
                                                width="95%"
                                                ml="6"
                                                value={name}
                                                onChange={(evt) => { setName(evt.target.value); }}
                                            />
                                            <FormErrorMessage ml="6">{nameError}</FormErrorMessage>
                                        </Flex>
                                    </Flex>
                                </FormControl>
                                <FormControl isInvalid={(descriptionError && descriptionError !== "") ? true: false}>
                                    <Flex justifyContent={"space-between"}>
                                        <Text fontWeight="bold" fontSize="18px" bgClip="text" bgGradient={titleText}>Description</Text>
                                        <Flex flexDirection={"column"} w="100%">
                                            <Textarea
                                                placeholder="Course description"
                                                width="95%"
                                                ml="6"
                                                resize="none"
                                                value={description}
                                                onChange={(evt) => { setDescription(evt.target.value); }}
                                            />
                                            <FormErrorMessage ml="6">{descriptionError}</FormErrorMessage>
                                        </Flex>
                                    </Flex>
                                </FormControl>
                            </Stack>
                            <Divider mt="5" mb="5" />
                            <Flex flexDirection="column" mb="6">
                                <Flex flexDirection="column">
                                    <Text fontSize="18px">
                                        <b>Spreadsheet File Format</b> (case sensitive)
                                    </Text>
                                    <Text fontSize="12px" fontWeight="light">Hover over the tags to get more information.</Text>
                                </Flex>
                                <Flex justifyContent={"space-between"} mt="2">
                                    <Tooltip label="This is just the name of the node.">
                                        <Tag colorScheme="cyan">name</Tag>
                                    </Tooltip>
                                    <Tooltip label="The type is how you describe different parts of the course in a hierachy like 'Units', 'Topics', etc.">
                                        <Tag colorScheme="cyan">type</Tag>
                                    </Tooltip>
                                    <Tooltip label="Super Important! Algorithm uses this to generate the web-like structure. Should be numbers and they should represent the hierachy. For example: '1' is the main node and '11' is the first child of the main node, and then '111' would be the child of the '11' node. Please number in this fashion to get your hierachy properly. If confused you can also just try manually adding nodes after creating the course.">
                                        <Tag colorScheme="cyan">id</Tag>
                                    </Tooltip>
                                    <Tooltip label="Text of any skills that are part of a specific node">
                                        <Tag colorScheme="cyan">skills</Tag>
                                    </Tooltip>
                                    <Tooltip label="Text of the description of a specific node">
                                        <Tag colorScheme="cyan">description</Tag>
                                    </Tooltip>
                                </Flex>
                            </Flex>
                            <Text bgClip="text" bgGradient={titleText} fontWeight="bold" fontSize="18px">Upload Spreadsheet of Nodes for Course (Optional)</Text>
                            <Text mb="3" fontWeight="light" fontSize="12px">You can start adding/deleting nodes in the Courseboard later!</Text>
                            <Dragger multiple={false} maxCount={1} 
                                style={{backgroundColor: (colorMode === "light" ? "#F7FAFC" : "#171923")}}
                                beforeUpload={file => {
                                    var f = file;
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                        const bstr = evt.target.result;
                                        const wb = XLSX.read(bstr, { type: "binary" });
                                        wb.SheetNames.forEach((sheet) => {
                                            let rowObject = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
                                            let jsonObject: string = JSON.stringify(JSON.stringify(rowObject));
                                            setListOfNodes(jsonObject);
                                        });
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
                            <Divider mt="7" mb="5" />
                            <Stack>
                                <Flex alignItems={"center"} justifyContent={"space-between"}>
                                    <Flex flexDirection="column">
                                        <Text bgClip="text" bgGradient={titleText} fontWeight="bold" fontSize="18px">Course Code</Text>
                                        <Text fontWeight="light" fontSize="12px">You can use the randomly generated codes or edit the input field for your own course code. (Max Length: 11 characters)</Text>
                                        {/* TODO: implement the checking for max 11 length characters */}
                                        {courseCodeError && courseCodeError !== "" ? 
                                            <Text fontWeight="bold" color="red.400"  fontSize="15px">
                                                {courseCodeError}
                                            </Text>
                                        : null}
                                    </Flex>
                                    <Input
                                        placeholder="Course Code"
                                        width="auto"
                                        ml="6"
                                        value={courseCode}
                                        onChange={(evt) => { setCourseCode(evt.target.value); }}
                                    />
                                    <Button
                                        ml='4'
                                        colorScheme={"facebook"}
                                        p="5"
                                        onClick={() => {
                                            setCourseCode(getRandomString(3) + "-" + getRandomString(3) + "-" + getRandomString(3));
                                        }}
                                    >
                                        New Code
                                    </Button>
                                </Flex>
                            </Stack>
                        </ModalBody>)
                    }
                    
                    {requestComplete ? 
                        <ModalFooter></ModalFooter>
                    :  
                        <ModalFooter>
                            <Button colorScheme='telegram' mr={3} p="5" isLoading={loading} onClick={() => {
                                if(!nameError && !descriptionError && courseCode === "")
                                {
                                    toast({
                                        title: "Course Creation Error",
                                        description: "Oops there was some error in your entry.",
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                      })
                                }
                                else if(nameError !== "" && descriptionError === "Description is required.")
                                {
                                    toast({
                                      title: "Course Creation Error",
                                      description: "No name or description was provided",
                                      status: "error",
                                      duration: 5000,
                                      isClosable: true,
                                    })
                                }
                                else if(nameError && nameError !== "") {
                                    toast({
                                        title: "Course Creation Error",
                                        description: nameError,
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                      })
                                }
                                else if(descriptionError && descriptionError !== "") {
                                    toast({
                                        title: "Course Creation Error",
                                        description: descriptionError,
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                      })
                                }
                                else if(courseCode === "" || courseCode.length < 5){
                                    toast({
                                        title: "Course Creation Error",
                                        description: "The course code is too short.",
                                        status: "error",
                                        duration: 5000,
                                        isClosable: true,
                                      })
                                }
                                else{
                                    console.log(nameError);
                                    console.log(descriptionError);
                                    console.log(courseCodeError)
                                    if(nameError === "" && descriptionError === "" && courseCodeError === "") {
                                        setLoading(true); 
                                        submitCourse()
                                    }
                                }
                    
                            }}>
                                Create
                            </Button>
                        </ModalFooter>
                    }
                   
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateCourseModal;
