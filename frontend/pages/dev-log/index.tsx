import React from 'react'
import LandingPageNav from '../../components/LandingPageNav';
import { Box, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import DevlogCard from '../../components/DevlogCard';
import { grayDarkMode } from '../../colors';
import Head from 'next/head';

const DevLog: React.FC<any> = () =>  {
    const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF, #2C4187)", `linear(to-b,${grayDarkMode},blue.500, ${grayDarkMode})`)
    return (
      <Box>
        {/* DevLog: https://www.bayanbennett.com/posts/how-i-started-a-website-or-devlog-001/ */}
        <Head>
          <title>Devlog</title>
        </Head>
        <LandingPageNav />
        <Box w="100%" h="92.7vh" bgGradient={bgColorGradient} justifyContent="center" alignItems="center">
          <Text
              fontSize="5vh"
              color="white"
              fontWeight="extrabold"
              textAlign="center"
          >
              MasterIt Developer Logs
          </Text>
          <Text
            fontSize="2vh"
            color="white"
            fontWeight="normal"
            textAlign="center"
          >
            Developer Logs will show any new features, bugs/errors present in the platform, and if the platform is down.
          </Text>
          <Box
            w="50%" 
            h="80vh"
            ml="auto" 
            mr="auto" 
            mt="5"
            p="3"
            flexDirection="column"
            css={{ 
              overflowY: "auto",
              position: "relative",
              '&::-webkit-scrollbar': { 
                display: "none"
              },
              "border-radius": "5px",
            }}
          >
            <DevlogCard />
          </Box>
        </Box>
      </Box>
    )
}

export default DevLog;