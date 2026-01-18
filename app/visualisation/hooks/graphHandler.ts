import { useState, useRef } from 'react';
import { Mesh, Matrix4, Vector3 as ThreeVector3 } from 'three';
import { NodeProperty, LineProperty } from '../types/graph';

// the sphere creator, will put the properties inside the arr of spheres using useState ( propety handler )
export const graphHandler = () => {
    const [rootNodesProperties, setRootNode] = useState<NodeProperty[]>( [] );

    const [leafNodesProperties, setLeafNode] = useState<NodeProperty[]>( [] );

    const [lines, setLines] = useState<LineProperty[]>( [] );

    const leafNodePosRefs = useRef<(Mesh | null)[]>([]);

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

        increaseNodeID(id => id + 1);

        // create two child notes
        for (let i: number = 0; i < 2; i++) {
            const childOffset: [number, number, number] = [10 * (i ? 1 : -1), -5, 0];

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

            increaseNodeID(currentID);

            newRootNode.childNodes[i] = newLeafNode;

            setLeafNode(prev => [...prev, newLeafNode]);
        }


        setRootNode(prev => [...prev, newRootNode]);
    }


    const updateChildNodes = (matrix: Matrix4, rootNode: NodeProperty) => {
        // console.log(node.childNodes[0].position);
        // console.log(node.position);
        var rootOffset = new ThreeVector3;
        rootOffset.setFromMatrixPosition(matrix);


        // this is so scuffed but its 4am idc anymore, ill make it better later
        // NOTE: node.position should be renamed to initPosition
        for (let child of rootNode.childNodes) {
            child.position[0] = rootOffset.x + rootNode.position[0] + child.offsetFromParent[0];
            child.position[1] = rootOffset.y + rootNode.position[1] + child.offsetFromParent[1];
            child.position[2] = rootOffset.z + rootNode.position[2] + child.offsetFromParent[2];

            leafNodePosRefs.current[child.id]?.position.set(...child.position);
        }
    }


    const drawLine = () => {
        const newLine: LineProperty = {
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
        lines,
        leafNodePosRefs,
        spawnGraph,
        updateChildNodes,
        drawLine
    }
}
