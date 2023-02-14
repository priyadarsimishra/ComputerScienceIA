import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Flex,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { useJoinCourseMutation } from "../generated/graphql";
// import { JOIN_COURSE } from "../requests/mutations";
import {AddIcon} from "@chakra-ui/icons";

interface CourseVars {
  id: string;
  courseCode?: string;
}

const JoinCourseModal:React.FC<CourseVars> = ({ id }) => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [courseCode, setCourseCode] = useState<string>("");


  const [joinCourse, loading] = useJoinCourseMutation();

  return (
    <div>
      <Button onClick={onOpen} variant="outline" leftIcon={<AddIcon />} borderWidth="3px" borderColor={(colorMode === "light" ? "#2C4187": "#9DECF9")} color={(colorMode === "light" ? "#2C4187": "#9DECF9")} borderRadius="8">Join Course</Button>

      <Modal
        isOpen={isOpen}
        size={"2xl"}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Course Code</ModalHeader>
          <ModalBody>
            <Flex justifyContent="space-between" alignItems="center">
              <Input
                placeholder="Course Code"
                width="80%"
                value={courseCode}
                onChange={(evt) => setCourseCode(evt.target.value)}
              />
              <Button
                width="19%"
                colorScheme="facebook"
                variant="solid"
                onClick={async () => {
                  let isError = false;
                  if(courseCode.length === 0) {
                    toast({
                      title: "Join Course Error",
                      description: "This is not a valid course code",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    })
                  }
                  else {
                    let result = await joinCourse({
                      variables: {
                        id: id,
                        courseCode: courseCode
                    }}).catch(err => {
                      isError = true;
                      // console.log(err.message);
                      toast({
                        title: "Join Course Error",
                        description: err.message +"! You might have entered the wrong code",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      })
                    });
                    if(!isError)
                    {
                      onClose();
                      router.reload();
                    }
                  }
                  
                }}
              >
                Join
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </div>
  );
}

export default JoinCourseModal;
