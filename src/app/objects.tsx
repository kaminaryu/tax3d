import {useState} from 'react';

export type NodeProperty = {
    id: number,
    // x, y, z
    position: [number, number, number],
    // radius, segmentsWidth segmentsHeight
    geometry: [number, number, number],
    label: string,
    parentNode?: NodeProperty,
    childNodes: NodeProperty[],
    offsetFromParent: number[]
}

export type LineProperty = {
    position?: [number, number, number],
    rotation?: [number, number, number],
    length?: number,
    radius?: number,
    segments?: [number, number]
}


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
