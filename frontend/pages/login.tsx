import React, { useState, useEffect } from "react";
import Head from "next/head";
import Loading from "../components/Loading";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/router";
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
  useToast,
  useColorMode
} from "@chakra-ui/react";
import {
  useLoginStudentMutation,
  useLoginTeacherMutation,
} from "../generated/graphql";
import { Card } from "../components/Card";
import { IoMailSharp } from "react-icons/io5";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaGoogle } from "react-icons/fa";
import { grayDarkMode } from "../colors";
import { authentication, provider } from "../firebase";

interface LoginVars {
  email: string | null;
  password: string | null;
  type: string | null;
}

function Login() {
  const toast = useToast()
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("white", "#171923")  // gray.100 = #EDF2F7, gray.900 = #171923

  const [currUser, setCurrUser] = useState<LoginVars>({
    email: null,
    password: null,
    type: "student",
  });
  const auth: any = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const[emailError, setEmailError] = useState<string | null>(null);
  const[passwordError, setPasswordError] = useState<string | null>(null);
  const[loginError, setLoginError] = useState<string | null>(null);
  const [
    loginStudent,
    { loading: studentLoginLoading },
  ] = useLoginStudentMutation();
  const [
    loginTeacher,
    { loading: teacherLoginLoading },
  ] = useLoginTeacherMutation();


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

  const handleGoogleLogin = async (type: string) => {
    const { user } = await authentication.signInWithPopup(provider);
    console.log(user);
    // loginUser("google", type, user);
  };

  // TODO: teacher auth with google
  const loginUser = async (authType: string, type?: string, user?: any)  => {
    if (currUser.type === "student") {
      let data;
      let error = "";
      if (authType === "google") {
        await loginStudent({
          variables: {
            email: user.providerData[0].email,
            password: user.providerData[0].uid,
          },
        })
      }
      else {
        await loginStudent({
          variables: {
            email: currUser.email,
            password: currUser.password,
          },
        }).then((response) => { 
          if(!response.errors)
          data = response.data;
        }).catch(err => {
          error = err.message;
          return;
        });
      }
      // let data;
      // let error = "";
      // await loginStudent({
      //   variables: {
      //     email: currUser.email,
      //     password: currUser.password,
      //   },
      // }).then((response) => { 
      //   if(!response.errors)
      //    data = response.data;
      // }).catch(err => {
      //   error = err.message;
      //   return;
      // });

      setCurrUser({
        email: "",
        password: "",
        type: "",
      });

      if(error !== "")
      {
        setCurrUser({
          email: "",
          password: "",
          type: "student",
        });
        return error;
      }
      else
      {
        if (data && data.loginStudent) {
          auth.setAccessToken(data.loginStudent.accessToken);
          auth.setRefreshToken(data.loginStudent.refreshToken);
          localStorage.setItem("refreshToken", data.loginStudent.refreshToken);
        }

        setCurrUser({
          email: "",
          password: "",
          type: "",
        });

        router.push({
          pathname: "/dashboard/student",
          query: { id: data?.loginStudent.userID },
        }, null, {shallow: true});
      }


    } else if (currUser.type === "teacher") {
      let data;
      let error = "";
      await loginTeacher({
        variables: {
          email: currUser.email,
          password: currUser.password,
        },
      }).then((response) => { 
        if(!response.errors)
         data = response.data;
      }).catch(err => {
        error = err.message;
        return;
      });


      if(error !== "")
      {
        setCurrUser({
          email: "",
          password: "",
          type: "student",
        });
        return error;
      }
      else
      {
        if (data && data.loginTeacher) {
          auth.setAccessToken(data.loginTeacher.accessToken);
          auth.setRefreshToken(data.loginTeacher.refreshToken);
          localStorage.setItem("refreshToken", data.loginTeacher.refreshToken);
        }

        setCurrUser({
          email: "",
          password: "",
          type: "",
        });

        router.push({
          pathname: "/dashboard/teacher",
          query: { id: data?.loginTeacher.userID },
        }, null, {shallow: true});
      }
    }
    return null;
  };

  return (
    <Box bgColor={bgColor} w="100%" h="100vh">
      <Head>
        <title>Login</title>
      </Head>

      {studentLoginLoading || teacherLoginLoading ? (
        <Loading />
      ) : (
        <Box bg={bgColor} w="100%" h="100vh">
          <Flex mr="3" justifyContent="flex-end">
            <Text color={(colorMode === "light" ? "#3788FF": "cyan.200")} mt="2">New to MasterIt?</Text>
            <Link ml="2" fontWeight="bold" mt="2" color={(colorMode === "light" ? "#2C4187": "#9DECF9")} href="/signup">
              Sign Up
            </Link>
            <Box textAlign='right' py={4}>
              {/* <IconButton
                color={colorMode === 'light' ? 'black' : 'light'}
                onClick={toggleColorMode}
                variant='ghost'
                aria-label="button"
              /> */}
            </Box>
          </Flex>
          <Box maxW="md" mx="auto" py="5" px={{ base: "4", lg: "8" }}>
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
            <Card maxW="xl" mx="auto" mb="5" bgColor={(colorMode === "light" ? "gray.50": grayDarkMode)}>
              <Heading
                ml="5"
                textAlign="center"
                size="xl"
                fontWeight="extrabold"
                fontSize="36px"
                bgClip="text"
                bgGradient={titleText}
              >
                Login
              </Heading>
              <Text
                mt="4"
                mb="6"
                align="center"
                maxW="xl"
                fontWeight="regular"
                bgClip="text"
                bgGradient={titleText}
              >
                <Text as="span">
                  Welcome back to MasterIt! We hope you are ready to master new
                  skills today!
                </Text>
              </Text>
              <Tabs variant="soft-rounded" isFitted colorScheme="blue" maxW="xl"  mt="2">
                <TabList>
                  <Tab
                    onClick={() =>
                      setCurrUser({
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
                          if(emailError === "" && passwordError === "")
                          {
                            let error: string | null = await loginUser("student");
                            if(error !== null && error !== "")
                            {
                              toast({
                                title: "Login Error",
                                description: error,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                              })
                            }
                          }
                          
                        }
                      } 
                    >
                      Login
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
                        onClick={() => {
                          handleGoogleLogin("student")
                        }}
                      >
                        <FaGoogle />
                        <Text ml="5" fontWeight="bold">
                          Login with Google
                        </Text>
                      </Button>
                    </SimpleGrid> */}
                  </TabPanel>
                  <TabPanel>
                    <Stack spacing="3">
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
                        if(emailError === "" && passwordError === "")
                        {
                          let error: string | null = await loginUser('teacher');
                          if(error !== null && error !== "")
                          {
                            toast({
                              title: "Login Error",
                              description: error,
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            })
                          }
                        }
                      }
                    }
                    >
                      Login
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
                      >
                        <FaGoogle />
                        <Text ml="5" fontWeight="bold">
                          Login with Google
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

export default Login;
