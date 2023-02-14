import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Navbar from "../../../../components/Navbar";
import Loading from "../../../../components/Loading";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { useGetCourseDetailsQuery } from "../../../../generated/graphql";
import { GetServerSideProps } from "next";
import { useAuth } from "../../../../AuthContext";
const CourseBoard = dynamic(
  () => import("../../../../components/Courseboard"),
  {
    ssr: false,
  }
);

interface Course {
  name: string;
  description: string;
  teacherID: string;
  courseCode: string;
  courseLink: string;
  nodes: Array<any>; // TODO: make sure to change to Node Type
}

const StudentCoursePage: React.FC<any> = ({ id }) => {
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

  const router = useRouter();
  const [course, setCourse] = useState<Course>();
  const { data, error, loading } = useGetCourseDetailsQuery({
    variables: { id },
    fetchPolicy: "network-only",
  });

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (!loading) {
      setCourse(data.getCourse);
    }
  }, [data]);

  return (
    <div>
      <Head>
        <title>{course ? course.name : "Loading..."}</title>
      </Head>
      {loading ? (
        <Loading />
      ) : (
        <div style={{
          backgroundColor: "#f8f8f8", 
        }}>
          <Navbar type="student" id={id}/>
          <Box>
            {course == undefined ? (
              <Loading />
            ) : (
              <CourseBoard
                type={"student"}
                course={data?.getCourse}
                data={data?.getCourse.nodes}
              />
            )}
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

export default StudentCoursePage;
