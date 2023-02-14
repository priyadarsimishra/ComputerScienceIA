import React from 'react'
import { Heading, Button, Box, Flex, Image, Text, useColorModeValue, useColorMode, Link } from "@chakra-ui/react";
import {useRouter} from "next/router";
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { whiteLightMode, grayDarkMode } from '../colors';

const LandingPageNav = () => {
    const router = useRouter();
    const { colorMode } = useColorMode()
    const navbarBg = useColorModeValue(whiteLightMode, "gray.900") 
    const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")

    return (
        <Flex w="100%" bg={navbarBg} p="3" justifyContent="space-between" alignItems="center" zIndex={3}>
            <Flex alignItems="center" onClick={() => router.push({pathname: "/"})}>
                <Image src={(colorMode === "light" ? "/MasterItLogo_light.png": "MasterItLogo_dark.png")} w="60px" h="60px" />
                <Text
                    size="lg"
                    bgClip="text"
                    ml="3"
                    fontSize="36px"
                    bgGradient={titleText}
                    fontWeight="extrabold"
                >
                    MasterIt
                </Text>
            </Flex>
            <Flex mr="5vw" alignItems="center" justifyContent="center">
                <Box ml="2">
                    <Button
                        colorScheme="white"
                        size="lg"
                        onClick={() => router.push("/about-us")}
                    >
                        <Text bgClip="text" bgGradient={titleText} fontSize="24px"  fontWeight="bold">About Us</Text>
                    </Button>
                </Box>
                <Box ml="2">
                    <Button
                        colorScheme="white"
                        size="lg"
                        onClick={() => router.push("/dev-log")}
                    >
                        <Text bgClip="text" bgGradient={titleText} fontSize="24px"  fontWeight="bold">Devlog</Text>
                    </Button>
                </Box>
                <Button
                    colorScheme="white"
                    size="lg"
                >
                    <Link target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfp2V3V5_LLBw7C_-JZbDeSNewUkoytpATidU-RbXjNs51wCg/viewform?usp=pp_url">
                        <Text bgClip="text" bgGradient={titleText} fontSize="24px"  fontWeight="bold">Send Feedback</Text>
                    </Link>
                </Button>
                <Box ml="2">
                    <Button
                        colorScheme="white"
                        size="lg"
                        onClick={() => router.push({pathname: "/signup"}, null, {shallow: true})}
                    >
                        <Text bgClip="text" bgGradient={titleText} fontSize="24px"  fontWeight="bold">Sign Up</Text>
                    </Button>
                </Box>
                <Box ml="2">
                    <Button
                        colorScheme="white"
                        size="lg"
                        onClick={() => router.push({pathname: "/login"}, null, {shallow: true})}
                    >
                        <Text bgClip="text" bgGradient={titleText} fontSize="24px"  fontWeight="bold">Login</Text>
                    </Button>
                </Box>
                <Box ml="2">
                    <ColorModeSwitcher show={false} />
                </Box>
            </Flex>
        </Flex>
    )
}


export default LandingPageNav;