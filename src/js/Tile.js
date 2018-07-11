export default class Tile {
    constructor (value) {
        this.value = value
        this.x = null
        this.y = null
    }

    isEmpty () {
        return this.value === null
    }
}