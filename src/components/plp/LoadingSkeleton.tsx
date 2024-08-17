const LoadingSkeleton = () => {
  const pulse = 'rounded-sm bg-[#f4f4f4] animate-pulse'
  const skeletonCount =
    window.innerWidth < 1164 ? 2 : window.innerWidth < 1448 ? 3 : 4

  return (
    <div className='flex justify-between w-full'>
      {[...Array(skeletonCount)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className='w-[46vw] xs:w-[265px] sm:w-[280px] md:w-[215px] lg:w-[280px] h-[320px] xs:h-[390px] sm:h-[400px] md:h-[350px] lg:h-[400px] rounded shadow-md'
        >
          <div
            className={`w-full h-[240px] xs:h-[290px] sm:h-[310px] md:h-[260px] lg:h-[310px] ${pulse}`}
          />
          <div className='w-full h-[80px] xs:h-[90px] flex flex-col justify-evenly px-2'>
            <div className=' flex gap-1'>
              {[...Array(4)].map((_, index) => (
                <div
                  key={`color-box-${index}`}
                  className={`w-8 h-8 ${pulse}`}
                />
              ))}
            </div>
            <div className={`w-[90%] h-3 rounded-lg ${pulse} `} />
            <div className={`w-[80%] h-3 rounded-lg ${pulse} `} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
