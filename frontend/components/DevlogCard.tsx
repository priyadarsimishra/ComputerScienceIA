import React from 'react'
import { Flex, Box, Text, useColorModeValue, useColorMode } from "@chakra-ui/react";

const DevlogCard: React.FC<any> = () => {
    const { colorMode } = useColorMode();
    const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")

    return (
        <Flex
            bg={(colorMode === "light" ? "white": "gray.800")}
            boxShadow="2xl"
            w="100%"
            h="120px"
            rounded={{ sm: "lg" }}
            justifyContent="center"
            alignItems="center"
            mb="5"
        >
            <Text 
                bgClip="text"
                ml="3"
                fontSize="3vh"
                bgGradient={titleText}
                fontWeight="extrabold"
            >
                V1 of MasterIt set to launch through BETA on August 31st, 2022
            </Text>
        </Flex>
    )
}

export default DevlogCard;
