import { NextPage } from 'next'
import { roundedPolygonByCircumRadius } from 'curved-polygon'
import React, { useState, useRef, useEffect } from 'react'
import { Canvg } from 'canvg'

const svgSide = 400
const defaultImage = '/images/egg.jpg'
const sideCountLimits = { min: 3, max: 10 }

const CurvedCrop: NextPage = () => {
  const [sideCount, setSideCount] = useState(6)
  const [circumRadius, setCircumRadius] = useState(svgSide / 2)
  const [cxOffset, setCxOffset] = useState(0)
  const [cyOffset, setCyOffset] = useState(0)
  const [borderRadius, setBorderRadius] = useState(50)
  const [rotate, setRotate] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const imageEditorRef = useRef(null)
  const canvasRef = useRef(null)
  const imageLinkRef = useRef(null)

  const handleSidesChange = e => {
    setSideCount(parseInt(e.target.value))
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const imageEditor = imageEditorRef.current
    const ctx = canvas.getContext('2d')

    const v = Canvg.fromString(ctx, imageEditor.outerHTML)
    v.start()

    const link = imageLinkRef.current
    link.download = 'curvedcrop.png'
    link.href = canvas.toDataURL('image/png')

    return () => {
      v.stop()
    }
  })

  const handleDownloadImage = () => {
    if (imageLinkRef.current) {
      imageLinkRef.current.click()
    }
  }

  const shapeCenter = { cx: svgSide / 2 + cxOffset, cy: svgSide / 2 + cyOffset }

  const dForPath = roundedPolygonByCircumRadius({
    circumRadius,
    sideCount,
    borderRadius,
    ...shapeCenter,
  })

  const clipPathId = `polygon-sided-${sideCount}`

  const imgSrc = imageFile ? URL.createObjectURL(imageFile) : defaultImage

  return (
    <div className="flex font-sans">
      <main className="mx-auto my-32 flex flex-col ">
        <div className="mb-6 flex w-[400px] flex-wrap gap-x-3 text-sm">
          <input
            type="file"
            accept="image/*"
            onChange={function (e) {
              console.log(e.target.files)
              if (e.target.files.length) {
                setImageFile(e.target.files[0])
              }
            }}
          />

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
          id="cropped-image-editor"
          width={svgSide}
          height={svgSide}
          viewBox={`0 0 ${svgSide} ${svgSide}`}
          className="border border-solid border-gray-300 bg-gray-100"
          ref={imageEditorRef}
        >
          <image
            href={imgSrc}
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
        <button onClick={handleDownloadImage}>Download image</button>
        <canvas className="hidden" ref={canvasRef}></canvas>
        <a className="hidden" ref={imageLinkRef}></a>
      </main>
    </div>
  )
}

export default CurvedCrop
