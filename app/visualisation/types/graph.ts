export type Vec3 = [number, number, number]

// For the nodes
export interface NodeProperty {
    id: number,
    // x, y, z
    position: Vec3,
    // radius, segmentsWidth segmentsHeight
    geometry: Vec3,
    label: string,
    parentNode?: NodeProperty,
    childNodes: NodeProperty[],
    offsetFromParent: number[]
}

// For line connecting two nodes
export interface LineProperty {
    position?: Vec3,
    rotation?: Vec3,
    length?: number,
    radius?: number,
    segments?: [number, number]
}

// for company infos like name, revenues, Expenses etc
export interface CompanyProperty {
    name: string,
    revenue: number,
    expenses: number
}
