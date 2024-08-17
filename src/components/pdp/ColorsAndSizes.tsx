import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { FaCheck } from 'react-icons/fa6'
import { IoIosRemove } from 'react-icons/io'

interface IColorsAndSizesProps {
  selectedVariant: ISelectedVariant | null
  setSelectedVariant: React.Dispatch<
    React.SetStateAction<ISelectedVariant | null>
  >
}

const ColorsAndSizes: React.FC<IColorsAndSizesProps> = ({
  selectedVariant,
  setSelectedVariant,
}) => {
  const { product } = useAppSelector((state) => state.products)
  const [sizes, setSizes] = useState<string[]>([])

  useEffect(() => {
    if (product?.variants.length) {
      const allSizes = [
        ...new Set(product?.variants?.map((item) => item.size_id.name)),
      ]
      setSizes(allSizes)

      // Find and set the default variant
      const defaultVariant = product?.variants.find((item) => item.isDefault)
      if (!selectedVariant) {
        if (defaultVariant)
          setSelectedVariant({
            variantId: defaultVariant._id,
            color: defaultVariant.color_id.hex_code,
            size: defaultVariant.size_id.name,
            colorName: defaultVariant.color_id.name,
            stock: defaultVariant.stock,
            image: defaultVariant.image_url,
          })
        else setSelectedVariant(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  const handleClictSize = (size: string) => {
    const isColor = product?.variants?.filter(
      (item) =>
        item.size_id.name === size &&
        item.color_id.hex_code === selectedVariant?.color
    )
    if (isColor?.length)
      setSelectedVariant({
        ...selectedVariant!,
        variantId: isColor[0]._id,
        colorName: isColor[0].color_id.name,
        stock: isColor[0].stock,
        size,
      })
    else
      setSelectedVariant({
        ...selectedVariant!,
        variantId: null,
        colorName: null,
        stock: null,
        size,
      })
  }

  const handleClickColor = (item: IVariant) => {
    if (selectedVariant)
      setSelectedVariant({
        ...selectedVariant,
        variantId: item._id,
        color: item.color_id.hex_code,
        colorName: item.color_id.name,
        stock: item.stock,
        image: item.image_url,
      })
  }

  return (
    <>
      <div>
        {`Selected size: ${selectedVariant?.size && selectedVariant.size}`}
        <div className='flex flex-wrap gap-2 mt-2'>
          {sizes.map((size) => (
            <div
              key={size}
              onClick={() => handleClictSize(size)}
              className={`w-16 border border-gray-400 hover:opacity-80 transition-all duration-200 hover:border-black py-1 text-center cursor-pointer ${
                selectedVariant?.size === size
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>
      <hr className='mt-5' />
      <div className='my-2'>
        <p>
          Selected color:
          <span className='ml-1'>
            {selectedVariant?.colorName
              ? selectedVariant?.colorName?.charAt(0).toUpperCase() +
                selectedVariant?.colorName?.slice(1)
              : 'Not available'}
          </span>
        </p>
        <div className='flex gap-2 mt-2'>
          {product?.variants.map(
            (item, index) =>
              item.size_id.name === selectedVariant?.size && (
                <div
                  key={index}
                  className='flex items-center justify-center h-10 w-10 border-8 rounded-full cursor-pointer'
                  style={{ borderColor: item.color_id.hex_code }}
                  onClick={() => handleClickColor(item)}
                >
                  {item.color_id.hex_code === selectedVariant.color &&
                    (item.stock > 0 ? (
                      <FaCheck className='text-gray-500' />
                    ) : (
                      <IoIosRemove className='text-black text-5xl' />
                    ))}
                </div>
              )
          )}
          {!selectedVariant?.variantId && (
            <div
              key={'colorNotAvailable'}
              className='flex items-center justify-center h-10 w-10 opacity-40 border-8 rounded-full cursor-pointer'
              style={{ borderColor: selectedVariant?.color || 'gray' }}
            >
              <IoIosRemove className='text-black text-5xl' />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ColorsAndSizes
