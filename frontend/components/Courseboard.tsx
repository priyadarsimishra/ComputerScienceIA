import React, { useState, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Node from "./Node";
import Edge from "./Edge";
import Sidebar from "./Sidebar";
import { ChevronRightIcon } from "@chakra-ui/icons";


export default function Graph({ type, course, data }) {
  // width and height of canvas
  const { colorMode } = useColorMode();
  const titleText = useColorModeValue("linear(to-t,#2C4187,#5E81FF)", "linear(to-t,#9DECF9,#ffffff)")
  const bgColor = useColorModeValue("#F7FAFC", "#2D3748") // gray.700 = #2D3748, gray.50 = #F7FAFC
  // const textColor  = useColorModeValue("2C4187", "#9DECF9")
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [graphData, _] = useState<Array<any>>(data);
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [layer, setLayer] = useState<number>(0);
  const [centerNode, setCenterNode] = useState<Node>();
  const [prevCenterNode, setPrevCenterNode] = useState<Node>();
  const [stylesheetJSON, setStyleSheetJSON] = useState<any>();
  const [displayNodes, setDisplayNodes] = useState([]);
  const [prevXPos, setPrevXPos] = useState();
  const [prevYPos, setPrevYPos] = useState();
  const [displayNodesObjectsForDraw, setDisplayNodesObjectsForDraw] = useState(
    []
  );
  const [stack, setStack] = useState([]);
  // used to draw in cytoscapejs
  // layer 1: Course with Units(1)
  // layer 2: Unit with Chapters(2)
  // layer 3: Chapter with Topics(3)
  // layer 4: Topic with Objectives(4)
  // layer 5: Objectives with EK(5)
  // layer 6: Essential Knowledge Section(6)

  /**
   * This useEffect() is called before the page loads (signfied by the [] at the end of the useEffect()).
   * This useEffect reads all the nodes and creates Node Objects from the {data} param. Then it
   * sets the center node, sets all the nodes created from the data to an array and finally sets the Layer which
   * calls the next useEffect() we have.
   */
  useEffect(() => {
    setWidth(Math.floor(window.innerWidth * 0.70));
    setHeight(Math.floor(window.innerHeight * 0.898));
    let arr = [];
    // console.log(graphData);
    graphData.forEach(({ id, positionID, type, name, parent, assignments, resources, status, description }) =>
      arr.push(
        new Node(
          type,
          name,
          [],
          parent,
          {
            id: positionID,
            dbID: id,
            label: name,
            assignments: assignments,
            description: description,
            resources: resources,
            status: status,
          },
          false,
          false,
          {
            x: width / 2,
            y: height / 2,
          }
        )
      )
    );
    arr.forEach((item) => {
      if (item.data.id == "1") {
        setCenterNode(item);
      }
    });
    setAllNodes(arr);
    setLayer(1);
  }, []);

  // LOGS
  // console.log("ALL_NODES:", allNodes);
  // console.log("DISPLAY_NODES:", displayNodes);
  // console.log("DISPLAY_NODES_JSON:", displayNodesObjectsForDraw);
  // console.log("CENTER_NODE:", centerNode);
  // console.log("CENTER_PARENTS: ", centerNode?.parent);
  // console.log("PREV_CENTER_NODE: ", prevCenterNode);
  // console.log("LAYER: ", layer);
  // console.log("WIDTH, HEIGHT: (", width, ", ", height, ")");
  // console.log("STYLESHEET_JSON: ", stylesheetJSON);
  // console.log("BREAD_CRUMBS_ARRAY: ", stack);
  // LOGS

  /**
   * This useEffect() is called everytime the variable layer changes(signfied by the [layer] at the end of the useEffect).
   * This method is responsible for "refreshing" the screen every time the layer changes. The layer
   * changes everytime the user clicks on a node that they want to see. There are
   * few steps to how this method refreshes the screen:
   * 1. First determine what nodes should be on display based on layer and push them to arr[]
   * 2. Then determine the position for each node based on the length of arr and using basic trigonometry
   * 3. Then set this arr to the displayNodes[] this array's contents is displayed to the user
   * 4. Then create the JSON structure for CytoscapeJS to display the Nodes and Edges
   * 5. Then create the StyleSheet which will give some styles to the Nodes and Edges
   */
  useEffect(() => {
    let arr = [];
    setDisplayNodes([]);

    switch (layer) {
      // units
      case 1:
        allNodes.forEach((node) => {
          if (node.type === "Unit" && arr.length <= 10) {
            arr.push(node);
          }
        });
        break;
      // chapters
      case 2:
        allNodes.forEach((node) => {
          if (node.type === "Enduring Understanding" && arr.length <= 10) {
            if (compareParent(node)) arr.push(node);
          }
        });
        break;
      // topics
      case 3:
        allNodes.forEach((node) => {
          if (node.type === "Topic" && arr.length <= 10) {
            if (compareParent(node)) arr.push(node);
          }
        });
        break;
      // objectives
      case 4:
        allNodes.forEach((node) => {
          if (node.type === "Objective" && arr.length <= 10) {
            if (compareParent(node)) arr.push(node);
          }
        });
        break;
      // essential knowledge
      case 5:
        allNodes.forEach((node) => {
          if (node.type === "Essential Knowledge" && arr.length <= 10) {
            if (compareParent(node)) arr.push(node);
          }
        });
        break;
      case 6:
        // our essential knowledge node is the center node
        break;
      default:
        break;
    }

    // set position based on angle
    let angleDifference = 360 / arr?.length;
    let currAngle = 0;
    let centerX = width / 2;
    let centerY = height / 2;
    let edgeLength = width * 0.2;
    let xPos = 0;
    let yPos = 0;

    arr.forEach((node) => {
      xPos = edgeLength * Math.cos((currAngle * Math.PI) / 180);
      yPos = edgeLength * Math.sin((currAngle * Math.PI) / 180);
      node.position = { x: centerX + xPos, y: centerY + yPos };
      currAngle += angleDifference;
    });

    setDisplayNodes(arr);

    // Code to creates the JSON for the display of nodes with CytoscapeJS
    let arrJson = [];
    // adds center node depending on centerName field to the JSON structure
    allNodes.forEach((node) => {
      if (
        node.name === centerNode?.name &&
        node.data.id === centerNode?.data.id
      ) {
        node.position = { x: width / 2, y: height / 2 };
        node.grabbable = false;
        arrJson.push({
          grabbable: node.grabbable,
          locked: node.locked,
          data: node.data,
          position: node.position,
        });
        if (stack.indexOf(centerNode) == -1) {
          stack.push(centerNode);
        }
      }
    });

    // prev center node so it can be rendered on the screen
    allNodes.forEach((node) => {
      if (
        node.name === prevCenterNode?.name &&
        node.data.id === prevCenterNode?.data.id
      ) {
        node.position = { x: 150, y: 200 };
        node.grabbable = false;
        arrJson.push({
          grabbable: node.grabbable,
          locked: node.locked,
          data: node.data,
          position: node.position,
        });
      }
    });

    // this creates the JSON for the the child nodes so it can be rendered with CytoscapeJS
    arr.forEach((node) => {
      node.grabbable = true;
      arrJson.push({
        grabbable: node.grabbable,
        locked: node.locked,
        data: node.data,
        position: node.position,
      });
    });

    // generates the edges in JSON
    let edge = null;
    let edgesArr = []; // needed for styling the edges
    arr.forEach((node) => {
      edge = new Edge(
        "edge",
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        centerNode.data.id,
        node.data.id
      );
      edgesArr.push(edge);
      arrJson.push({
        grabbable: false,
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
        },
      });
    });

    setDisplayNodesObjectsForDraw(arrJson);
    createStyleSheet(arr, edgesArr);
  }, [layer, colorMode]);

  /**
   * This method is used to compare the parent(s) of the center node to the
   * parent(s) of the node param. We need this method to make sure we are adding
   * the correct node of a specific chapter, unit, etc.
   *
   * @param {Node} node
   */
  const compareParent = (node) => {
    if (node.parent[node.parent?.length - 1] === centerNode.data.id) {
      for (let i = 0; i < node.parent?.length - 1; i++) {
        if (node.parent[i] !== centerNode.parent[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  /**
   * The method creates the stylesheet necessary to display the graph on screen.
   * It creates a JSON structure to order the styles for specific nodes and edges
   *
   * @param {Node[]} nodes
   * @param {Edge[]} edges
   */
  const createStyleSheet = (nodes, edges) => {
    let stylesJSON = [];
    stylesJSON.push({
      selector: `#${prevCenterNode?.data?.id}`,
      style: {
        width: `${width * 0.15}`,
        height: `${width * 0.15}`,
        shape: "ellipse",
        borderWidth: "2.5px",
        color: (colorMode === 'light' ? "#2C4187": "#9DECF9"),
        backgroundColor: (colorMode === 'light' ? "#ffffff": "#171923"),
        borderColor: (colorMode === 'light' ? "#5E8AFF": "#9DECF9"),
        label: `${prevCenterNode?.name}`,
        "text-wrap": "wrap",
        "text-valign": "center",
        "text-halign": "center",
        "text-max-width": "150px",
        "font-weight": "bold",
        "font-size": "24px",
      },
    });
    stylesJSON.push({
      selector: `#${centerNode?.data.id}`,
      style: {
        width: `${width * 0.15}`,
        height: `${width * 0.15}`,
        shape: "ellipse",
        borderWidth: "2.5px",
        color: (colorMode === 'light' ? "#2C4187": "#9DECF9"),
        backgroundColor: (colorMode === 'light' ? "#ffffff": "#171923"),
        borderColor: (colorMode === 'light' ? "#5E8AFF": "#9DECF9"),
        label: `${centerNode?.name}`,
        "text-wrap": "wrap",
        "text-valign": "center",
        "text-halign": "center",
        "text-max-width": "150px",
        "font-weight": "bold",
        "font-size": "24px",
      },
    });
    nodes.forEach((node) => {
      stylesJSON.push({
        selector: `#${node.data.id}`,
        style: {
          width: `${width * 0.12}`,
          height: `${width * 0.12}`,
          shape: "ellipse",
          color: (colorMode === 'light' ? "#2C4187": "#9DECF9"),
          backgroundColor: (colorMode === 'light' ? "#ffffff": "#171923"),
          borderColor: (colorMode === 'light' ? "#5E8AFF": "#9DECF9"),
          borderWidth: "2.5px",
          label: `${node.name}`,
          "text-wrap": "wrap",
          "text-valign": "center",
          "text-halign": "center",
          "text-max-width": "150px",
          "font-weight": "bold",
          "font-size": "20px",
        },
      });
    });
    edges.forEach((edge) => {
      stylesJSON.push({
        selector: `#${edge.id}`,
        style: {
          width: 1,
          color: "#2C4187",
        },
      });
    });
    setStyleSheetJSON(stylesJSON);
  };

  /**
   * This is responsible for rendering the graph and it contains our event listeners
   */
  return (
    <Flex justifyContent="center">
      <Sidebar type={type} course={course} currentNode={centerNode} />
      <Flex flexDirection="column">
        <Breadcrumb
          spacing="5px"
          paddingLeft={"15px"}
          paddingTop={"8px"}
          bgColor={bgColor}
          separator={<ChevronRightIcon color="blue.500" />}
        >
          {stack.map((item, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href="#">
                <Text
                  fontWeight={"bolder"}
                  bgClip="text"
                  bgGradient={titleText}
                  fontSize="15px"
                  onClick={() => {
                    if (item.type === "Course") setLayer(1);
                    else if (item.type === "Unit") setLayer(2);
                    else if (item.type === "Enduring Understanding")
                      setLayer(3);
                    else if (item.type === "Topic") setLayer(4);
                    else if (item.type === "Objective") setLayer(5);
                    // else if(item.type === "Essential Knowledge")
                    //   setLayer(5);

                    setCenterNode(item);
                    let prevNodeId = item.data.id.substring(
                      0,
                      item.data.id.length - 1
                    );
                    let prevNode;
                    allNodes.forEach((node) => {
                      if (node.data.id === prevNodeId) {
                        prevNode = node;
                      }
                    });
                    setPrevCenterNode(prevNode);
                    stack.splice(stack.indexOf(item) + 1);
                  }}
                >
                  {item?.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
        <CytoscapeComponent
          cy={(cy) => {
            /*** event listeners ***/
            // remove listener
            cy.removeListener("tap");
            // add listener this allows one tap at time
            cy.on("tap", "node", function (evt) {
              // we will only run this if it is not the center that is clicked
              let ID = this.id();
              if (ID === prevCenterNode?.data?.id) {
                // setting the center node as the current previous center node
                setCenterNode(prevCenterNode);

                // query node from allNodes[] for the prev center node based on ID
                allNodes.forEach((node) => {
                  if (
                    node.data.id ===
                    prevCenterNode?.parent[prevCenterNode?.parent.length - 1]
                  ) {
                    setPrevCenterNode(node);
                  }
                });

                // coming back to layer 1
                if (layer === 2) setPrevCenterNode(undefined);

                // decreasing layer by 1 basically going back 1
                stack.pop();
                setLayer(layer - 1);
              } else if (ID !== centerNode?.data.id) {
                // increase layer by 1 which automatically rerenders the nodes
                setPrevCenterNode(centerNode);

                // based on ID it finds the center node
                allNodes.forEach((node) => {
                  if (node.data.id === ID) {
                    setCenterNode(node);
                  }
                });

                // if the layer is 6 we should not go further
                if (layer !== 6) {
                  setLayer(layer + 1);
                }
              }
            });

            // listeners for drag animations
            cy.removeListener("grab");
            cy.on("grab", "node", function (evt) {
              let ID = this.id();
              let currNode = null;

              allNodes.forEach((node) => {
                if (node.data.id === ID) {
                  currNode = node;
                }
              });

              setPrevXPos(currNode.position.x);
              setPrevYPos(currNode.position.y);
            });

            cy.removeListener("dragfreeon");
            cy.on("dragfreeon", "node", function (evt) {
              // let currX = this.position().x;
              // let currY = this.position().y;
              let ID = this.id();
              let currNode = null;

              allNodes.forEach((node) => {
                if (node.data.id === ID) {
                  currNode = node;
                }
              });

              currNode.position.x = prevXPos;
              currNode.position.y = prevYPos;

              displayNodesObjectsForDraw.forEach((obj) => {
                if (obj.data.id === ID) {
                  obj.position.x = prevXPos;
                  obj.position.y = prevYPos;
                }
              });
              // small glitch where when the node is dragged once and that same node later on in new layer does not drag
              // ISSUE: the position of the node is not reset to previous position values
            });

            //
          }}
          elements={displayNodesObjectsForDraw}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            // border: "2px solid #000000",
            backgroundColor: bgColor,
          }}
          stylesheet={stylesheetJSON}
          userZoomingEnabled={false}
          userPanningEnabled={false}
        />
      </Flex>
    </Flex>
  );
}
