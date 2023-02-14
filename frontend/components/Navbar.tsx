import React from "react";
import {
  Flex,
  Box,
  Text,
  Spacer,
  Button,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  Link,
  useColorModeValue,
  useColorMode,
  Image
} from "@chakra-ui/react";
import { HamburgerIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/router";
import { useLogoutMutation } from "../generated/graphql";
import url from "../public/MasterItLogo.jpg"
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { whiteLightMode } from '../colors';

const Navbar: React.FC<any> = ({ type, id, logoPath }) => {
  const router = useRouter();
  const auth: any = useAuth();
  const [logout, loading] = useLogoutMutation();
  const { colorMode } = useColorMode()
  const navbarBg = useColorModeValue(whiteLightMode, "gray.900") 
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")

  const borderColor  = useColorModeValue("#2C4187", "#9DECF9")
  return (
    <Flex
      alignItems="center"
      w="100%"
      h="auto"
      p="3"
      backgroundColor={navbarBg}
      borderBottom={`2px solid ${borderColor}`}
    >
      <Box onClick={() => router.reload()}>
        <Flex alignItems="center">
          <Image
            width="50px"
            height="50px"
            src={(colorMode === "light" ? "/MasterItLogo_light.png": "/MasterItLogo_dark.png")}
            alt="logo"
          />
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
      </Box>
      <Spacer />
      <Box>
        <Button
          backgroundColor={(colorMode === "light" ? "#ffffff": "gray.900")}
          color={(colorMode === "light" ? "blue.800": "#9DECF9")}
          borderColor={(colorMode === "light" ? "blue.800": "#9DECF9")}
          borderWidth="2px"
          mr="4"
          fontWeight="extrabold"
          _hover={{ bg: (colorMode === "light" ? "blue.800": "#9DECF9"), borderWidth: "2px", color: ((colorMode === "light" ? "white": "gray.900")) }}
          onClick={() => {
            router.push({
              pathname: `/dashboard/${auth.getTokenInfo()?.type}`,
              query: {
                id: auth.getTokenInfo()?.userID,
              },
            }, null, {shallow: true});
          }}
        >
          Dashboard
        </Button>
        {/* <Button
          backgroundColor="#ffffff"
          color="blue.800"
          borderColor="blue.800"
          borderWidth="2px"
          mr="4"
          fontWeight="extrabold"
          _hover={{ bg: "blue.800", borderWidth: "2px", color: "white" }}
        >
          Activity
        </Button> */}
        {type == "teacher" ? (
          <Button
            backgroundColor={(colorMode === "light" ? "#ffffff": "gray.900")}
            color={(colorMode === "light" ? "blue.800": "#9DECF9")}
            borderColor={(colorMode === "light" ? "blue.800": "#9DECF9")}
            borderWidth="2px"
            mr="4"
            fontWeight="extrabold"
            _hover={{ bg: (colorMode === "light" ? "blue.800": "#9DECF9"), borderWidth: "2px", color: ((colorMode === "light" ? "white": "gray.900")) }}
            onClick={() =>
              router.push({
                pathname: "/dashboard/teacher/class_progress",
                query: null,
              }, null, {shallow: true})
            }
          >
            Class Progress
          </Button>
        ) : null}
        {/* TODO: Add the selected tab colors */}
        <Button
          backgroundColor={(colorMode === "light" ? "#ffffff": "gray.900")}
          color={(colorMode === "light" ? "blue.800": "#9DECF9")}
          borderColor={(colorMode === "light" ? "blue.800": "#9DECF9")}
          borderWidth="2px"
          mr="4"
          fontWeight="extrabold"
          _hover={{ bg: (colorMode === "light" ? "blue.800": "#9DECF9"), borderWidth: "2px", color: ((colorMode === "light" ? "white": "gray.900")) }}
        >
          <Link _hover={{color: ((colorMode === "light" ? "white": "gray.900")), textDecoration: "none"}} target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfp2V3V5_LLBw7C_-JZbDeSNewUkoytpATidU-RbXjNs51wCg/viewform?usp=pp_url">
            Send Feedback
          </Link>
        </Button>
      </Box>
      <Box>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon fontSize="20px" color={((colorMode === "light" ? "blue.800": "#9DECF9"))} />}
            variant="outline"
            borderWidth="2px"
            color={((colorMode === "light" ? "blue.800": "#9DECF9"))}
            borderColor={((colorMode === "light" ? "blue.800": "#9DECF9"))}
            fontWeight="bold"
          />
          <MenuList>
            <MenuItem>
              <ColorModeSwitcher show={true}/>
            </MenuItem>
            <MenuItem
              icon={<ArrowBackIcon fontSize="20px" color={((colorMode === "light" ? "blue.800": "#9DECF9"))} />}
              color={((colorMode === "light" ? "blue.800": "#9DECF9"))}
              fontSize="md"
              fontWeight="bold"
              onClick={async () => {
                await logout();
                auth.logout();
                router.push("/");
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default Navbar;
