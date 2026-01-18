import { DragControls, Text, Billboard } from "@react-three/drei";
import { Node, Line } from "./objects";
import { LineProperty, NodeProperty, Vec3 } from "../types/graphTypes";
import { Mesh } from "three";

interface GraphNodeProps {
    node: NodeProperty;
    onDrag?: (matrix: any) => void;
    setDragging: (val: boolean) => void;
    isLeaf?: boolean;
    nodeRef?: (el: Mesh | null) => void;
}

interface ConnectorLineProps {
    line: LineProperty,
    lineRef?: (el: Mesh | null) => void;
}


export function GraphNode({ node, onDrag, setDragging, isLeaf, nodeRef }: GraphNodeProps) { 
    return (
        <DragControls
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
            onDrag={onDrag}
        >
            <group position={node.position} ref={nodeRef}>
                <Node {...node} />
                <Billboard>
                    <Text position={[0, 3.5, 0]} fontSize={2}>
                        {node.label}
                    </Text>
                </Billboard>
            </group>
        </DragControls>
    );
}

export function Connector({line, lineRef}: ConnectorLineProps) {
    return (
        <group position={line.position} ref={lineRef}>
           <Line {...line} />
        </group>
    )
}
