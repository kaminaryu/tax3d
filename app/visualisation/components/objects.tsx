import {useState} from 'react';

import { NodeProperty, LineProperty } from "../types/graph";


export function Node({position = [0, 0, 0], geometry = [5, 32, 32]}: NodeProperty) {
    const [hovered, setHovered] = useState(false);

    return (
        <mesh
            // position={position}
            onPointerOver={() => {setHovered(true); document.body.style.cursor = 'pointer'}}
            onPointerLeave={() => {setHovered(false); document.body.style.cursor = 'auto'}}
        >
            <sphereGeometry args={geometry} />
            <meshStandardMaterial color={hovered ? "#aa00aa" : "#670067"} />
        </mesh>
    )
}

export function Line(property: LineProperty) {
    return (
        <mesh
            position = {property.position}
            rotation = {property.rotation}
        >
            <cylinderGeometry args={[property.radius, property.radius, property.length, 32]} />
            <meshStandardMaterial color="#670067" />
        </mesh>
    )
}
