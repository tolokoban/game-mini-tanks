type Direction = {
    vx: number
    vy: number
}

type Segment = {
    x: number
    y: number
    dir: number
    length: number
}

const SPEED = 1

class Orchestrator {
    static readonly GRID_SIZE = 2048

    static readonly DIRECTIONS = [
        { vx: 0, vy: 1 },
        { vx: 1, vy: 0 },
        { vx: 0, vy: -1 },
        { vx: -1, vy: 0 },
    ] satisfies Readonly<Direction[]>

    private readonly segments = new Map<number, Segment[]>()

    private readonly speeds = new Map<number, number>()

    // Vertical segments.
    private readonly gridX = createArrayOfSets()

    // Horizontal segments
    private readonly gridY = createArrayOfSets()

    start(id: number, x: number, y: number, dir: number) {
        this.kill(id)
        this.segments.set(id, [
            {
                x,
                y,
                dir,
                length: 0,
            },
        ])
        this.speeds.set(id, SPEED)
    }

    kill(id: number) {
        this.segments.delete(id)
        this.speeds.delete(id)
    }

    /**
     * @param deltaTime Seconds.
     */
    move(deltaTime: number): boolean {
        for (const id of this.segments.keys()) {
            const segment = (this.segments.get(id) ?? []).at(-1) ?? null
            if (!segment) continue

            let speed = this.speeds.get(id) ?? SPEED
            const length = speed * deltaTime
            segment.length += length
        }
        return true
    }

    turnRight(id: number) {
        const segment = this.getLast(id)
        if (!segment) return false

        this.addSegment(id, {
            ...segment,
            dir: (segment.dir + 1) % Orchestrator.DIRECTIONS.length,
            length: 0,
        })
        return true
    }

    turnLeft(id: number) {
        const segment = this.getLast(id)
        if (!segment) return false

        this.addSegment(id, {
            ...segment,
            dir: (segment.dir + 3) % Orchestrator.DIRECTIONS.length,
            length: 0,
        })
        return true
    }

    getSegments(): Readonly<Map<number, Segment[]>> {
        return this.segments
    }

    private addSegment(id: number, segment: Segment) {
        if (this.segments.has(id)) {
            this.segments.get(id)?.push(segment)
        } else {
            this.segments.set(id, [segment])
        }
        const { dir } = segment
        if (dir === 0 || dir === 2) {
            // Vertical segment
            const x = getGridIndex(segment.x)
            this.gridX[x].add(segment)
        } else {
            // Horizontal segment
            const y = getGridIndex(segment.y)
            this.gridY[y].add(segment)
        }
    }

    private getLast(id: number): Segment | null {
        return (this.segments.get(id) ?? []).at(-1) ?? null
    }
}

function createArrayOfSets() {
    const arr: Set<Segment>[] = []
    for (let i = 0; i <= Orchestrator.GRID_SIZE; i++) {
        arr.push(new Set<Segment>())
    }
    return arr
}

function getGridIndex(xOrY: number): number {
    const index = Math.floor(xOrY)
    if (index < 0) return 0
    if (index > Orchestrator.GRID_SIZE) return Orchestrator.GRID_SIZE
    return index
}
