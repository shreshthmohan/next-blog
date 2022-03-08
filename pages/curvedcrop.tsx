import { NextPage } from 'next'
import { roundedPolygonByCircumRadius } from 'curved-polygon'
import React, { useState } from 'react'

const svgSide = 400
const defaultImage = '/images/shreshth.jpg'
const sideCountLimits = { min: 3, max: 10 }

const CurvedCrop: NextPage = () => {
  const [sideCount, setSideCount] = useState(3)
  const [circumRadius, setCircumRadius] = useState(svgSide / 2)
  const [cxOffset, setCxOffset] = useState(0)
  const [cyOffset, setCyOffset] = useState(0)
  const [borderRadius, setBorderRadius] = useState(50)
  const [rotate, setRotate] = useState(0)

  const handleSidesChange = e => {
    setSideCount(e.target.value)
  }

  const shapeCenter = { cx: svgSide / 2 + cxOffset, cy: svgSide / 2 + cyOffset }

  const dForPath = roundedPolygonByCircumRadius({
    circumRadius,
    sideCount,
    borderRadius,
    ...shapeCenter,
  })

  const clipPathId = `polygon-sided-${sideCount}`

  return (
    <div className="flex font-sans">
      <main className="mx-auto my-32 flex flex-col ">
        <div className="flex w-[400px] flex-wrap gap-x-3 text-sm">
          <label>
            Sides
            <input
              onChange={handleSidesChange}
              type="range"
              step="1"
              value={sideCount}
              {...sideCountLimits}
            />
            {sideCount}
          </label>
          <label>
            Circumradius
            <input
              className="w-10"
              type="number"
              value={circumRadius}
              onChange={e => setCircumRadius(parseInt(e.target.value))}
            />
          </label>
          <label>
            x offset
            <input
              className="w-10"
              type="number"
              value={cxOffset}
              onChange={e => setCxOffset(parseInt(e.target.value))}
            />
          </label>
          <label>
            y offset
            <input
              className="w-10"
              type="number"
              value={cyOffset}
              onChange={e => setCyOffset(parseInt(e.target.value))}
            />
          </label>
          <label>
            border radius
            <input
              className="w-10"
              type="number"
              value={borderRadius}
              onChange={e => setBorderRadius(parseInt(e.target.value))}
            />
          </label>
          <label>
            rotate
            <input
              className="w-10"
              type="number"
              value={rotate}
              onChange={e => setRotate(parseInt(e.target.value))}
            />
          </label>
        </div>

        <svg
          width={svgSide}
          height={svgSide}
          viewBox={`0 0 ${svgSide} ${svgSide}`}
          className="border border-solid border-gray-300 bg-gray-100"
        >
          <image
            href={defaultImage}
            x="0"
            y="0"
            width={svgSide}
            height={svgSide}
            clipPath={`url(#${clipPathId})`}
          ></image>
          <clipPath id={clipPathId}>
            <path
              d={dForPath}
              transform={`rotate(${rotate})`}
              transform-origin={`${shapeCenter.cx} ${shapeCenter.cy}`}
            />
          </clipPath>
        </svg>
      </main>
    </div>
  )
}

export default CurvedCrop
