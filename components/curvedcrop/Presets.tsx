import Image from 'next/image'

type CroppedImageSampleParams = {
  imgSrc: string
  size?: 'sm' | 'base'
}

export const CroppedImageSample = ({
  imgSrc,
  size = 'base',
}: CroppedImageSampleParams) => {
  const sizeData = {
    base: { classStr: 'h-[200px] w-[200px]', value: 200 },
    sm: { classStr: 'h-[100px] w-[100px]', value: 100 },
  }

  return (
    <div
      className={`${sizeData[size].classStr}  m-1  overflow-hidden rounded-full border-2 border-solid border-gray-400`}
    >
      <Image
        src={imgSrc}
        alt="img famous person"
        width={sizeData[size].value}
        height={sizeData[size].value}
      />
    </div>
  )
}
