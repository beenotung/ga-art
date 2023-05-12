import { fragment, h1, div } from 'dom-proxy'

let { random, floor, abs } = Math

let w = 800
let h = 800

let geneBoxSize = 30
let trackBoxSize = 3

let n = 2
let batch = 10

let crossover_rate = 0
let mutate_step = 10

let r = 0
let d = 0

class Gene {
  _x = random() * (w - geneBoxSize) + geneBoxSize / 2
  _y = random() * (h - geneBoxSize) + geneBoxSize / 2

  div = div(
    {
      style: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: geneBoxSize + 'px',
        height: geneBoxSize + 'px',
        border: '1px solid black',
        transform: `translate(-50%,-50%)`,
        left: this._x + 'px',
        top: this._y + 'px',
        backgroundColor: 'rgba(255,255,255,0.5)',
      },
    },
    [this.id],
  )

  get x() {
    return this._x
  }
  get y() {
    return this._y
  }

  set x(value: number) {
    if (value > w - geneBoxSize / 2) {
      value = w - geneBoxSize / 2
    } else if (value < geneBoxSize / 2) {
      value = geneBoxSize / 2
    }
    this._x = value
    this.div.style.left = value.toFixed(0) + 'px'
  }
  set y(value: number) {
    if (value > h - geneBoxSize / 2) {
      value = h - geneBoxSize / 2
    } else if (value < geneBoxSize / 2) {
      value = geneBoxSize / 2
    }
    this._y = value
    this.div.style.top = value.toFixed(0) + 'px'
  }

  addTrack() {
    board.appendChild(
      div({
        style: {
          width: trackBoxSize + 'px',
          height: trackBoxSize + 'px',
          backgroundColor: 'red',
          position: 'absolute',
          left: this.x + 'px',
          top: this.y + 'px',
          transform: `translate(-50%,-50%)`,
          zIndex: '-1',
        },
      }).node,
    )
  }

  constructor(public id: number) {}
}

let genes: Gene[] = []

for (let i = 0; i < n; i++) {
  genes.push(new Gene(i))
}

let board = div(
  {
    style: {
      border: '1px solid black',
      width: w + 'px',
      height: h + 'px',
      position: 'relative',
    },
  },
  genes.map(gene => gene.div),
)

document.body.appendChild(
  fragment([h1({ textContent: 'GA Experiment' }), board]),
)

function crossover(a: Gene, b: Gene) {
  r = random() * crossover_rate
  d = b.x - a.x
  a.x += d * r

  r = random() * crossover_rate
  d = b.y - a.y
  a.y += d * r

  b.addTrack()
}

function mutation(a: Gene, b: Gene) {
  if ('dev') {
    r = (random() * 2 - 1) * mutate_step
    b.x += r

    r = (random() * 2 - 1) * mutate_step
    b.y += r

    return
  }

  r = random() * mutate_step
  d = b.x - a.x
  b.x += d * r

  r = random() * mutate_step
  d = b.y - a.y
  b.y += d * r

  b.addTrack()
}

function evolve() {
  for (let _b = 0; _b < batch; _b++) {
    let a = floor(random() * n)
    let b = floor(random() * n)
    while (b == a) {
      b = floor(random() * n)
    }
    if (random() < 0.5) {
      crossover(genes[a], genes[b])
    } else {
      mutation(genes[a], genes[b])
    }
  }

  // setTimeout(evolve, 10)
  requestAnimationFrame(evolve)
}

evolve()
