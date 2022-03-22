import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { roundedPolygonByCircumRadius } from 'curved-polygon'
import React, { useState, useRef, useEffect } from 'react'
import { Canvg } from 'canvg'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom } from 'd3-zoom'
import { NumberRange } from 'components/Inputs/NumberRange'

const queryOptions = [
  'sides',
  'circum-radius',
  'rotate',
  'border-radius',
  'crop-x-offset',
  'crop-y-offset',
]

const svgSide = 400
const defaultImage = '/images/egg.jpg'
// const sideCountLimits = { min: 3, max: 50 }
// const circumRadiusLimits = { min: 0, max: 500 }
// const rotateLimits = { min: 0, max: 360 }
// const borderRadiusLimits = { min: 0, max: 1800 }
// const cropOffsetLimits = { min: -800, max: 800 }
// const imgPosOffsetLimits = { min: -800, max: 800 }
// const zoomLevelLimits = { min: 0.01, max: 50 }

type IntOrFloat = 'int' | 'float'

type CropParam = {
  limits: { min: number; max: number }
  default: number
  type: IntOrFloat
}
interface CropParams {
  [key: string]: CropParam
}

const cropAndImageParams: CropParams = {
  sides: { limits: { min: 3, max: 50 }, default: 6, type: 'int' },
  circumRadius: {
    limits: { min: 0, max: 500 },
    default: svgSide / 2,
    type: 'int',
  },
  rotate: { limits: { min: 0, max: 360 }, default: 0, type: 'int' },
  borderRadius: { limits: { min: 0, max: 1800 }, default: 50, type: 'int' },
  cropXOffset: { limits: { min: -800, max: 800 }, default: 0, type: 'int' },
  cropYOffset: { limits: { min: -800, max: 800 }, default: 0, type: 'int' },
  imageXPosition: { limits: { min: -800, max: 800 }, default: 0, type: 'int' },
  imageYPosition: { limits: { min: -800, max: 800 }, default: 0, type: 'int' },
  imageZoom: { limits: { min: 0.01, max: 50 }, default: 1, type: 'float' },
}

type cropAndImageState = {
  sides: number
  circumRadius: number
  rotate: number
  borderRadius: number
  cropXOffset: number
  cropYOffset: number
  imageXPosition: number
  imageYPosition: number
  imageZoom: number
}

const CurvedCrop: NextPage = () => {
  const router = useRouter()

  const [state, setState] = useState(() => {
    const allParamKeys = Object.keys(cropAndImageParams)
    const init = {}
    // init object will have only default param values
    allParamKeys.forEach(k => {
      init[k] = cropAndImageParams[k].default
    })
    return init as cropAndImageState
  })

  const [imageFile, setImageFile] = useState(null)
  const [maskOff, setMaskOff] = useState(false)
  const [download, setDownload] = useState(false)
  const [bgDark, setBgDark] = useState(true)

  const {
    imageXPosition,
    imageYPosition,
    imageZoom,
    rotate,
    circumRadius,
    sides: sideCount,
    borderRadius,
  } = state

  const imageEditorRef = useRef(null)
  const canvasRef = useRef(null)
  const imageLinkRef = useRef(null)
  const imageShapeRef = useRef(null)
  // const outputImageRef = useRef(null)

  const mountedRef = useRef(false)

  // useEffect(() => {
  //   console.log({ query: router.query })
  //   const { sides } = router.query
  //   if (sides && !isNaN(parseInt(sides as string))) {
  //     setSideCount(parseInt(sides as string))
  //   }
  // }, [router.query])

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

  const handleChangeParam = (paramName: string, value) => {
    setState({ ...state, [paramName]: value })
  }

  useEffect(() => {
    const image = imageShapeRef.current

    select(image).call(
      drag()
        .on('start', function () {
          select(this).attr('fill', 'gray').classed('brightness-110', true)
        })
        .on('drag', function (e) {
          handleChangeParam('imageXPosition', imageXPosition + e.dx)
          handleChangeParam('imageYPosition', imageYPosition + e.dy)
        })
        .on('end', function () {
          select(this).attr('fill', 'black').classed('brightness-110', false)
        }),
    )

    select(image).call(
      zoom()
        .scaleExtent([0.01, 50])
        .on('zoom', ({ transform }) => {
          const { x, y, k } = transform
          handleChangeParam('imageZoom', k)
          handleChangeParam('imageXPosition', x)
          handleChangeParam('imageYPosition', y)
        }),
    )
  }, []) // no need to attach drag listeners everytime something changes

  // const handleSidesChange = e => {
  //   // Handle values < 3
  //   setSideCount(parseInt(e.target.value))

  //   router.query.sides = e.target.value
  //   router.push(router)
  // }

  const handleDownloadImage = () => {
    setMaskOff(true)
    setDownload(true)
  }

  const shapeCenter = {
    cx: svgSide / 2 + state.cropXOffset,
    cy: svgSide / 2 + state.cropYOffset,
  }

  const dForPath = roundedPolygonByCircumRadius({
    circumRadius,
    sideCount,
    borderRadius,
    ...shapeCenter,
  })

  const clipPathId = `polygon-sided-${state.sides}`

  const imgSrc = imageFile ? URL.createObjectURL(imageFile) : defaultImage

  return (
    <div className="flex font-sans">
      <main className=" mx-auto my-8 flex  flex-col px-4">
        <h1 className="mb-2 font-serif text-4xl font-normal text-gray-600">
          A Geometric Cropping Tool for Twitter profile pictures
        </h1>
        <a
          href="https://github.com/shreshthmohan/next-blog/issues/24"
          target="_blank"
          rel="noreferrer"
          className="mb-2 text-sm"
        >
          Report Issue
        </a>

        <div className="flex flex-wrap justify-center gap-x-4 rounded border border-solid border-gray-300 py-2">
          <div className="">
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
                x={imageXPosition}
                y={imageYPosition}
                width={svgSide * imageZoom}
                height={svgSide * imageZoom}
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

          <div className=" flex w-[400px] flex-wrap gap-x-3 gap-y-1 text-sm">
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
                handleChangeParam('imageZoom', 1)
                handleChangeParam('imageXPosition', 0)
                handleChangeParam('imageYPosition', 0)
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
            <button onClick={() => handleChangeParam('cropXOffset', 0)}>
              Reset crop X offset
            </button>
            <button onClick={() => handleChangeParam('cropYOffset', 0)}>
              Reset crop y offset
            </button>

            {Object.keys(state).map(k => {
              return (
                <NumberRange
                  label={k}
                  onChange={e => {
                    const parsedValue =
                      cropAndImageParams[k].type === 'int'
                        ? parseInt(e.target.value)
                        : parseFloat(e.target.value)

                    if (!isNaN(parsedValue)) {
                      setState({ ...state, [k]: parsedValue })
                    } else {
                      setState({ ...state, [k]: cropAndImageParams[k].default })
                    }
                  }}
                  id={`cc-${k}`}
                  value={state[k]}
                  rangeLimits={cropAndImageParams[k].limits}
                  key={k}
                />
              )
            })}

            <button className="w-full" onClick={handleDownloadImage}>
              Download image
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CurvedCrop
