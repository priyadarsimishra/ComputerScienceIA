import React from 'react'
import LandingPageNav from '../../components/LandingPageNav';
import Head from "next/head";
import { Box, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { grayDarkMode } from '../../colors';

const AboutUs: React.FC<any> = () => {
    const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF, #2C4187)", `linear(to-b,${grayDarkMode},blue.500, ${grayDarkMode})`)

    return (
      <Box>
        <Head>
          <title>About Us</title>
        </Head>
        <Box bgGradient={bgColorGradient} w="100%" h="100%">
          {/* About Us: https://www.searchenginejournal.com/about-us-page-examples/250967/ */}
          <LandingPageNav />
          <Flex w="100%" h="92.7vh" bgGradient={bgColorGradient} flexWrap="wrap">
            <Flex w="40%" justifyContent="center" alignItems="center" flexDirection="column" mt="5">
              <Box mb="5">
                <Image boxSize="12vw" h="32vh" src="/IMG_5600.jpg" border="2px solid white" borderRadius="15"/>
                <Text color="white" fontWeight="bold" fontSize="18px" textAlign="center" mt="2">Priyadarsi Mishra</Text>
              </Box>
              <Box mt="5">
              <Image boxSize="12vw" h="34vh" objectFit={'cover'} border="2px solid white" borderRadius="15" src="/mrhulsey.JPG" />
              <Text color="white" fontWeight="bold" fontSize="18px" textAlign="center" mt="2">Bailey Hulsey</Text>
              </Box>
            </Flex>
            <Flex w="60%" justifyContent="center" alignItems="center" flexDirection="column">
              <Text color="white" fontWeight="bold" fontSize="3vh" w="80%">
                MasterIt is a platform to help students and teachers track mastery in a certain course, but giving
                teachers the tool to create engaging assignments. MasterIt was created in order to make learning 
                more fun rather than making it all memorization. This allows students to actually retain knowledge 
                rather than forgetting it all after the course is over. This product is associated with Westwood High School
                and was created by a student for students under the supervision of Mr. Hulsey.
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    )
}

export default AboutUs;