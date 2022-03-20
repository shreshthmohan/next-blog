import { NextPage } from 'next'
import { roundedPolygonByCircumRadius } from 'curved-polygon'
import React, { useState, useRef, useEffect } from 'react'
import { Canvg } from 'canvg'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom } from 'd3-zoom'

const svgSide = 400
const defaultImage = '/images/egg.jpg'
const sideCountLimits = { min: 3, max: 50 }
const circumRadiusLimits = { min: 0, max: 500 }
const rotateLimits = { min: 0, max: 360 }
const borderRadiusLimits = { min: 0, max: 1800 }

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
  const [bgDark, setBgDark] = useState(true)

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
      <main className="mx-auto my-8 flex flex-col px-4">
        <h1 className="font-serif font-normal text-gray-600">
          Geometric Cropping Tool for Twitter profile pictures
        </h1>
        <a
          href="https://github.com/shreshthmohan/next-blog/issues/24"
          target="_blank"
          rel="noreferrer"
        >
          Report Issue
        </a>
        <div className="flex flex-wrap place-content-center ">
          <div className="mr-2">
            <svg
              id="cropped-image-editor"
              width={svgSide}
              height={svgSide}
              viewBox={`0 0 ${svgSide} ${svgSide}`}
              className={`border border-solid border-gray-300 ${
                bgDark ? 'bg-gray-900' : 'bg-gray-50'
              }`}
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

            <canvas className="hidden" ref={canvasRef}></canvas>
            {/* <img height="400" width="400" alt="output image" ref={outputImageRef} /> */}
            <a className="hidden" ref={imageLinkRef}></a>
          </div>

          <div className="ml-2 mb-6 flex w-[400px] flex-wrap gap-x-3 gap-y-2 text-sm">
            <input
              type="file"
              accept="image/*"
              onChange={function (e) {
                if (e.target.files.length) {
                  setImageFile(e.target.files[0])
                }
              }}
            />
            <button
              onClick={() => {
                setZoomLevel(1)
                setImagePos([0, 0])
              }}
            >
              {'Reset image zoom & position'}
            </button>
            <button
              onClick={() => {
                setBgDark(!bgDark)
              }}
              title="toggle canvas background to better see your image's position with respect to the circular crop twitter will apply"
            >
              Toggle Background
            </button>
            <div className="flex w-full justify-between">
              <label>Sides</label>
              <div className="flex w-2/3">
                <input
                  className="grow"
                  onChange={handleSidesChange}
                  type="range"
                  step="1"
                  value={sideCount}
                  {...sideCountLimits}
                />
                <input
                  type="number"
                  className="w-10"
                  name=""
                  id=""
                  value={sideCount}
                />
              </div>
            </div>
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
            <button className="mt-2 w-full py-2" onClick={handleDownloadImage}>
              Download image
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CurvedCrop
