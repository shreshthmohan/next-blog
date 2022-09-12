import BaseReadingLayout from 'layouts/BaseReadingLayout'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CroppedImageSample } from 'components/curvedcrop/Presets'

const DataVizCard = ({
  title,
  description,
  imgSrc,
  imgHeight,
  imgWidth,
  imgAlt = title,
  hrefPath,
}) => (
  <div className="mb-4 rounded border border-solid border-gray-300 px-3 py-2 shadow-sm">
    <h3 className="m-0 text-xl font-normal">{title}</h3>
    <p className="m-0 text-base leading-tight text-gray-500">{description}</p>
    <a
      href={hrefPath}
      target="_blank"
      rel="noreferrer"
      title={`click to open ${title} chart`}
    >
      <div className="overflow-hidden rounded border border-solid border-transparent hover:brightness-75">
        <Image src={imgSrc} alt={imgAlt} height={imgHeight} width={imgWidth} />
      </div>
    </a>
  </div>
)

const Home: NextPage = () => {
  return (
    <BaseReadingLayout maxWidthClassName="max-w-screen-md">
      <div className="flex flex-col-reverse items-center justify-between py-10 sm:flex-row  ">
        <div className="text-center sm:pr-10 sm:text-left">
          <h1 className="my-0 text-4xl font-normal">Shreshth Mohan</h1>
          <p className="mt-1 text-lg">
            I am a JavaScript developer based in Bangalore, India. I build
            applications and data visualisations for the web.
          </p>
        </div>
        <div className="h-[100px] w-[100px] rounded-full sm:h-[150px] sm:w-[150px]">
          <Image
            height={150}
            width={150}
            className="rounded-full"
            alt="shreshth mohan's mugshot"
            src="/images/shreshth_400x400.webp"
          />
        </div>
      </div>

      <h2 className="mb-2 text-2xl font-normal">Data visualizations</h2>
      <DataVizCard
        title="Horizontal packed bubble"
        description="A force simulation with two modes, combined and split. Also uses Voronoi to implement a layer to improve interaction."
        hrefPath="https://data-viz-d3.shreshth.dev/taxes/"
        imgSrc="/images/taxes.webp"
        imgAlt="horizontal bubble chart with voronoi pattern"
        imgHeight="200"
        imgWidth="845"
      />

      <DataVizCard
        title="Calendar"
        description="A calendar-like grid of stacked bar charts with a legend that allows for toggling of different parts of the stack."
        hrefPath="https://data-viz-d3.shreshth.dev/calendar/"
        imgSrc="/images/calendar.webp"
        imgAlt="horizontal bubble chart with voronoi pattern"
        imgHeight="290"
        imgWidth="1012"
      />

      <DataVizCard
        title="Mace"
        description="
            A bubble chart with an additional direction dimension denoted by the
            orientation of a custom shape made specifically for this chart."
        hrefPath="https://data-viz-d3.shreshth.dev/happiness/"
        imgSrc="/images/happiness.webp"
        imgAlt="horizontal bubble chart with voronoi pattern"
        imgHeight="267"
        imgWidth="851"
      />

      <div className="mb-4 rounded border border-solid border-gray-300 px-3 py-2 shadow-sm">
        <p className="m-0 text-xl leading-tight">
          See all the{' '}
          <a
            href="https://data-viz-d3.shreshth.dev"
            target="_blank"
            rel="noreferrer"
          >
            charts here
          </a>
        </p>
      </div>

      <h2 className="mb-4 pt-12 text-2xl font-normal">Tiny projects</h2>
      <div className="rounded border border-solid border-gray-300 p-3">
        <h3 className="m-0 text-xl font-normal">
          <Link href="/curvedcrop">
            <a>Cropping tool for Twitter</a>
          </Link>
        </h3>
        <p className="m-0 text-base leading-tight text-gray-500">
          Create polygon-shaped crops, with curved corners and some fun patterns
          created due to corner cases in my polygon curve code. Some images I
          cropped using the tool:
        </p>
        <div className="mt-2 flex flex-wrap justify-center rounded border border-solid border-gray-100 bg-gray-200 p-2">
          <Link href="/curvedcrop?sides=26&border-radius=1396&circum-radius=145">
            <a>
              <CroppedImageSample imgSrc="/images/ccdemo/curvedcrop2.png" />
            </a>
          </Link>
          <Link href="/curvedcrop?sides=10&border-radius=1070&circum-radius=181">
            <a>
              <CroppedImageSample imgSrc="/images/ccdemo/curvedcrop10.png" />
            </a>
          </Link>
          <Link href="/curvedcrop?circum-radius=201&sides=8&border-radius=490">
            <a>
              <CroppedImageSample imgSrc="/images/ccdemo/curvedcrop6.png" />
            </a>
          </Link>
          <Link href="/curvedcrop?circum-radius=206&sides=6&border-radius=50">
            <a>
              <CroppedImageSample imgSrc="/images/ccdemo/curvedcrop4.png" />
            </a>
          </Link>
          <Link href="/curvedcrop?sides=3&border-radius=0&rotate=90">
            <a>
              <CroppedImageSample imgSrc="/images/ccdemo/curvedcrop11.png" />
            </a>
          </Link>
          <Link href="/curvedcrop?sides=7&border-radius=50&circum-radius=204">
            <a>
              <CroppedImageSample imgSrc="/images/ccdemo/curvedcrop5.png" />
            </a>
          </Link>
        </div>
      </div>

      <h3 className=" text-xl font-normal">
        <Link href="/bullsandcows">
          <a>Bulls and Cows: A guessing game</a>
        </Link>
      </h3>
      <br />
    </BaseReadingLayout>
  )
}

export default Home
