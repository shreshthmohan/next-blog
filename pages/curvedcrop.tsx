import { NextPage } from 'next'
import { roundedPolygonByCircumRadius } from 'curved-polygon'
import React, { useState, useRef, useEffect } from 'react'
import { Canvg } from 'canvg'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom } from 'd3-zoom'

const svgSide = 400
const defaultImage = '/images/egg.jpg'
const sideCountLimits = { min: 3, max: 10 }
const circumRadiusLimits = { min: 0, max: 500 }
const rotateLimits = { min: 0, max: 360 }
const borderRadiusLimits = { min: 0, max: 500 }

const CurvedCrop: NextPage = () => {
  const [sideCount, setSideCount] = useState(6)
  const [circumRadius, setCircumRadius] = useState(svgSide / 2)
  const [cxOffset, setCxOffset] = useState(0)
  const [cyOffset, setCyOffset] = useState(0)
  const [borderRadius, setBorderRadius] = useState(50)
  const [rotate, setRotate] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [imagePos, setImagePos] = useState([0, 0])
  const [maskOff, setMaskOff] = useState(false)
  const [download, setDownload] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const [imageX, imageY] = imagePos

  const imageEditorRef = useRef(null)
  const canvasRef = useRef(null)
  const imageLinkRef = useRef(null)
  const imageShapeRef = useRef(null)
  // const outputImageRef = useRef(null)

  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const imageEditor = imageEditorRef.current
    const ctx = canvas.getContext('2d')

    const v = Canvg.fromString(ctx, imageEditor.outerHTML)
    v.render().then(() => {
      if (mountedRef.current) {
        const link = imageLinkRef.current
        link.download = 'curvedcrop.png'
        link.href = canvas.toDataURL('image/png')

        if (download && maskOff) {
          imageLinkRef.current.click()
          setDownload(false)
          setMaskOff(false)
        }

        // const outputImage = outputImageRef.current
        // canvas.toBlob(function (blob) {
        //   const url = URL.createObjectURL(blob)
        //   outputImage.src = url
        // })
      }
    })

    return () => {
      v.stop()
    }
  })

  useEffect(() => {
    const image = imageShapeRef.current

    select(image).call(
      drag()
        .on('start', function (e) {
          select(this).attr('fill', 'gray').classed('brightness-110', true)
        })
        .on('drag', function (e) {
          setImagePos(([x, y]) => [x + e.dx, y + e.dy])
        })
        .on('end', function (e) {
          select(this).attr('fill', 'black').classed('brightness-110', false)
        }),
    )

    select(image).call(
      zoom()
        .scaleExtent([0.01, 50])
        .on('zoom', ({ transform }) => {
          const { x, y, k } = transform
          setZoomLevel(k)
          setImagePos([x, y])
        }),
    )
  }, []) // no need to attach drag listeners everytime something changes

  const handleSidesChange = e => {
    setSideCount(parseInt(e.target.value))
  }

  const handleDownloadImage = () => {
    setMaskOff(true)
    setDownload(true)
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
      <main className="mx-auto my-8 flex flex-col">
        <div className="mb-6 flex w-[400px] flex-wrap gap-x-3 gap-y-2 text-sm">
          <button
            className="h-6"
            onClick={() => {
              setZoomLevel(1)
            }}
          >
            Reset image zoom
          </button>
          <button
            className="h-6"
            onClick={() => {
              setImagePos([0, 0])
            }}
          >
            Reset image position
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={function (e) {
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
              type="range"
              value={circumRadius}
              {...circumRadiusLimits}
              onChange={e => setCircumRadius(parseInt(e.target.value || '0'))}
            />
            {circumRadius}
          </label>
          <label>
            Crop X offset
            <input
              type="range"
              value={cxOffset}
              onChange={e => setCxOffset(parseInt(e.target.value || '0'))}
            />
          </label>
          <label>
            Crop Y offset
            <input
              type="range"
              value={cyOffset}
              onChange={e => setCyOffset(parseInt(e.target.value || '0'))}
            />
          </label>
          <label>
            border radius
            <input
              type="range"
              value={borderRadius}
              {...borderRadiusLimits}
              onChange={e => setBorderRadius(parseInt(e.target.value || '0'))}
            />
            {borderRadius}
          </label>
          <label>
            rotate
            <input
              type="range"
              value={rotate}
              {...rotateLimits}
              onChange={e => setRotate(parseInt(e.target.value || '0'))}
            />
            {`${rotate}°`}
          </label>
        </div>

        <svg
          id="cropped-image-editor"
          width={svgSide}
          height={svgSide}
          viewBox={`0 0 ${svgSide} ${svgSide}`}
          className="border border-solid border-gray-300 bg-gray-900"
          ref={imageEditorRef}
        >
          <image
            className="cursor-grab"
            ref={imageShapeRef}
            href={imgSrc}
            x={imageX}
            y={imageY}
            width={svgSide * zoomLevel}
            height={svgSide * zoomLevel}
            clipPath={maskOff ? `url(#${clipPathId})` : undefined}
            mask={maskOff ? undefined : 'url(#tw-mask)'}
          ></image>
          {maskOff && (
            <clipPath id={clipPathId}>
              <path
                d={dForPath}
                transform={`rotate(${rotate})`}
                transform-origin={`${shapeCenter.cx} ${shapeCenter.cy}`}
              />
            </clipPath>
          )}
          {!maskOff && (
            <mask id="tw-mask">
              <rect x="0" y="0" width="400" height="400" fill="#333"></rect>
              <circle cx="200" cy="200" r="200" fill="#555"></circle>
              <path
                fill="#fff"
                d={dForPath}
                transform={`rotate(${rotate})`}
                transform-origin={`${shapeCenter.cx} ${shapeCenter.cy}`}
                clipPath="url(#for-mask)"
              />
            </mask>
          )}
          <clipPath id="for-mask">
            <circle
              cx="200"
              cy="200"
              r="200"
              transform-origin={`${shapeCenter.cx} ${shapeCenter.cy}`}
              transform={`rotate(${-rotate})`}
            ></circle>
          </clipPath>
        </svg>

        <button className="mt-3 py-2" onClick={handleDownloadImage}>
          Download image
        </button>
        <canvas className="hidden" ref={canvasRef}></canvas>
        {/* <img height="400" width="400" alt="output image" ref={outputImageRef} /> */}
        <a className="hidden" ref={imageLinkRef}></a>
      </main>
    </div>
  )
}

export default CurvedCrop
