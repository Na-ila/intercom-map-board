export const getPointsInViewport = (data, viewport) => {
  const coorWidth = viewport[2] - viewport[0]
  const percentOfWidth = (window.innerHeight * 0.3) / (window.innerWidth / 100)
  const partOfWidth = coorWidth / 100 * percentOfWidth * 2

    return data.filter(point => {
        return (
            viewport[0] < point.coordinates[0] &&
            viewport[1] < point.coordinates[1] &&
            (viewport[2] - partOfWidth) > point.coordinates[0] &&
            viewport[3] > point.coordinates[1]
        )
    })
}

export const isRegionsOverlap = (viewport, location) => {
  return !(viewport[3] < location[1] || viewport[1] > location[3] || viewport[2] < location[0] || viewport[0] > location[2])
}
