import React from 'react'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

interface IFilterAccordionProps {
  item: IFilterOptions
  selectedFilters: ISelectedFilters
  setSelectedFilters: React.Dispatch<React.SetStateAction<ISelectedFilters>>
  setTempFilters: React.Dispatch<React.SetStateAction<ISelectedFilters>>
  colors: IColor[]
}
const FilterAccordion: React.FC<IFilterAccordionProps> = ({
  item,
  selectedFilters,
  setSelectedFilters,
  setTempFilters,
  colors,
}) => {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    title: string
  ) => {
    const updateFilters = (prev: ISelectedFilters) => ({
      ...prev,
      [title]: event.target.checked
        ? [...prev[title], event.target.name]
        : prev[title].filter((item) => item !== event.target.name),
    })

    setSelectedFilters(updateFilters)
    setTempFilters(updateFilters)
  }

  return (
    <div className='w-[280px] h-auto p-1 border-b border-gray-200'>
      <div
        className='flex justify-between items-center h-10 cursor-pointer'
        onClick={() => setExpanded(expanded === item.title ? null : item.title)}
      >
        {item.title}
        {expanded === item.title ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      <div
        style={{
          overflow: 'hidden',
          height: expanded ? `${Math.ceil(item.options.length / 2) * 28}px` : 0,
          maxHeight: 294,
          transition: 'height 0.3s ease',
        }}
      >
        <div className='flex flex-row flex-wrap pl-1'>
          {/* FilterAccordion detail */}
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
                checked={selectedFilters[item.title].includes(option)}
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

export default FilterAccordion
