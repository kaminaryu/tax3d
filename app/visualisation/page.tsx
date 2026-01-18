"use client"; // <-- make the file client side so that anime.js and three.js can use the DOM

import { Canvas } from "@react-three/fiber"; // for 
import { OrbitControls, DragControls, Text, Billboard } from "@react-three/drei"; // for camera control
import { useState } from 'react'; // for manipulating what exist in the scene

import { Node, Line } from "./components/objects";
import { CompanyProperty } from "./types/graph";
import { graphHandler } from "./hooks/graphHandler";



export default function Visualisation() {
    const [isDragging, setDragging] = useState(false);

    const [companyProperties, setCompanyProperties] = useState<CompanyProperty>( {name: " ", revenue: 0, expenses: 0} );


    // importing hooks or wtver
    const {
        rootNodesProperties,
        leafNodesProperties,
        lines,
        leafNodePosRefs,
        spawnGraph,
        updateChildNodes,
        drawLine
    } = graphHandler();

    // main scene
    return (
        <div style={{ height: '100vh', width: '100%', backgroundColor: "#222" }}>

            {/* input forms */}
            <div style={{position: 'absolute', top: '5%', left: '5%', zIndex: 10}}>
                <label> Company Name: </label>
                <input type="text" onChange={(event) => setCompanyProperties( (prev) => ({...prev, name: event.target.value}) )}/>
                <br /> <br />

                <label> Yearly Revenue: </label>
                <input type="number" onChange={(event) => setCompanyProperties( (prev) => ({...prev, revenue: Number(event.target.value)}) )}/>
                <br /> <br />

                <label> Yearly Expenses: </label>
                <input type="number" onChange={(event) => setCompanyProperties( (prev) => ({...prev, expenses: Number(event.target.value)}) )}/>
                <br /> <br />

                <button onClick={() => spawnGraph(companyProperties.name, companyProperties.revenue, companyProperties.expenses)} style={{padding: '10px 20px'}}> Spawn Sphere </button>
                <button onClick={() => drawLine()} style={{padding: '10px 20px'}}> Spawn Line </button>
            </div>
 
            {/* the main canvas */}
            <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
                <ambientLight intensity={5} />
                <pointLight position={[0, 0, 0]} intensity={550} />

                {/* <Sphere geometry={[0.5, 8, 8]} /> */}
                {/* <Sphere position={[10, 0, 0]} /> */}

                {/* <mesh position={[0, 0, 0]}> */}
                {/*     <sphereGeometry args={[0.25, 16, 16]} /> */}
                {/*     <meshStandardMaterial color="#fff" /> */}
                {/* </mesh> */}
                {/**/}
                {/* <mesh position={[0, 5, 0]}> */}
                {/*     <cylinderGeometry args={[0.5, 0.5, 6, 32]} /> */}
                {/*     <meshStandardMaterial color="#543958" /> */}
                {/* </mesh> */}

                {/* <DragControls onDragStart={() => setDragging((true))} onDragEnd={() => setDragging((false))}> */}
                    {/* <mesh position={[0, 10, 0]}> */}
                    {/*     <sphereGeometry args={[2, 16, 16]} /> */}
                    {/*     <meshStandardMaterial color="#670043" /> */}
                    {/* </mesh> */}
                    {/**/}
                    {/* <Text fontSize={5}> Hello World </Text> */}
                {/* </DragControls> */}

                {/* the sphere properties will be mapped to the canvas (generator) */}
                { rootNodesProperties.map((nodeProperties, id) => (
                        <DragControls
                            key={id}
                            onDragStart={() => setDragging((true))}
                            onDragEnd={() => setDragging((false))}
                            onDrag={(matrix) => {
                                updateChildNodes(matrix, nodeProperties);
                            }}
                        >
                            <group position={nodeProperties.position}>
                                <Node {...nodeProperties} />
                                <Billboard>
                                    <Text position={[0, 3.5, 0]} fontSize={2} anchorX="center" anchorY="middle">
                                        {nodeProperties.label}
                                    </Text>
                                </Billboard>

                            </group>
                        </DragControls>
                    ))
                }

                { leafNodesProperties.map( (nodeProperties, id) => (
                    <DragControls
                        key={id}
                        onDragStart={() => setDragging((true))}
                        onDragEnd={() => setDragging((false))}
                        // onDrag={(matrix) => updateChildNodes(matrix, nodeProperties)}
                    >
                        <mesh position={nodeProperties.position} ref={(elem) => (leafNodePosRefs.current[nodeProperties.id] = elem)}>
                            <mesh onPointerEnter={() => setDragging(true)} onPointerLeave={() => setDragging(false)}>
                                <sphereGeometry args={nodeProperties.geometry} />
                                <meshStandardMaterial color="#543958" />
                            </mesh>
                            <Billboard>
                                <Text position={[0, 3.5, 0]} fontSize={2} anchorX="center" anchorY="middle">
                                    {nodeProperties.label}
                                </Text>
                            </Billboard>
                        </mesh>
                    </DragControls>
                    ))
                }

                { lines.map( (lineProp, i) => (
                        <DragControls key={i} onDragStart={() => setDragging((true))} onDragEnd={() => setDragging((false))}>
                                <Line {...lineProp} />
                        </DragControls>
                    )
                )}

                <OrbitControls enablePan={!false} enableRotate={!isDragging}/>
            </Canvas>
        </div>
    );
}


// NOTE: 
// useState is used for manipulating the scene
// syntax :
// const [state, updateState] = useState<type>(initialValue)
// state => the current state
// updateItem => function that will be used to update the state
