import {
    useColorMode,
    useColorModeValue,
    IconButton,
    IconButtonProps,
    Flex,
    Text
  } from "@chakra-ui/react"
  import { FaMoon, FaSun } from "react-icons/fa"
  
  type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">
  
  export const ColorModeSwitcher = ({show}) => {
    const { colorMode, toggleColorMode } = useColorMode()
    const text = useColorModeValue("white", "blue.800")
    const SwitchIcon = useColorModeValue(FaMoon, FaSun)
    const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")

    return (
      <Flex alignItems="center" justifyContent="center" onClick={toggleColorMode}>
        <IconButton
          size="md"
          // bgClip="text" 
          bgGradient={titleText}
          fontSize="lg"
          variant="ghost"
          marginLeft="2"
          color={text}
          border={(!show ? "1px solid #2C5282": null)}
          icon={<SwitchIcon color={text} />}
          aria-label={`Switch to ${text} mode`}
          _hover={{bgColor: (colorMode === "light" ? "#5E81FF": "#9DECF9")}}
        />
        {show ? 
          <Text fontWeight="bold" fontSize="md" color={((colorMode === "light" ? "blue.800": "#9DECF9"))} ml="2">
            {colorMode === "light" ? "Dark Mode": "Light Mode"} 
          </Text>
        : null}

      </Flex>
      
    )
  }