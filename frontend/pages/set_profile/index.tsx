import React, { useState, useEffect } from 'react'
import { InboxOutlined } from '@ant-design/icons';
import { Box, FormControl, FormLabel, Heading, InputGroup, Flex, Button, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import { useAuth } from "../../AuthContext";
import { Card } from '../../components/Card';
import { useSetStudentProfileMutation, useSetTeacherProfileMutation } from '../../generated/graphql';
import { Upload } from 'antd';
const { Dragger } = Upload;
import Loading from "../../components/Loading";
// import 'antd/dist/antd.css';
import { grayDarkMode } from '../../colors';
import Head from 'next/head';


const SetProfile = () => {
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("gray.10", "gray.900") 
  const router = useRouter();
  const { setAccessToken, getTokenInfo, refreshToken, setRefreshToken } : any = useAuth();
  const profileImagesListRef = storage.ref();
  const [image, setImage] = useState<any>(null);
  const [grade, setGrade] = useState<any>(9);
  const [school, setSchool] = useState<any>(null);
  const [setStudentProfile, {loading: studentLoading}] = useSetStudentProfileMutation();
  const [setTeacherProfile, {loading: teacherLoading}] = useSetTeacherProfileMutation();

  useEffect(() => {
    fetch("http://localhost:5001/refresh_token", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({refreshToken: localStorage.getItem("refreshToken")})
    }).then(async (res) => {
      const { accessToken, refreshToken } = await res.json();
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    });
  }, []);


  const submit = async () => {
    if (image == null) 
    {
      if(getTokenInfo()?.type === "student"){
        await setStudentProfile({
          variables: {
            id: getTokenInfo()?.userID,
            profilePicUrl: "",
            grade: grade,
            school: school,
          }
        })
      }
      else{
        await setTeacherProfile({
          variables: {
            id: getTokenInfo()?.userID,
            profilePicUrl: "",
            school: school,
          }
        })
      }
      router.push({
        pathname: `/dashboard/${getTokenInfo()?.type}`,
        query: { id: getTokenInfo()?.userID },
      }, null, {shallow: true});
      return;
    }
    const imageRef = profileImagesListRef.child(`profile_images/${image?.name + v4()}`);
    imageRef.put(image.originFileObj).then(async (snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("LINK: ", downloadURL);
        if(getTokenInfo()?.type === "student"){
          setStudentProfile({
            variables: {
              id: getTokenInfo()?.userID,
              profilePicUrl: downloadURL,
              grade: grade,
              school: school,
            }
          }).then(() => {
            console.log("student profile updated")
            router.push({
              pathname: `/dashboard/student`,
              query: { id: getTokenInfo()?.userID },
            }, null, {shallow: true});
          })
        }
        else{
          setTeacherProfile({
            variables: {
              id: getTokenInfo()?.userID,
              profilePicUrl: downloadURL,
              school: school,
            }
          }).then(() => {
            console.log("teacher profile updated")
            router.push({
              pathname: `/dashboard/teacher`,
              query: { id: getTokenInfo()?.userID },
            }, null, {shallow: true});
          })
        }
      })
    });
  }

  return (
    <div>
    {(studentLoading || teacherLoading) ? <Loading /> : 
        <Box bg={bgColor} minH="100vh">
          <Head>
            <title>Set Profile</title>
          </Head>
          <Box maxW="100%" mx="auto" py="5" px={{ base: "4", lg: "8" }}>
            <Flex alignItems="center" justifyContent="center" mt="16vh" mb="5">
              <Heading
                ml="5"
                textAlign="center"
                size="xl"
                fontWeight="extrabold"
                fontSize="50px"
                bgClip="text"
                bgGradient={titleText}
                mb="8"
              >
                Set up your Profile!
              </Heading>
            </Flex>
            <Card maxW="xl" mx="auto" bgColor={(colorMode === "light" ? "white.50": grayDarkMode)}>
              <FormControl>
                <FormLabel
                  fontWeight="bold"
                  fontSize="24px"
                  bgClip="text"
                  bgGradient={titleText}
                >
                  Profile Picture
                </FormLabel>
                <Dragger 
                  multiple={false} 
                  onChange={(event) => setImage(event.file)}
                  style={{backgroundColor: (colorMode === "light" ? "#F7FAFC" : "#171923")}}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}/>
                  </p>
                  <p className="ant-upload-text" style={{color:(colorMode === "light" ? "#4299E1" :"#9DECF9")}}>Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint" style={{ paddingLeft: "10px", color:(colorMode === "light" ? "#4299E1" :"#9DECF9") }}>
                    Support for a single or bulk upload. Make sure to upload an appropriate profile picture - a professional picture of you
                  </p>
                </Dragger>
              </FormControl>
              {getTokenInfo()?.type !== "teacher" ? (
                <FormControl mt="4">
                  <FormLabel
                    fontWeight="bold"
                    fontSize="24px"
                    bgClip="text"
                    bgGradient={titleText}
                  >
                    Grade
                  </FormLabel>
                  <InputGroup>
                    <NumberInput w="100%" defaultValue={9} min={9} max={12} onChange={(value) => {setGrade(parseInt(value));}}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                </FormControl>
              ): null  }
              <FormControl mt="4">
                <FormLabel
                  fontWeight="bold"
                  fontSize="24px"
                  bgClip="text"
                  bgGradient={titleText}
                >
                  School
                </FormLabel>
                <InputGroup>
                  <Select placeholder='Select School' onChange={(ev) => setSchool(ev.target.value)}>
                    <option value={"Westwood High School"}>Westwood High School</option>
                  </Select>
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                mt="8"
                fontSize="20px"
                w="100%"
                maxW="100%"
                bgClip="background"
                bgGradient={titleText}
                fontWeight="bolder"
                _hover={{ bgGradient: titleText }}
                onClick={() => {
                  if(school !== null)
                    submit()
                }}
              >
                Submit
              </Button>
            </Card>
          </Box>
      </Box>
    }
    </div>
  )
}

export default SetProfile;