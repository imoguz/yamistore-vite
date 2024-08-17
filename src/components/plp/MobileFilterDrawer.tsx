import React from 'react'

interface IMobileFilterDrawerProps {
  item: IFilterOptions
  tempFilters: ISelectedFilters
  setTempFilters: React.Dispatch<React.SetStateAction<ISelectedFilters>>

  colors: IColor[]
}
const MobileFilterDrawer: React.FC<IMobileFilterDrawerProps> = ({
  item,
  colors,
  tempFilters,
  setTempFilters,
}) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    title: string
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [title]: event.target.checked
        ? [...prev[title], event.target.name]
        : prev[title].filter((item) => item !== event.target.name),
    }))
  }

  return (
    <div className='w-[280px] h-auto p-1 border-b border-gray-200'>
      <div className='flex justify-between items-center h-10 cursor-pointer'>
        {item.title}
      </div>
      <div>
        <div className='flex flex-row flex-wrap pl-1'>
          {/* Accordion detail */}
          {item.options.map((option) => (
            <div
              key={option}
              className='flex items-center mb-1 gap-1 w-[132px] max-w-[132px] cursor-pointer hover:font-semibold'
            >
              <input
                id={option}
                type='checkbox'
                className='size-4 cursor-pointer'
                name={option}
                value={option}
                checked={tempFilters[item.title].includes(option)}
                onChange={(event) => handleChange(event, item.title)}
              />
              <label
                htmlFor={option}
                className='text-md cursor-pointer'
                style={{
                  color:
                    colors.length > 0
                      ? colors.find((color) => color.name === option)?.hex_code
                      : 'inherit',
                }}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileFilterDrawer
