import Tile from './Tile'
import Renderer from './Renderer'

export default class Game {
    constructor (size) {
        this.size = size
        this.tiles = []
        this.pairs = []
        this.mixing = {
            value: null,
            lastValue: null
        }
        this.renderer = new Renderer(this.size)
        this.renderer.on('click', this.onClick.bind(this))
        this.renderer.on('mix', this.onMix.bind(this))
        this.createTiles()
        this.randomPlaceTiles()
        this.setMixing()
        this.render()
    }

    createTiles () {
        for (let v = Math.pow(this.size, 2) - 1; v > 0; v--) {
            let tile = new Tile(v)
            this.tiles.forEach(t => this.pairs.push({
                big: t,
                small: tile,
                active: false,
                lastActive: false
            }))
            this.tiles.push(tile)
        }

        // for presentation
        this.pairs.reverse()
        this.tiles.push(new Tile(null))
    }

    randomPlaceTiles () {
        const shuffle = (array) => {
            let ctr = array.length, temp, index
            while (ctr > 0) {
                index = Math.floor(Math.random() * ctr)
                ctr--
                temp = array[ctr]
                array[ctr] = array[index]
                array[index] = temp
            }
            return array
        }
        this.tiles = shuffle(this.tiles)
        this.updateTilePosition()
    }

    onMix () {
        this.randomPlaceTiles()
        this.pairs.forEach(pair => {
            pair.active = false
            pair.lastActive = false
        })
        this.mixing = {
            value: null,
            lastValue: null
        }
        this.setMixing()
        this.render()
    }

    updateTilePosition () {
        this.tiles.forEach((tile, index) => {
            tile.x = index % this.size
            tile.y = Math.floor(index / this.size)
        })
    }

    onClick ({x, y}) {
        let clickedTileIndex = y * this.size + x
        let emptyTileIndex = this.tiles.findIndex(tile => !tile.value)

        let distance = Math.abs(this.tiles[emptyTileIndex].x - x) + Math.abs(this.tiles[emptyTileIndex].y - y)

        // swap tiles and render
        if (distance === 1) {
            let tmp = this.tiles[clickedTileIndex]
            this.tiles[clickedTileIndex] = this.tiles[emptyTileIndex]
            this.tiles[emptyTileIndex] = tmp
            this.updateTilePosition()
            this.setMixing()
            this.render()
        }
    }

    /**
     ALGO :
     Pour chaque chiffre (a), en partant du haut gauche jusqu'en bas à droite (sens de la lecture)
     Pour chacun des chiffres suivants (b) (sens de la lecture)
     si a > b, on ajoute 1 à la valeur de mélange
     **/
    setMixing () {
        let mixingValue = this.mixing.value
        this.pairs.forEach(pair => {
            pair.lastActive = pair.active
            pair.active = this.tiles.indexOf(pair.big) < this.tiles.indexOf(pair.small)
        })
        this.mixing.value = this.pairs.filter(p => p.active).length

        this.mixing.lastValue = (this.mixing.lastValue === null) ? this.mixing.value : mixingValue
    }

    render () {
        this.renderer.updateMixingValue(this.mixing)
        this.renderer.renderTiles(this.tiles)
        this.renderer.renderPairs(this.pairs)
    }
}