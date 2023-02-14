import { InboxOutlined } from '@ant-design/icons';
import { EditIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, FormControl, Text, FormLabel, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Select, Spinner, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { useEditProfileMutation } from '../generated/graphql';
import Dragger from 'antd/lib/upload/Dragger';
import React, { useState } from 'react'
import { storage } from '../firebase';
import { v4 } from "uuid";
import router from 'next/router';

const EditProfileModal = ({ id, type, cname, cemail, cgrade, cschool, cprofilePicImageURL }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const { colorMode } = useColorMode()
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const [name, setName] = useState<any>(cname);
  const [email, setEmail] = useState<any>(cemail);
  const [image, setImage] = useState<any>(null);
  const [grade, setGrade] = useState<any>(cgrade);
  const [school, setSchool] = useState<any>(cschool);
  const [editProfile, { loading }] = useEditProfileMutation();
  const profileImagesListRef = storage.ref();

  const getPathStorageFromUrl = (url: string) => {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/masterit-624a1.appspot.com/o/";
    let imagePath: string = url.replace(baseUrl,"");
    const indexOfEndPath = imagePath.indexOf("?");
    imagePath = imagePath.substring(0,indexOfEndPath);
    imagePath = imagePath.replace("%2F","/");
    return imagePath;
}

  const submitForm = async () => {
    if(cprofilePicImageURL !== "" && image) {
        let path = getPathStorageFromUrl(cprofilePicImageURL);
        const imageRef = profileImagesListRef.child(`${path}`);
        await imageRef.delete();
    }
    if(image) {
        const newImageRef = profileImagesListRef.child(`profile_images/${image?.name + v4()}`);
        newImageRef.put(image.originFileObj).then(async (snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log(downloadURL);
                editProfile({
                    variables: {
                        id: id,
                        type: type,
                        name: name,
                        email: email,
                        grade: grade,
                        school: school,
                        profilePicURL: downloadURL,
                    }
                }).then(result => {
                    router.reload();
                }) 
            }
        )})
    }
    else {
        await editProfile({
            variables: {
                id: id,
                type: type,
                name: name,
                email: email,
                grade: grade,
                school: school,
                profilePicURL: cprofilePicImageURL,
            }})
        router.reload();
    }
    //  firebase image work
  }

  return (
    <Box>
        <Button 
            onClick={onOpen}
            colorScheme={(colorMode === 'light' ? "blue": 'pink')} 
            mt="2" 
            leftIcon={<EditIcon />} 
            p="2" 
            pt="1" 
            pb="1"
        >
            Edit Profile
        </Button>


        <Modal 
            isOpen={isOpen} 
            size={"xl"}
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
            <ModalHeader>Edit Profile ✍️</ModalHeader>
            {loading ? null: <ModalCloseButton />}
            <ModalBody>
                {loading ? 
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
                                Your Profile is being updated...
                            </Text>
                    </Flex>
                : 
                <Box>
                    <FormControl>
                        <FormLabel
                            fontWeight="bold"
                            fontSize="16px"
                            bgClip="text"
                            bgGradient={titleText}
                        >
                            Change Profile Picture
                        </FormLabel>
                        <Dragger 
                            multiple={false} 
                            onChange={(event) => setImage(event.file)}
                            style={{backgroundColor: (colorMode === "light" ? "#F7FAFC" : "#171923")}}
                            maxCount={1}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}/>
                            </p>
                            <p className="ant-upload-text" style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}>Click or drag file to this area to upload</p>
                            {/* TODO: update these texts */}
                            <p className="ant-upload-hint" style={{ paddingLeft: "10px", color:(colorMode === "light" ? "#4299E1" :"#9DECF9") }}>
                                Support for a single upload. Make sure to upload an appropriate profile picture - a professional picture of you
                            </p>
                        </Dragger>
                    </FormControl>
                    <Divider mt="5" mb="5" />
                    <FormControl mt="4">
                        <FormLabel
                            fontWeight="bold"
                            fontSize="16px"
                            bgClip="text"
                            bgGradient={titleText}
                        >
                            Name
                        </FormLabel>
                        <InputGroup>
                            <Input 
                                name="name"
                                type="name"
                                autoComplete="name"
                                placeholder="Name"
                                required
                                value={name}
                                onChange={(evt) =>{ setName(evt.target.value) }}
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl mt="4">
                        <FormLabel
                            fontWeight="bold"
                            fontSize="16px"
                            bgClip="text"
                            bgGradient={titleText}
                        >
                            Email
                        </FormLabel>
                        <InputGroup>
                            <Input 
                                name="email"
                                type="text"
                                autoComplete="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(evt) =>{ setEmail(evt.target.value) }}
                            />
                        </InputGroup>
                    </FormControl>
                    {type === "student" ? 
                    <FormControl mt="4">
                        <FormLabel
                            fontWeight="bold"
                            fontSize="16px"
                            bgClip="text"
                            bgGradient={titleText}
                        >
                            Grade
                        </FormLabel>
                        <InputGroup>
                            <NumberInput w="100%" defaultValue={grade} min={9} max={12} onChange={(value) => {setGrade(parseInt(value));}}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                            </NumberInput>
                        </InputGroup>
                    </FormControl>
                    : null}
                
                    <FormControl mt="2">
                        <FormLabel
                            fontWeight="bold"
                            fontSize="16px"
                            bgClip="text"
                            bgGradient={titleText}
                        >
                            School
                        </FormLabel>
                        <InputGroup>
                            <Select placeholder='Select School' value={school} onChange={(ev) => setSchool(ev.target.value)}>
                                <option value={"Westwood High School"}>Westwood High School</option>
                            </Select>
                        </InputGroup>
                    </FormControl>
                    </Box>
                }
            </ModalBody>

            <ModalFooter>
                {loading ? null:
                    <Button
                        colorScheme="linkedin"
                        onClick={() => {
                            submitForm();
                        }}
                    >
                        Submit
                    </Button>
                }
                
            </ModalFooter>
        </ModalContent>
        </Modal>
    </Box>
  )
}

export default EditProfileModal;