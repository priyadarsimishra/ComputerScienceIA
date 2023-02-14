import React, { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Progress,
  useColorMode,
  useColorModeValue,
  Menu,
  Button,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
} from "@chakra-ui/react";
import { grayDarkMode } from "../colors";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAddStatusToNodeMutation } from "../generated/graphql";
import router from "next/router";

const StudentProgressCard: React.FC<any> = ({name, profilePic, studentId, currNodeId, mastery}) => {
  const { colorMode } = useColorMode();
  const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF,#2C4187)", `linear(to-t,${grayDarkMode},blue.500, ${grayDarkMode})`)
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("gray.100", "gray.700")
  const borderColor  = useColorModeValue("@2C4187", "#9DECF9");
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [state, setState] = useState<any>("");
  const [addStatus, {loading}] =  useAddStatusToNodeMutation();

  const submitForm = async() => {
    if(state !== "") {
      await addStatus({
        variables: { 
          studentId: studentId,
          nodeId: currNodeId,
          state: state,
        }
      })

      router.reload();
    }
  }
  
  return (
    <Box onClick={onOpen}>
      <Box h="80px" bg={bgColor} borderRadius="10" border="1px solid" borderColor={borderColor}>
        <Flex w="100%">
          <Flex alignItems="center" w="100%" h="80px">
            <Avatar name={name} ml="5" src={profilePic}/>
            <Text ml="3" fontWeight="medium" fontSize="20px">
              {name}
            </Text>
          </Flex>
          <Flex w="50%" flexDirection="row" justifyContent="center" alignItems="center" mr="4">
            <Box w="90%">
              <Text fontWeight="bold" color={(colorMode == "light" ? "pink.500": "pink.300")}>{mastery}% Mastery</Text>
              <Progress hasStripe value={mastery} colorScheme="pink" size="md" isAnimated={true} bgColor="white"  border="1px solid" borderColor="pink.500"/>
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size={"xl"}
        closeOnOverlayClick={false}
        isCentered
        preserveScrollBarGap
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set Mastery 🏆</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="14px" fontWeight="light">Click on one of the choices and press submit!</Text>
            <Flex justifyContent="space-between" alignItems="center" mt="3">
              <Tag
                  size="lg"
                  colorScheme={(state === "Foundational" ? "yellow" : "pink")}
                  onClick={() => {
                    setState("Foundational")
                  }}
              >
                Foundational
              </Tag>
              <Tag
                  size="lg"
                  colorScheme={(state === "Proficient" ? "yellow" : "pink")}
                  onClick={() => {
                    setState("Proficient")
                  }}
              >
                Proficient
              </Tag>
              <Tag
                  size="lg"
                  colorScheme={(state === "Advanced" ? "yellow" : "pink")}
                  onClick={() => {
                    setState("Advanced")
                  }}
              >
                Advanced
              </Tag>
              <Tag
                  size="lg"
                  colorScheme={(state === "Mastered" ? "yellow" : "pink")}
                  onClick={() => {
                    setState("Mastered")
                  }}
              >
                Mastered
              </Tag>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="linkedin"
              onClick={() => {
                submitForm();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentProgressCard;
