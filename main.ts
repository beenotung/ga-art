const { random, floor, round } = Math

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')!

const scale = 10

const GeneX = 10
const GeneY = 10

const GeneWidth = 5
const GeneHeight = 5

const CanvasWidth = GeneX * GeneWidth
const CanvasHeight = GeneY * GeneHeight

canvas.width = CanvasWidth
canvas.height = CanvasHeight

canvas.style.width = CanvasWidth * scale + 'px'
canvas.style.height = CanvasHeight * scale + 'px'
canvas.style.imageRendering = 'pixelated'
canvas.style.border = '1px solid black'

context.fillStyle = 'black'
context.fillRect(0, 0, CanvasWidth, CanvasHeight)

let imageData = context.getImageData(0, 0, CanvasWidth, CanvasHeight)
let data = imageData.data

function toOffset(geneX: number, geneY: number) {
  const x = geneX * GeneWidth
  const y = geneY * GeneHeight
  return 4 * (y * CanvasWidth + x)
}

function randomGeneColors(): number[] {
  let colors = new Array<number>(GeneWidth * GeneHeight * 3)
  let i = 0
  for (let y = 0; y < GeneHeight; y++) {
    for (let x = 0; x < GeneWidth; x++) {
      colors[i++] = randomColorCode()
      colors[i++] = randomColorCode()
      colors[i++] = randomColorCode()
    }
  }
  return colors
}

class Gene {
  colors = randomGeneColors()
  offset = toOffset(this.geneX, this.geneY)
  constructor(public id: number, public geneX: number, public geneY: number) {}
  draw() {
    let { offset, colors } = this
    let dest = offset
    let src = 0
    for (let y = 0; y < GeneHeight; y++) {
      for (let x = 0; x < GeneWidth; x++) {
        data[dest++] = colors[src++]
        data[dest++] = colors[src++]
        data[dest++] = colors[src++]
        dest++
      }
      offset += CanvasWidth * 4
      dest = offset
    }
  }
  evolve() {
    let { offset, colors } = this
    for (let y = 0; y < GeneHeight; y++) {
      for (let x = 0; x < GeneWidth; x++) {}
    }

    let n = colors.length
    for (let i = 0; i < n; i++) {
      let code = colors[i] + (random() * 2 - 1) * 10
      code = round(code)
      if (code < 0) code = 0
      else if (code >= 255) code = 255
      colors[i] = code
    }
  }
  loop() {
    this.evolve()
    this.draw()
    setTimeout(() => this.loop())
  }
}

function crossover(srcGene: Gene, destGene: Gene) {
  let srcColors = srcGene.colors
  let destColors = destGene.colors
  let n = srcColors.length
  let r = 0
  for (let i = 0; i < n; i++) {
    r = random()
    destColors[i] = destColors[i] * r + srcColors[i] * (1 - r)
  }
}
function mutate(srcGene: Gene, destGene: Gene) {
  let srcColors = srcGene.colors
  let destColors = destGene.colors
  let n = srcColors.length
  let r = 0
  for (let i = 0; i < n; i++) {
    r = random()
    destColors[i] = destColors[i] * r + srcColors[i] * (1 - r)
  }
}

function randomColorCode() {
  return floor(random() * 256)
}

function toHex(x: number) {
  let str = x.toString(16)
  if (str.length == 1) {
    str = '0' + str
  }
  return str
}

function flush() {
  context.putImageData(imageData, 0, 0)
  requestAnimationFrame(flush)
}

let populationSize = GeneX * GeneY
let population: Gene[] = []

{
  let i = 0
  for (let geneY = 0; geneY < GeneY; geneY++) {
    for (let geneX = 0; geneX < GeneX; geneX++) {
      let gene = new Gene(i, geneX, geneY)
      setTimeout(() => gene.loop())
      population[i] = gene
      i++
    }
  }
}

document.body.appendChild(canvas)

flush()
