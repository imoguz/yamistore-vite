import * as React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { readProducts } from '../../features/productSlice'
import { readColors } from '../../features/colorSlice'
import FilterAccordion from './FilterAccordion'
import MobileFilterDrawer from './MobileFilterDrawer'

interface IFilterPanelProps {
  topcategory: string | undefined
  midcategory: string | undefined
  subcategory: string | undefined
  search: string | undefined
  selectedFilters: ISelectedFilters
  setSelectedFilters: React.Dispatch<React.SetStateAction<ISelectedFilters>>
  tempFilters: ISelectedFilters
  setTempFilters: React.Dispatch<React.SetStateAction<ISelectedFilters>>
  isMobile: boolean
}

const FilterPanel: React.FC<IFilterPanelProps> = ({
  topcategory,
  midcategory,
  subcategory,
  search,
  selectedFilters,
  setSelectedFilters,
  tempFilters,
  setTempFilters,
  isMobile,
}) => {
  const dispatch = useAppDispatch()
  const { colors } = useAppSelector((state) => state.color)
  const [listedProducts, setListedProducts] = React.useState<IProduct[] | []>(
    []
  )
  const [filterOptions, setFilterOptions] = React.useState<IFilterOptions[]>([])

  React.useEffect(() => {
    const query = {
      topcategory,
      midcategory,
      subcategory,
      search,
    }

    const getProducts = async () => {
      const result = await dispatch(readProducts(query))
      if (readProducts.fulfilled.match(result)) {
        setListedProducts(result?.payload?.data as IProduct[])
      }
    }

    getProducts()
  }, [dispatch, topcategory, midcategory, subcategory, search])

  React.useEffect(() => {
    const getColors = async () => {
      await dispatch(readColors())
    }
    getColors()
  }, [dispatch])

  const filterOptionsFn = () => {
    const colors: string[] = []
    const sizes: string[] = []
    const brands: string[] = []
    const discounts: string[] = []
    let prices: number[] = []

    listedProducts?.forEach((product) => {
      brands.push(product.brand.name)
      prices.push(product.price)
      discounts.push(product.discount.amount + '% off')
      product.variants.forEach((variant) => {
        colors.push(variant.color_id.name)
        sizes.push(variant.size_id.name)
      })
    })

    prices = [...new Set(prices)]

    const priceOptions = prices.map((price) => {
      if (price > 0 && price < 250) {
        return '$0 - $250'
      } else if (price >= 250 && price < 500) {
        return '$250 - $500'
      } else if (price >= 500 && price < 750) {
        return '$500 - $750'
      } else if (price >= 750 && price < 1000) {
        return '$750 - $1000'
      } else {
        return '$1000 - more'
      }
    })

    return {
      colors: [...new Set(colors)],
      sizes: [...new Set(sizes)],
      brands: [...new Set(brands)],
      price: [...new Set(priceOptions)],
      discount: [...new Set(discounts)],
    }
  }

  React.useEffect(() => {
    setFilterOptions([
      { title: 'Size', options: filterOptionsFn().sizes },
      { title: 'Color', options: filterOptionsFn().colors },
      { title: 'Price', options: filterOptionsFn().price },
      { title: 'Discount', options: filterOptionsFn().discount },
      { title: 'Brand', options: filterOptionsFn().brands },
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listedProducts])

  return (
    <>
      {filterOptions &&
        filterOptions.map((item) =>
          isMobile ? (
            <MobileFilterDrawer
              key={item.title}
              {...{ item, tempFilters, setTempFilters, colors }}
            />
          ) : (
            <FilterAccordion
              key={item.title}
              {...{
                item,
                selectedFilters,
                setSelectedFilters,
                setTempFilters,
                colors,
              }}
            />
          )
        )}
    </>
  )
}

export default FilterPanel
