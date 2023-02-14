import React, { useState, useEffect } from "react";
import JoinCourseModal from "../../../components/JoinCourseModal";
import CourseIcon from "../../../components/CourseIcon";
import Navbar from "../../../components/Navbar";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Image,
  Text,
  Tag,
  LinkBox,
  useColorMode,
  useColorModeValue,
  Button
} from "@chakra-ui/react";
import { useGetStudentDetailsQuery, useGetTwoNodesInProgressMutation } from "../../../generated/graphql";
import { useAuth } from "../../../AuthContext";
import { storage } from "../../../firebase";
import Head from "next/head";
import Loading from "../../../components/Loading";
import { grayDarkMode, whiteLightMode } from "../../../colors";
import EditProfileModal from "../../../components/EditProfileModal";

const Dashboard: React.FC<any> = ({ id }) => {
  const { colorMode } = useColorMode()
  const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF,#2C4187)", `linear(to-t,${grayDarkMode},blue.500, ${grayDarkMode})`)
  const bgColor = useColorModeValue(whiteLightMode, `gray.900`)
  const router = useRouter();
  const { getTokenInfo }: any = useAuth();
  const imagesListRef = storage.ref("profile_images/");
  const { data, error, loading } = useGetStudentDetailsQuery({
    variables: { id: id },
    fetchPolicy: "network-only",
  });
  const [
    getTwoNodesInProgress,
    { loading: nodesLoadingProgress },
  ] = useGetTwoNodesInProgressMutation();

  const[url, setURL] = useState<any>(null);
  const[colorScheme, setColorScheme] = useState<string>("");
  const [progressNodes, setProgressNodes] = useState<any>([]);

  const { setAccessToken, setRefreshToken, refreshToken }: any = useAuth();
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

  // console.log(progressNodes);

  useEffect(() => {
    if(data && url == null)
    {
      const getProfileImg = async () => {
        let response = await imagesListRef.listAll();
        response.items.forEach(async (item) => {
          let url = await item.getDownloadURL();
          if(url === data.getStudent?.profilePic){
            setURL(url);
          }
        })
      }

      getProfileImg()
      
      if(data?.getStudent.grade == 9)
        setColorScheme("red");
      else if(data?.getStudent.grade == 10)
        setColorScheme("green");
      else if(data?.getStudent.grade == 11)
        setColorScheme("yellow");
      else if(data?.getStudent.grade == 12)
        setColorScheme("cyan");

      let pns = [];
      const configureProgressNodes = async () => {
        for(let i = 0; i < data?.getStudent.courses.length; i++)
        {
          let result = await getTwoNodesInProgress({
            variables: { 
              courseID: data?.getStudent.courses[i].id,
              studentID: getTokenInfo()?.userID
            }
          })
          pns.push(result.data.getTwoNodesInProgress);
        }
        setProgressNodes(pns);
      }

      if(progressNodes.length === 0)
      {
        configureProgressNodes();
      }
    }
  }, [data])

  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }


  return (
    <div>
      <Head><title>Dashboard - Student</title></Head>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Box bgColor={bgColor} minH="100vh">
            <Navbar logoPath={"../../../public/MasterItLogo.jpg"} />
            <Box width="100%" height="auto" bgGradient={bgColorGradient}>
              <Flex alignItems="center">
                <Box width="50%" pl="10" pr="10" pt="4" pb="4">
                  <Flex justifyContent="center">
                    <Image
                      objectFit="cover"
                      src=""
                      fallbackSrc={url ? url : "../profileimage_default.png"} 
                      alt="Profile Image"
                      boxSize="25vh"
                      border="4px solid #ffffff"
                    />
                  </Flex>
                </Box>
                <Box ml="10%">
                  <Text fontWeight="extrabold" fontSize="48px" color="white" noOfLines={1}>
                    {data?.getStudent?.username}
                  </Text>
                  <Flex alignItems="center" mt="2">
                    <Tag fontSize="18px" colorScheme={colorScheme} p="2" noOfLines={1}>
                      {data?.getStudent?.grade}th grade
                    </Tag>
                  </Flex>
                  <Text fontWeight="light" fontSize="18px" mt="2" color="white" noOfLines={1}>
                    {data?.getStudent?.school}
                  </Text>
                  <Text fontWeight="light" fontSize="18px" mt="2" color="white" noOfLines={1}>
                    {data?.getStudent?.email}
                  </Text>
                  <EditProfileModal 
                    id={data.getStudent.id} 
                    cname={data.getStudent.username} 
                    cemail={data.getStudent.email} 
                    cschool={data.getStudent.school} 
                    cgrade={data.getStudent.grade}
                    cprofilePicImageURL={data.getStudent.profilePic}
                    type="student"
                  />
                </Box>
              </Flex>
            </Box>
            <Box p="5" bgColor={bgColor}>
              <Flex justifyContent="center">
                <Flex
                  width="65%"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontWeight="extrabold" fontSize="30px">
                      Courses
                    </Text>
                    <Text fontWeight="light" fontSize="12px" mt="-2" ml="0.8">
                      Scroll left or right to view all your courses
                    </Text>
                  </Box>
                  <JoinCourseModal id={id} />
                </Flex>
              </Flex>
              <Flex justifyContent="center" alignItems="center" mt="1">
                <Box 
                  // border="2px solid black" 
                  maxWidth="80%" 
                  css={{ 
                    display: "flex",
                    overflowX: "auto",
                    position: "relative",
                    '&::-webkit-scrollbar': { 
                      display: "none"
                    },
                    "border-radius": "5px",
                  }}
                >
                  {data?.getStudent.courses?.map(
                    (
                      course: { id: string; name: string; description: string;},
                      index
                    ) => (
                      <LinkBox
                        key={index}
                        onClick={() => {
                          router.push({pathname: `student/courses/${course.id}`}, null, {shallow: true});
                        }}
                        mt="5"
                        mb="5"
                      >
                        <CourseIcon
                          name={course?.name}
                          description={course?.description}
                          progressNodes={(progressNodes[index])}
                          courseID={course.id}
                          loading={nodesLoadingProgress}
                        />
                      </LinkBox>
                    )
                  )}              
                </Box>
              </Flex>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query: { id },
}) => {
  return {
    props: { id },
  };
};

export default Dashboard;
