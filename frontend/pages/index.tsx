import Head from "next/head";
import { useRouter } from "next/router";
import { Heading, Button, Text, Flex, Image, useColorModeValue, useColorMode } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons"
import LandingPageNav from "../components/LandingPageNav";
import { grayDarkMode, whiteLightMode } from "../colors";

export default function Home() {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF, #2C4187)", `linear(to-b,${grayDarkMode},blue.500, ${grayDarkMode})`)
  const bgColor = useColorModeValue("#2C4187", `${grayDarkMode}`)
  
  return (
    <div>
      <Head>
        <title>MasterIt</title>
      </Head>
      <LandingPageNav />
      <Flex w="100%" mb="0" h="87vh">
        <Flex w="40%"  bgGradient={bgColorGradient}>
          <Flex m="auto" w="70%" p="2" h="60%" flexDirection="column">
            <Text color="white" fontSize="4.5vw" fontWeight="bolder">MasterIt</Text>
            <Text color="white" fontSize="1.2vw" fontWeight="bolder" mb="10">
              A platform designed to help teachers make learning more engaging and entertaining for all students. 
            </Text>
            <Button 
              size="lg"
              padding={"8"}
              w="40%" 
              bgColor="white" 
              boxShadow="20px 20px 64px #6666FF,-20px -20px 64px #039BE5;"
              rightIcon={<ArrowForwardIcon fontSize="1.8vw" fontWeight="bold" color="#5E81FF" />}
              onClick={() => router.push({pathname: "/signup"}, null, {shallow: true})}
            >
              <Text fontWeight="bolder"  bgClip="text" bgGradient="linear(to-t,#2C4187,#5E81FF)" fontSize="1.5vw">Sign Up</Text>
            </Button>
          </Flex>
        </Flex>
        <Flex w="60%" bgGradient={bgColorGradient}>
          <Flex m="auto" w="80%" h="60%">
            <Image src="/bgLandingPage.png" w="48%" position="fixed" mt="-18vh" ml="-5vw" zIndex={1}/>
            <Image 
              src={(colorMode === "light" ? "/landingpage_light.png": "/landingpage_dark.png" )}
              borderRadius="15" 
              zIndex={3} 
              boxShadow={"30px 30px 64px #6666FF,-30px -30px 64px #039BE5"}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex w="100%" bgColor={bgColor} color="white" h="5.5vh" justifyContent="space-between">
        {/* Footer */}
        <Flex>

        </Flex>
        <Flex >
          <Text 
            size="lg"
            ml="3"
            fontSize="12px"
            fontWeight="light"
            mr="2"
            mt="8"
          >
            Product associated with Westwood High School
          </Text>
        </Flex>
      </Flex>
    </div>
  );
}
