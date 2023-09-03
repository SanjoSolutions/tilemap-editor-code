import { areDifferent } from "./areDifferent.js"
import type { CellArea } from "./CellArea.js"
import type { CellPosition } from "./CellPosition.js"
import type { Tile } from "./Tile.js"

export class TileLayer {
  tiles: Record<string, Record<string, Tile>> = {}

  setTile({ row, column }: CellPosition, tile: Tile): boolean {
    const previousTile = this.retrieveTile({ row, column })
    if (!previousTile || areDifferent(previousTile, tile)) {
      const rowString = String(row)
      let tileLayerRow: Record<string, Tile>
      if (this.tiles[rowString]) {
        tileLayerRow = this.tiles[rowString]
      } else {
        tileLayerRow = {}
        this.tiles[rowString] = tileLayerRow
      }
      tileLayerRow[String(column)] = tile
      return true
    } else {
      return false
    }
  }

  removeTile({ row, column }: CellPosition): void {
    const rowString = String(row)
    if (this.tiles[rowString]) {
      const tileLayerRow = this.tiles[rowString]
      delete tileLayerRow[String(column)]
    }
  }

  retrieveTile({ row, column }: CellPosition): Tile | null {
    const rowString = String(row)
    if (this.tiles[rowString]) {
      const tileLayerRow = this.tiles[rowString]
      return tileLayerRow[String(column)] ?? null
    } else {
      return null
    }
  }

  retrieveArea(area: CellArea): TileLayer {
    const size = {
      width: area.to.column - area.from.column + 1n,
      height: area.to.row - area.from.row + 1n,
    }
    const areaTileLayer = new TileLayer()
    for (let row = 0n; row < size.height; row++) {
      for (let column = 0n; column < size.width; column++) {
        const tile = this.retrieveTile({
          row: area.from.row + row,
          column: area.from.column + column,
        })
        if (tile) {
          areaTileLayer.setTile({ row, column }, tile)
        }
      }
    }
    return areaTileLayer
  }

  copy(): TileLayer {
    const copy = new TileLayer()
    copy.tiles = {}
    for (const row of Object.keys(this.tiles)) {
      let tileLayerRow = this.tiles[row]
      copy.tiles[row] = { ...tileLayerRow }
    }
    return copy
  }
}
