import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Wrap,
  WrapItem,
  Box,
  Flex,
  Image,
  Text,
  Tag,
  LinkBox,
  useColorMode,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { storage } from "../../../firebase";
import { useGetTeacherDetailsQuery } from "../../../generated/graphql";
import { useAuth } from "../../../AuthContext";
import { whiteLightMode, grayDarkMode } from "../../../colors";
import Loading from "../../../components/Loading";
import Head from "next/head";
import Navbar from "../../../components/Navbar";
import CreateCourseModal from "../../../components/CreateCourseModal";
import CourseIcon from "../../../components/CourseIcon";
import EditProfileModal from "../../../components/EditProfileModal";
// import JoinCourseModal from "../../../components/JoinCourseModal";

const Dashboard: React.FC<any> = ({ id }) => {
  const { colorMode } = useColorMode()
  const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF,#2C4187)", `linear(to-t,${grayDarkMode},blue.500, ${grayDarkMode})`)
  const bgColor = useColorModeValue(whiteLightMode, `gray.900`)

  const router = useRouter();
  const { data, error, loading } = useGetTeacherDetailsQuery({
    variables: { id: id },
    fetchPolicy: "network-only",
  });
  
  const { setAccessToken, setRefreshToken, refreshToken }: any = useAuth();
  const imagesListRef = storage.ref("profile_images/");
  const[url, setURL] = useState<any>(null);

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

  useEffect(() => {
    if(data && url==null)
    {
      imagesListRef.listAll().then(response => {
        console.log(response);
        response.items.forEach(item => {
          item.getDownloadURL().then(url => {
            if(url === data.getTeacher?.profilePic){
              setURL(url);
            }
          })
        })
      })
    }
  }, [data])



  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }

    // console.log(data?.getTeacher.courses);

  return (
    <div>
      <Head>
        <title>Dashboard - Teacher</title>
      </Head>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Box bgColor={bgColor} minH="100vh">
            <Navbar type="teacher" logoPath={"../../../public/MasterItLogo.jpg"} />
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
                    {data.getTeacher.username}
                  </Text>
                  <Flex mt="2">
                    <Tag colorScheme="teal" fontSize="18px" p="2" noOfLines={1}>
                      Teacher
                    </Tag>
                  </Flex>
                  <Text fontWeight="medium" fontSize="18px" mt="2" color="white" noOfLines={1}>
                    {data.getTeacher.school}
                  </Text>
                  <Text fontWeight="medium" fontSize="18px" mt="2" color="white" noOfLines={1}>
                    {data.getTeacher.email}
                  </Text>
                  <EditProfileModal
                    id={data.getTeacher.id} 
                    cname={data.getTeacher.username} 
                    cemail={data.getTeacher.email} 
                    cschool={data.getTeacher.school} 
                    cprofilePicImageURL={data.getTeacher.profilePic}
                    cgrade={null} 
                    type="teacher" 
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
                  <CreateCourseModal id={id}/>
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
                  {data.getTeacher.courses?.map(
                    (
                      course: { id: any; name: string; description: string; courseCode: string; numOfStudents: number },
                      key: React.Key
                    ) => (
                      <LinkBox
                        key={key}
                        onClick={() => {
                          router.push({pathname: `teacher/courses/${course.id}`}, null, {shallow: true});
                        }}
                        mt="5"
                        mb="5"
                      >
                        <CourseIcon
                          name={course?.name}
                          description={course?.description}
                          numOfStudents={course?.numOfStudents}
                          courseCode={course?.courseCode}
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

