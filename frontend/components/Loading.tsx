import React from 'react';
import Head from "next/head";
import { Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import ThreeDots from './ThreeDots';
import { grayDarkMode } from '../colors';

const Loading = () => {
    const bgColorGradient = useColorModeValue("linear(to-t,#2C4187,#5E81FF, #2C4187)", `linear(to-b,${grayDarkMode},blue.500, ${grayDarkMode})`)

    return (
        <Flex w="100%" h="100vh" bgGradient={bgColorGradient} flexDirection="column" justifyContent="center" alignItems={"center"}>
            <Head>
                <title>Loading...</title>
            </Head>
            <Spinner
                thickness='20px'
                speed='1.20s'
                color='white'
                emptyColor="#2C4187"
                width="250px"
                height="250px"
            />
            <Flex justifyContent="center" alignItems="center">
                <Text mt="10" fontWeight="bolder" fontSize="48px" color="white">Loading</Text>
                <ThreeDots />
            </Flex>
        </Flex>
    )
}


export default Loading;
