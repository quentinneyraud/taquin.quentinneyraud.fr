const TILE_SIZE = 100

export default class Renderer {
    constructor (gameSize) {
        this.gameSize = gameSize
        this.listeners = []
        this.setElements()

        // canvas
        this.context = this.$elements.canvas.getContext('2d')
        this.setCanvasSize()

        // Context values
        this.context.font = '20px Arial'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'

        this.setEvents()
    }

    setCanvasSize () {
        this.$elements.canvas.width = this.gameSize * TILE_SIZE
        this.$elements.canvas.height = this.gameSize * TILE_SIZE
    }

    setElements () {
        this.$elements = {
            mixingValue: document.getElementById('mixing-value'),
            canvas: document.getElementById('renderer'),
            mixButton: document.getElementById('mix'),
            pairs: document.getElementById('pairs')
        }
    }

    setEvents () {
        this.$elements.canvas.addEventListener('click', e => {
            this.call('click', {
                x: Math.trunc(e.layerX / TILE_SIZE),
                y: Math.trunc(e.layerY / TILE_SIZE)
            })
        })
        this.$elements.mixButton.addEventListener('click', e => {
            this.call('mix')
        })
    }

    on (eventName, cb) {
        if (!this.listeners[eventName]) this.listeners[eventName] = []

        this.listeners[eventName].push(cb)
    }

    call (eventName, datas = null) {
        this.listeners[eventName].forEach(cb => cb(datas))
    }

    updateMixingValue (mixing) {
        let lastOperation = mixing.value - mixing.lastValue
        this.$elements.mixingValue.innerText = `${mixing.value} (${(lastOperation <= 0 ? "" : "+") + lastOperation})`
    }

    renderTiles (tiles) {
        this.context.clearRect(0, 0, this.gameSize * TILE_SIZE, this.gameSize * TILE_SIZE)
        this.context.rect(0, 0, this.gameSize * TILE_SIZE, this.gameSize * TILE_SIZE)

        tiles.forEach(tile => {

            if (tile.value) {
                this.context.rect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                this.context.fillText(tile.value, tile.x * TILE_SIZE + TILE_SIZE / 2, tile.y * TILE_SIZE + TILE_SIZE / 2)
            } else {
                this.context.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
            }

        })

        this.context.stroke()
    }

    renderPairs (pairs) {
        let startSmall = null
        let html = ''
        pairs.forEach(pair => {
            if (startSmall !== pair.small.value) {
                if (startSmall !== null) {
                    html += '</div>'
                }
                html += '<div class="pair-column">'
            }

            let span = ''
            if (!pair.lastActive && pair.active) {
                span = `<span class="green">↗</span>`
            } else if (pair.lastActive && !pair.active) {
                span = `<span class="red">↘</span>`
            } else if (pair.lastActive && pair.active) {
                span = `<span>→</span>`
            }
            html += `
                <p>${pair.small.value} - ${pair.big.value} ${span}</p>
            `

            startSmall = pair.small.value
            this.$elements.pairs.innerHTML += html
        })
        html += '</div>'
        this.$elements.pairs.innerHTML = html
    }
}