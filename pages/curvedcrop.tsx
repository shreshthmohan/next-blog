import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { roundedPolygonByCircumRadius } from 'curved-polygon'
import React, { useState, useRef, useEffect } from 'react'
import BaseReadingLayout from 'layouts/BaseReadingLayout'
import { Canvg } from 'canvg'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom } from 'd3-zoom'
import { kebabCase, camelCase } from 'lodash'
import { NumberRange } from 'components/Inputs/NumberRange'
import { CroppedImageSample } from 'components/curvedcrop/Presets'

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

type IntOrFloat = 'int' | 'float'

type CropParam = {
  limits: { min: number; max: number }
  default: number
  step?: number
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
  imageZoom: {
    limits: { min: 0.01, max: 50 },
    default: 1,
    step: 0.02,
    type: 'float',
  },
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

const presets = [
  {
    name: 'maathai',
    params: { sides: 26, borderRadius: 1396, circumRadius: 145, rotate: 0 },
    previewImage: '/images/ccdemo/curvedcrop2.png',
  },
  {
    name: 'bravo',
    params: { sides: 10, borderRadius: 1070, circumRadius: 181, rotate: 0 },
    previewImage: '/images/ccdemo/curvedcrop10.png',
  },
  {
    name: 'goodall',
    params: { sides: 8, borderRadius: 490, circumRadius: 201, rotate: 0 },
    previewImage: '/images/ccdemo/curvedcrop6.png',
  },
  {
    name: 'mandela',
    params: { sides: 6, borderRadius: 50, circumRadius: 206, rotate: 0 },
    previewImage: '/images/ccdemo/curvedcrop4.png',
  },
  {
    name: 'einstein',
    params: { sides: 3, borderRadius: 0, circumRadius: 200, rotate: 90 },
    previewImage: '/images/ccdemo/curvedcrop11.png',
  },
  {
    name: 'torvalds',
    params: { sides: 7, borderRadius: 50, circumRadius: 204, rotate: 0 },
    previewImage: '/images/ccdemo/curvedcrop5.png',
  },
]

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
  const [userChangedInput, setUserChangedInput] = useState(false)

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

  const handleChangeStateAndQueryParam = (paramName: string, value) => {
    const parsedValue =
      cropAndImageParams[paramName].type === 'int'
        ? parseInt(value)
        : parseFloat(value)

    if (!isNaN(parsedValue)) {
      setState(prevState => {
        const nextState = { ...prevState, [paramName]: parsedValue }
        const initQuery = { ...router.query }
        Object.keys(nextState).map(k => {
          const queryParamName = kebabCase(k)
          if (queryOptions.includes(queryParamName)) {
            initQuery[queryParamName] = nextState[k]
          }
        })
        router.push({
          pathname: router.pathname,
          query: initQuery,
        })
        return nextState
      })
    } else {
      setState(prevState => ({
        ...prevState,
        [paramName]: cropAndImageParams[paramName].default,
      }))
    }
    setUserChangedInput(true)
  }

  const handleChangeState = (paramName: string, value) => {
    const parsedValue =
      cropAndImageParams[paramName].type === 'int'
        ? parseInt(value)
        : parseFloat(value)
    if (!isNaN(parsedValue)) {
      setState(state => ({ ...state, [paramName]: parsedValue }))
    } else {
      setState(state => ({
        ...state,
        [paramName]: cropAndImageParams[paramName].default,
      }))
    }
  }

  useEffect(() => {
    if (!userChangedInput) {
      const validQueryParams = Object.keys(router.query).filter(qp =>
        queryOptions.includes(qp),
      )

      const camelifiedQueryParams = validQueryParams.map(qp => ({
        kebab: qp,
        camel: camelCase(qp),
      }))

      camelifiedQueryParams.forEach(qp => {
        handleChangeState(qp.camel, router.query[qp.kebab])
      })
    }
  }, [router.query, userChangedInput])

  useEffect(() => {
    const image = imageShapeRef.current

    select(image).call(
      drag()
        .on('start', function () {
          select(this).attr('fill', 'gray').classed('brightness-110', true)
        })
        .on('drag', function (e) {
          setState(({ imageXPosition, imageYPosition, ...restPrevState }) => ({
            ...restPrevState,
            imageXPosition: imageXPosition + e.dx,
            imageYPosition: imageYPosition + e.dy,
          }))
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
          handleChangeStateAndQueryParam('imageZoom', k)
          handleChangeStateAndQueryParam('imageXPosition', x)
          handleChangeStateAndQueryParam('imageYPosition', y)
        }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // no need to attach drag listeners everytime something changes

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
    <BaseReadingLayout maxWidthClassName="max-w-screen-xl font-sans">
      <h1 className="mb-2 font-serif text-xl font-normal text-gray-600 lg:text-3xl">
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
      <div className="flex flex-wrap justify-center gap-x-4 rounded border border-solid border-gray-300 p-4">
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
              handleChangeStateAndQueryParam('imageZoom', 1)
              handleChangeStateAndQueryParam('imageXPosition', 0)
              handleChangeStateAndQueryParam('imageYPosition', 0)
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
          <button
            onClick={() => handleChangeStateAndQueryParam('cropXOffset', 0)}
          >
            Reset crop X offset
          </button>
          <button
            onClick={() => handleChangeStateAndQueryParam('cropYOffset', 0)}
          >
            Reset crop y offset
          </button>

          {Object.keys(state).map(k => {
            return (
              <NumberRange
                label={k}
                onChange={e => {
                  handleChangeStateAndQueryParam(k, e.target.value)
                }}
                id={`cc-${k}`}
                value={state[k]}
                rangeLimits={cropAndImageParams[k].limits}
                step={cropAndImageParams[k].step}
                key={k}
              />
            )
          })}

          <button className="w-full" onClick={handleDownloadImage}>
            Download image
          </button>
        </div>
      </div>
      <div className="flex pt-2">
        {presets.map(p => (
          <div
            key={p.name}
            onClick={() => {
              Object.keys(p.params).forEach(pp => {
                handleChangeStateAndQueryParam(pp, p.params[pp])
              })
            }}
          >
            <CroppedImageSample size="sm" imgSrc={p.previewImage} />
          </div>
        ))}
      </div>
    </BaseReadingLayout>
  )
}

export default CurvedCrop
