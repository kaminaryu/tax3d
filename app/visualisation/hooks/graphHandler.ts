import { useState, useRef } from 'react';
import { Mesh, Matrix4, Vector3 as ThreeVector3, Vector3 } from 'three';
import { NodeProperty, LineProperty, Vec3 } from '../types/graphTypes';
import { hypotenuse3 } from '../customMath/math';

// the sphere creator, will put the properties inside the arr of spheres using useState ( propety handler )
export const graphHandler = () => {
    const [rootNodesProperties, setRootNode] = useState<NodeProperty[]>( [] );

    const [leafNodesProperties, setLeafNode] = useState<NodeProperty[]>( [] );

    const leafNodePosRefs = useRef<(Mesh | null)[]>([]);

    const [leafConnectorProperties, setLeafConnector] = useState<LineProperty[]>( [] )

    const leafConnectorPosRefs = useRef<(Mesh | null)[]>([]);

    const [lines, setLines] = useState<LineProperty[]>( [] );

    const [nodeID, increaseNodeID] = useState(0);


    const spawnGraph = (companyName: string, companyRevenue: number, companyExpenses: number) => {
        // basicaly create a binary node with depth of 2

        let currentID = nodeID;

        // this is the root node
        const newRootNode: NodeProperty = {
            id: currentID++,
            position: [
                Math.random() * 32 - 16,
                Math.random() * 32 - 16,
                Math.random() * 32 - 16
            ],
            geometry: [2, 32, 32],
            label: companyName,
            childNodes: [],
            offsetFromParent: []
        };

        increaseNodeID(currentID);

        // create two child notes
        for (let i: number = 0; i < 2; i++) {
            const isRight = i;
            const childOffset: [number, number, number] = [10 * (isRight ? 1 : -1), -5, 0];

            // add a node
            const newLeafNode: NodeProperty = {
                id: currentID++,
                position: [
                    newRootNode.position[0] + childOffset[0],
                    newRootNode.position[1] + childOffset[1],
                    newRootNode.position[2] + childOffset[2],
                ],
                geometry: [1.5, 32, 32],
                label: "RM" + ((i % 2) ? companyRevenue : companyExpenses),
                parentNode: newRootNode,
                childNodes: [],
                offsetFromParent: [...childOffset]
            }

            const midPoint: Vec3 = [
                newRootNode.position[0] + childOffset[0] / 2,
                newRootNode.position[1] + childOffset[1] / 2,
                newRootNode.position[2] + childOffset[2] / 2,
            ]


            // add a line
            const newConnector: LineProperty = {
                id: currentID++,
                position: midPoint,
                rotation: [0, 0, isRight ? 1.107 : -1.107],
                length: hypotenuse3(
                    childOffset[0],
                    childOffset[1],
                    childOffset[2],
                ),
                radius: 0.1,
                segments: [32, 32]
            }

            // add connector to child node
            newLeafNode.connector = newConnector;


            increaseNodeID(currentID);

            newRootNode.childNodes[i] = newLeafNode;
            setLeafNode(prev => [...prev, newLeafNode]);

            setLeafConnector(prev => [...prev, newConnector]);
        }


        setRootNode(prev => [...prev, newRootNode]);
    }


    const updateChildNodes = (matrix: Matrix4, rootNode: NodeProperty) => {
        // console.log(node.childNodes[0].position);
        // console.log(node.position);
        let rootOffset = new ThreeVector3;

        // the offset after the dragging event
        rootOffset.setFromMatrixPosition(matrix);
        
        // for connector rotation
        const childVec = new ThreeVector3();


        // this is so scuffed but its 4am idc anymore, ill make it better later
        // NOTE: node.position should be renamed to initPosition
        for (let child of rootNode.childNodes) {
            // update the position of the child nodes
            child.position[0] = rootOffset.x + rootNode.position[0] + child.offsetFromParent[0];
            child.position[1] = rootOffset.y + rootNode.position[1] + child.offsetFromParent[1];
            child.position[2] = rootOffset.z + rootNode.position[2] + child.offsetFromParent[2];

            // for updating the child pos without lag
            leafNodePosRefs.current[child.id]?.position.set(...child.position);

            // update the connector position
            let connector = child.connector;

            // so that the linter wont scream to me about null value
            if (!connector) continue;

            connector.position[0] = rootOffset.x + rootNode.position[0] + child.offsetFromParent[0]/2;
            connector.position[1] = rootOffset.y + rootNode.position[1] + child.offsetFromParent[1]/2;
            connector.position[2] = rootOffset.z + rootNode.position[2] + child.offsetFromParent[2]/2;

            // reset the offset we initialize when spawned them
            connector.rotation = [0, 0, 0];

            leafConnectorPosRefs.current[connector.id]?.position.set(...connector.position);

            // get the connector mesh
            const connectorMesh = leafConnectorPosRefs.current[connector.id];

            if (!connectorMesh) return;

            // Get the target (the child sphere)
            childVec.set(...child.position);

            // Point the connector at the child
            connectorMesh.lookAt(childVec);

            // Correction: Cylinders in Three.js are Y-aligned by default. 
            connectorMesh.rotateX(Math.PI / 2); 
        }
    }
    // Add this new function to your hook
    const updateConnector = (matrix: Matrix4, node: NodeProperty) => {
        const nodePos = new ThreeVector3();
        nodePos.setFromMatrixPosition(matrix);

        // 1. Update the node's internal data position
        node.position[0] = nodePos.x;
        node.position[1] = nodePos.y;
        node.position[2] = nodePos.z;

        // 2. Update the Connector attached to THIS node
        const connector = node.connector;
        const parent = node.parentNode;

        if (connector && parent) {
            // Midpoint calculation: (Parent + Current) / 2
            connector.position[0] = (parent.position[0] + node.position[0]) / 2;
            connector.position[1] = (parent.position[1] + node.position[1]) / 2;
            connector.position[2] = (parent.position[2] + node.position[2]) / 2;

            // Update Physical Ref for the Line
            const lineMesh = leafConnectorPosRefs.current[connector.id];
            if (lineMesh) {
                lineMesh.position.set(...connector.position);
                
                // Re-run the LookAt so the line angles correctly while dragging
                lineMesh.lookAt(nodePos);
                lineMesh.rotateX(Math.PI / 2);
            }
        }
    };
    // const updateChildConnector = (matrix: Matrix4, connector: LineProperty) =>  {
    //     var rootOffset = new ThreeVector3;
    //
    //     // the offset after the dragging event
    //     rootOffset.setFromMatrixPosition(matrix);
    //
    //     // update the position of the child connectors
    //     connector.position[0] = rootOffset.x + rootNode.position[0] + child.offsetFromParent[0];
    //     connector.position[1] = rootOffset.y + rootNode.position[1] + child.offsetFromParent[1];
    //     connector.position[2] = rootOffset.z + rootNode.position[2] + child.offsetFromParent[2];
    // }


    const drawLine = () => {
        const newLine: LineProperty = {
            id: 999,
            position: [0, 0, 0],
            rotation: [Math.PI / 4, 0, 0],
            length: 16,
            radius: 0.5,
            segments: [32, 32]
        };

        setLines(prev => [...prev, newLine]);
    }


    return {
        rootNodesProperties,
        leafNodesProperties,
        leafNodePosRefs,
        leafConnectorProperties,
        leafConnectorPosRefs,
        updateConnector,
        lines,
        spawnGraph,
        updateChildNodes,
        drawLine
    }
}
