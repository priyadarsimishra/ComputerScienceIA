import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import {
  Heading,
  Input,
  Box,
  Button,
  useColorModeValue,
  Link,
  Image,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
  IconButton,
  InputLeftElement,
  Divider,
  SimpleGrid,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { Card } from "../components/Card";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoMailSharp, IoPerson } from "react-icons/io5";
import { FaGoogle, FaInfo } from "react-icons/fa";
import {
  useRegisterStudentMutation,
  useRegisterTeacherMutation,
} from "../generated/graphql";
import { useRouter } from "next/router";
import { authentication, provider } from "../firebase";
import Head from "next/head";
import Loading from "../components/Loading";
import { grayDarkMode } from "../colors";

interface UserVars {
  username: string | null;
  email: string | null;
  password: string | null;
  type: string;
}

const SignUp = () => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("white", "#171923")  // gray.100 = #EDF2F7, gray.900 = #171923
  const [currUser, setCurrUser] = useState<UserVars>({
    username: null,
    email: null,
    password: null,
    type: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const auth: any = useAuth();
  const router = useRouter();
  const[nameError, setNameError] = useState<string | null>(null);
  const[emailError, setEmailError] = useState<string | null>(null);
  const[passwordError, setPasswordError] = useState<string | null>(null);
  const[teacherCodeError, setTeacherCodeError] = useState<string | null>(null);

  const[teacherCode, setTeacherCode] = useState<string>("");

  const [
    registerStudent,
    { loading: studentAddedLoading },
  ] = useRegisterStudentMutation();

  const [
    registerTeacher,
    { loading: teacherAddedLoading },
  ] = useRegisterTeacherMutation();

  // Validation of Forms
  useEffect(() => {
    if(currUser?.username !== null)
    {
      if(currUser?.username.length === 0) 
        setNameError("Username is required.")
      else {
        if(currUser?.username.length < 6) setNameError("Username is too short.")
        else setNameError("");
      }
    }
  }, [currUser?.username])

  useEffect(() => {
    if(currUser?.email !== null)
    {
      if(currUser?.email === "") setEmailError("Email is required.")
      else{
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(!regex.test(currUser?.email)) setEmailError("This is not a valid email address.")
        else setEmailError("");
      }
    }
  }, [currUser?.email])

  useEffect(() => {
    if(currUser?.password !== null)
    {
      if(currUser?.password === "") setPasswordError("Password is required.")
      else {
        setPasswordError("");
      }
    }
  }, [currUser?.password])

  useEffect(() => {
    if(teacherCode !== null)
    {
      if(teacherCode === "") setTeacherCodeError("Teacher code is required.")
      else {
        if(teacherCode.length < 11) setTeacherCodeError("Teacher code is too short")
        else if(teacherCode.length > 11) setTeacherCodeError("Teacher code is too long")
        else setTeacherCodeError("");
      }
    }
  }, [teacherCode])


  const handleGoogleSignUp = async (type: string) => {
    const { user } = await authentication.signInWithPopup(provider);
    handleSignUp("google", type, user);
  };

  const handleSignUp = async (authType: string, type?: string, user?: any) => {
    // console.log(currUser);
    let obj;
    if (currUser?.type === "student" || type == "student") {
      if (authType === "google") {
        obj = await registerStudent({
          variables: {
            username: user.providerData[0].displayName,
            email: user.providerData[0].email,
            password: user.providerData[0].uid,
            type: type,
            authType: authType,
          },
        });
      }
      else {
        obj = await registerStudent({
          variables: {
            username: currUser?.username,
            email: currUser?.email,
            password: currUser?.password,
            type: currUser?.type,
            authType: authType,
          },
        });
      }

      setCurrUser({
        username: "",
        email: "",
        password: "",
        type: "",
      });

      if (obj.data && obj.data.registerStudent) {
        auth.setAccessToken(obj.data.registerStudent.accessToken);
        auth.setRefreshToken(obj.data.registerStudent.refreshToken);
        localStorage.setItem("refreshToken", obj.data.registerStudent.refreshToken);
      }

      router.push({
        pathname: "/set_profile"
      }, null, {shallow: true})
    } else if (currUser?.type === "teacher") {
      // TODO: add unique id for teacher as a sign field to prevent random people from becoming teachers
    
      let error = "";
      let data;
      await registerTeacher({
        variables: {
          username: currUser?.username,
          email: currUser?.email,
          password: currUser?.password,
          type: currUser?.type,
          teacherCode: teacherCode
        },
      }).then(response => {
        if(!response.errors) data = response.data
      }).catch(err => {
        error = err.message;
        return;
      });

      setCurrUser({
        username: "",
        email: "",
        password: "",
        type: "student",
      });

      if(error !== "") {
        setTeacherCode("")
        setCurrUser({
          username: "",
          email: "",
          password: "",
          type: "student",
        });
        return error;
      }
      else {
        if (data && data.registerTeacher) {
          auth.setAccessToken(data.registerTeacher.accessToken);
          auth.setRefreshToken(data.registerTeacher.refreshToken);
          localStorage.setItem("refreshToken", data.registerTeacher.refreshToken);
        }
  
        setCurrUser({
          username: "",
          email: "",
          password: "",
          type: "",
        });
  
        router.push({
          pathname: "/set_profile"
        }, null, {shallow: true})
      }
      return null;
    }
  };

  return (
    <Box bgColor={bgColor} w="100%" h="100vh">
      <Head>
        <title>Sign Up</title>
      </Head>
      {studentAddedLoading || teacherAddedLoading ? (
        <Loading />
      ) : (
        <Box bg={bgColor} w='100%' maxH="100vh">
          <Flex mt="2" mr="3" justifyContent="flex-end">
            <Text color={(colorMode === "light" ? "#3788FF": "cyan.200")}>Already have an account?</Text>
            <Link ml="2" fontWeight="bold" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} href="/login">
              Login
            </Link>
          </Flex>
          <Box maxW="md" mx="auto" px={{ base: "4", lg: "8" }}>
            <Flex alignItems="center" justifyContent="center" mt="2vh" mb="5">
              <Image
                width="90px"
                height="90px"
                src={(colorMode === "light" ? "/MasterItLogo_light.png": "MasterItLogo_dark.png")}
                alt="logo"
              />
              <Heading
                ml="5"
                textAlign="center"
                size="xl"
                fontWeight="extrabold"
                fontSize="60px"
                bgClip="text"
                bgGradient={titleText}
                onClick={() => router.push({pathname: "/"})}
              >
                MasterIt
              </Heading>
            </Flex>
          </Box>
          <Box w="100%" bgColor={bgColor}>
            <Card maxW="xl" mx="auto" bgColor={(colorMode === "light" ? "gray.50": grayDarkMode)}>
              <Heading
                ml="5"
                textAlign="center"
                size="xl"
                fontWeight="extrabold"
                fontSize="36px"
                bgClip="text"
                bgGradient={titleText}
              >
                Sign Up
              </Heading>
              <Text
                mt="1"
                mb="2"
                align="center"
                maxW="xl"
                fontWeight="regular"
                bgClip="text"
                bgGradient={titleText}
              >
                <Text as="span">
                  Welcome to MasterIt! This is a platform for students to master
                  different skills and keep track of their progress.
                </Text>
              </Text>
              <Tabs variant="soft-rounded" isFitted colorScheme="blue" maxW="xl" mt="2">
                <TabList>
                  <Tab
                    onClick={() =>
                      setCurrUser({
                        username: currUser?.username,
                        email: currUser?.email,
                        password: currUser?.password,
                        type: "student",
                      })
                    }
                    color={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                  >
                    Student
                  </Tab>
                  <Tab
                    onClick={() =>
                      setCurrUser({
                        username: currUser?.username,
                        email: currUser?.email,
                        password: currUser?.password,
                        type: "teacher",
                      })
                    }
                    color={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                  >
                    Teacher
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Stack spacing="3">
                      <FormControl isInvalid={(nameError && nameError !== "") ? true: false}>
                        <FormLabel
                          fontWeight="bold"
                          fontSize="24px"
                          bgClip="text"
                          bgGradient={titleText}
                        >
                          Name
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                          >
                            <IoPerson fontSize="25px" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                          </InputLeftElement>
                          <Input
                            name="name"
                            type="name"
                            autoComplete="name"
                            placeholder="Name"
                            required
                            value={currUser?.username}
                            onChange={(evt) => {
                                setCurrUser({
                                  username: evt.target.value,
                                  email: currUser?.email,
                                  password: currUser?.password,
                                  type: currUser?.type,
                                })
                              }
                            }
                          />
                        </InputGroup>
                        <FormErrorMessage>{nameError}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={(emailError && emailError !== "") ? true: false}>
                        <FormLabel
                          fontWeight="bold"
                          fontSize="24px"
                          bgClip="text"
                          bgGradient={titleText}
                        >
                          Email
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                          >
                            <IoMailSharp fontSize="25px" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                          </InputLeftElement>
                          <Input
                            name="email"
                            type="text"
                            autoComplete="email"
                            placeholder="Email"
                            required
                            value={currUser?.email}
                            onChange={(evt) => {
                                setCurrUser({
                                  username: currUser?.username,
                                  email: evt.target.value,
                                  password: currUser?.password,
                                  type: currUser?.type,
                                })
                              }
                            }
                          />
                        </InputGroup>
                        <FormErrorMessage>{emailError}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={(passwordError && passwordError !== "") ? true: false}>
                        <FormLabel
                          fontWeight="bold"
                          fontSize="24px"
                          bgClip="text"
                          bgGradient={titleText}
                        >
                          Password
                        </FormLabel>
                        <InputGroup size="md">
                          <Input
                            pr="4.5rem"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={currUser?.password}
                            onChange={(evt) =>
                              setCurrUser({
                                username: currUser?.username,
                                email: currUser?.email,
                                password: evt.target.value,
                                type: currUser?.type,
                              })
                            }
                          />
                          <InputRightElement width="4.5rem">
                            <IconButton
                              aria-label={
                                showPassword ? "Mask password" : "Reveal password"
                              }
                              bg="transparent !important"
                              size="lg"
                              h="auto"
                              ml="5"
                              icon={
                                showPassword ? (
                                  <HiEye color={(colorMode === "light" ? "#2C4187": "#9DECF9")} fontSize="25px" />
                                ) : (
                                  <HiEyeOff color={(colorMode === "light" ? "#2C4187": "#9DECF9")} fontSize="25px" />
                                )
                              }
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{passwordError}</FormErrorMessage>
                      </FormControl>
                      {/* TODO: fix teacher code issue */}
                    </Stack>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      mt="6"
                      fontSize="20px"
                      w="100%"
                      maxW="100%"
                      bgClip="background"
                      bgGradient={titleText}
                      fontWeight="bolder"
                      _hover={{ bgGradient: titleText }}
                      onClick={() => {
                        if(nameError === "" && emailError === "" && passwordError === "")
                          handleSignUp("UEP")
                      }}// UEP: username, email, password
                    >
                      Sign Up
                    </Button>

                    {/* Divider between Form Auth and Google Auth */}
                    {/* <Flex align="center" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} mt="4">
                      <Box flex="1">
                        <Divider borderColor={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                      </Box>
                      <Text
                        as="span"
                        px="3"
                        color={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                        fontWeight="medium"
                      >
                        or continue with
                      </Text>
                      <Box flex="1">
                        <Divider borderColor={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                      </Box>
                    </Flex> */}

                    {/* Login with other Company Auth */}
                    {/* TODO: integrate later */}
                    {/* <SimpleGrid mt="4" rows={1} spacing="3">
                      <Button
                        color={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                        variant="outline"
                        borderColor={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                        onClick={() => { handleGoogleSignUp("student") }}
                      >
                        <FaGoogle />
                        <Text ml="5" fontWeight="bold">
                          Sign Up with Google
                        </Text>
                      </Button>
                    </SimpleGrid> */}
                  </TabPanel>
                  <TabPanel>
                    <Stack spacing="3">
                      <FormControl isInvalid={(nameError && nameError !== "") ? true: false}>
                        <FormLabel
                          fontWeight="bold"
                          fontSize="24px"
                          bgClip="text"
                          bgGradient={titleText}
                        >
                          Name
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                          >                            
                            <IoPerson fontSize="25px" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                          </InputLeftElement>
                          <Input
                            name="name"
                            type="name"
                            autoComplete="name"
                            placeholder="Name"
                            required
                            value={currUser?.username}
                            onChange={(evt) =>
                              setCurrUser({
                                username: evt.target.value,
                                email: currUser?.email,
                                password: currUser?.password,
                                type: currUser?.type,
                              })
                            }
                          />
                        </InputGroup>
                        <FormErrorMessage>{nameError}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={(emailError && emailError !== "") ? true: false}>
                        <FormLabel
                          fontWeight="bold"
                          fontSize="24px"
                          bgClip="text"
                          bgGradient={titleText}
                        >
                          Email
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                          >
                            <IoMailSharp fontSize="25px" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                          </InputLeftElement>
                          <Input
                            name="email"
                            type="text"
                            autoComplete="email"
                            placeholder="Email"
                            required
                            value={currUser?.email}
                            onChange={(evt) =>
                              setCurrUser({
                                username: currUser?.username,
                                email: evt.target.value,
                                password: currUser?.password,
                                type: currUser?.type,
                              })
                            }
                          />
                        </InputGroup>
                        <FormErrorMessage>{emailError}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={(passwordError && passwordError !== "") ? true: false}>
                        <FormLabel
                          fontWeight="bold"
                          fontSize="24px"
                          bgClip="text"
                          bgGradient={titleText}
                        >
                          Password
                        </FormLabel>
                        <InputGroup size="md">
                          <Input
                            pr="4.5rem"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={currUser?.password}
                            onChange={(evt) =>
                              setCurrUser({
                                username: currUser?.username,
                                email: currUser?.email,
                                password: evt.target.value,
                                type: currUser?.type,
                              })
                            }
                          />
                          <InputRightElement width="4.5rem">
                            <IconButton
                              aria-label={
                                showPassword ? "Mask password" : "Reveal password"
                              }
                              bg="transparent !important"
                              size="lg"
                              h="auto"
                              ml="5"
                              icon={
                                showPassword ? (
                                  <HiEye color={(colorMode === "light" ? "#2C4187": "#9DECF9")} fontSize="25px" />
                                ) : (
                                  <HiEyeOff color={(colorMode === "light" ? "#2C4187": "#9DECF9")} fontSize="25px" />
                                )
                              }
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{passwordError}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={(teacherCodeError && teacherCodeError !== "") ? true: false}>
                        <FormLabel
                          fontWeight="bold"
                          fontSize="24px"
                          bgClip="text"
                          bgGradient={titleText}
                        >
                          Teacher Code
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                          >
                            <FaInfo fontSize="25px" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                          </InputLeftElement>
                          <Input
                            name="teacher code"
                            type="text"
                            autoComplete="Teacher Code"
                            placeholder="Teacher Code"
                            required
                            value={teacherCode}
                            onChange={(evt) =>
                              setTeacherCode(evt.target.value)
                            } 
                          />
                        </InputGroup>
                        <FormErrorMessage>{teacherCodeError}</FormErrorMessage>
                      </FormControl>
                    </Stack>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      mt="6"
                      fontSize="20px"
                      w="100%"
                      maxW="100%"
                      bgClip="background"
                      bgGradient={titleText}
                      fontWeight="bolder"
                      _hover={{ bgGradient: titleText }}
                      onClick={async () => {
                        if(nameError === "" && emailError === "" && passwordError === "" && teacherCodeError === "")
                        {
                          console.log("isnide");
                          let error: string | null = await handleSignUp("UEP");
                          if(error !== null && error !== "")
                          {
                            toast({
                              title: "Sign Up Error",
                              description: error,
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            })
                          }
                        }
                      }}
                    >
                      Sign Up
                    </Button>

                    {/* Divider between Form Auth and Google Auth */}
                    {/* <Flex align="center" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} mt="4">
                      <Box flex="1">
                        <Divider borderColor={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                      </Box>
                      <Text
                        as="span"
                        px="3"
                        color={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                        fontWeight="medium"
                      >
                        or continue with
                      </Text>
                      <Box flex="1">
                        <Divider borderColor={(colorMode === "light" ? "#2C4187": "#9DECF9")} />
                      </Box>
                    </Flex> */}

                    {/* Login with other Company Auth */}
                    {/* <SimpleGrid mt="4" rows={1} spacing="3">
                      <Button
                        color={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                        variant="outline"
                        borderColor={(colorMode === "light" ? "#2C4187": "#9DECF9")}
                        onClick={() => { handleGoogleSignUp("teacher") }}
                      >
                        <FaGoogle />
                        <Text ml="5" fontWeight="bold">
                          Sign Up with Google
                        </Text>
                      </Button>
                    </SimpleGrid> */}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
            <Flex w="100%" p="4">

            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default SignUp;
