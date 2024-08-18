import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { readProducts } from '../features/productSlice'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { FiFilter } from 'react-icons/fi'
import { FaFilter } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import ErrorPage from './ErrorPage'
import SortMenu from '../components/plp/SortMenu'
import Pagination from '../components/plp/Pagination'
import FilterPanel from '../components/plp/FilterPanel'
import ProductCards from '../components/plp/ProductCards'
import LoadingSkeleton from '../components/plp/LoadingSkeleton'

const ProductListingPage = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const leftColumn = useRef<HTMLDivElement | null>(null)
  const rightColumn = useRef<HTMLDivElement | null>(null)
  const category = searchParams.get('category')
  const search = searchParams.get('query') || undefined
  const pageSize = 10
  const [page, setPage] = useState<number>(1)
  const [mobileFilterPanel, setMobileFilterPanel] = useState(false)
  const [sortMenu, setSortMenu] = useState<ISortMenu>({
    open: false,
    selectedOption: 'Featured',
    field: 'name',
    order: 1,
  })

  const initialFilters: ISelectedFilters = {
    Color: [],
    Size: [],
    Price: [],
    Discount: [],
    Brand: [],
  }

  const [selectedFilters, setSelectedFilters] =
    useState<ISelectedFilters>(initialFilters)
  const [tempFilters, setTempFilters] =
    useState<ISelectedFilters>(initialFilters)
  const [productData, setProductData] = useState<IProductData | null>(null)
  const { productLoading, productError } = useAppSelector(
    (state) => state.products
  )

  const [topcategory, midcategory, ...remaining] = category
    ? category.split('-')
    : [undefined, undefined, undefined]
  const subcategory = remaining.length > 0 ? remaining.join('-') : undefined

  const filterOptions = () => {
    const options: ISelectedFilters = {}

    for (const key in selectedFilters) {
      if (selectedFilters[key].length > 0) {
        options[key] = selectedFilters[key]
      }
    }

    return options
  }

  useEffect(() => {
    const query = {
      topcategory,
      midcategory,
      subcategory,
      search,
      page: page,
      limit: pageSize,
      filteroptions: filterOptions(),
      sort: { [sortMenu.field]: sortMenu.order },
    } as IQuery

    const fetchProducts = async () => {
      const result = await dispatch(readProducts(query))
      if (readProducts.fulfilled.match(result)) {
        setProductData(result?.payload as IProductData)
      }
    }

    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    topcategory,
    midcategory,
    subcategory,
    search,
    page,
    selectedFilters,
    sortMenu.selectedOption,
  ])

  // when scroll to top first slide the footer
  useEffect(() => {
    let lastScrollTime = 0

    const handleScroll = (event: WheelEvent) => {
      const currentTime = new Date().getTime()
      const deltaTime = currentTime - lastScrollTime
      lastScrollTime = currentTime
      const scrollTop = window.scrollY
      const { deltaY } = event

      if (deltaY < 0 && scrollTop > 0 && deltaTime > 100) {
        window.scrollTo({ top: scrollTop + deltaY, behavior: 'smooth' })
        if (leftColumn.current) leftColumn.current.style.overflow = 'hidden'
        if (rightColumn.current)
          rightColumn.current.style.scrollbarWidth = 'none'
        event.preventDefault()
      } else if (scrollTop <= 0) {
        if (leftColumn.current) leftColumn.current.style.overflow = 'auto'
        if (rightColumn.current)
          rightColumn.current.style.scrollbarWidth = '10px'
      }
    }

    window.addEventListener('wheel', handleScroll, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleScroll)
    }
  }, [])

  const handleClearAll = () => {
    setSelectedFilters(initialFilters)
    setTempFilters(initialFilters)
  }

  if (productError) {
    return <ErrorPage error={productError} />
  }

  return (
    <div className='flex h-[calc(100vh-128px)] md:h-[calc(100vh-144px)] xl:h-[calc(100vh-96px)]'>
      {/* left column */}
      <div
        ref={leftColumn}
        className='w-[300px] min-w-[300px] py-4 hidden md:block overflow-y-auto p-2 bg-white custom-scrollbar'
      >
        <div className='flex justify-between px-1 mb-4 text-md border-b border-gray-300'>
          <div className='flex items-center gap-1'>
            <FiFilter />
            Filters
          </div>
          <button
            type='button'
            onClick={handleClearAll}
            className={`text-red-400 hover:text-red-60 mr-1 ${
              Object.values(selectedFilters).some((items) => items.length > 0)
                ? 'block'
                : 'hidden'
            }`}
          >
            Clear All
          </button>
        </div>
        <FilterPanel
          {...{
            topcategory,
            midcategory,
            subcategory,
            search,
            selectedFilters,
            setSelectedFilters,
            tempFilters,
            setTempFilters,
            isMobile: false,
          }}
        />
      </div>

      {/* right column */}
      <div
        ref={rightColumn}
        className='flex-grow overflow-y-auto px-2 py-4 bg-white custom-scrollbar'
      >
        <div className='flex justify-between flex-col sm:flex-row px-1 mb-4 text-md border-b border-gray-300'>
          <p>
            {subcategory &&
              subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
            {productData && ` (${productData.totalRecords} Items)`}
          </p>
          <div
            className='cursor-pointer w-fit relative'
            onMouseOver={() => setSortMenu({ ...sortMenu, open: true })}
            onMouseLeave={() => setSortMenu({ ...sortMenu, open: false })}
          >
            <p className='flex items-center gap-1'>
              Sort By:
              <span className='text-gray-700'>{sortMenu.selectedOption}</span>
              {sortMenu.open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
            <SortMenu {...{ sortMenu, setSortMenu }} />
          </div>
        </div>
        <div className='flex flex-wrap justify-between gap-y-7 gap-x-1'>
          {productLoading ? (
            <LoadingSkeleton />
          ) : (
            productData &&
            productData.data.length > 0 &&
            productData.data.map((product) => (
              <ProductCards key={product._id} {...{ product, rightColumn }} />
            ))
          )}
        </div>
        <div className='my-8 mx-auto'>
          <Pagination {...{ productData, rightColumn, setPage }} />
        </div>
      </div>
      {/* Filter Panel for mobile devices, smaller than md(768px) */}
      <div
        className={`custom-scrollbar md:hidden fixed bottom-0 left-0 h-9 z-[100] ${
          mobileFilterPanel &&
          'w-full h-screen overflow-y-auto bg-white transition-height duration-200 items-start'
        }`}
      >
        <div
          className={`bg-sky-600 text-white font-semibold flex items-center justify-between px-3 ${
            mobileFilterPanel ? 'w-full h-10' : 'w-24 h-9 opacity-85'
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              mobileFilterPanel || 'cursor-pointer'
            }`}
            onClick={() => setMobileFilterPanel(true)}
          >
            <FaFilter />
            <span>FILTER</span>
          </div>

          <div
            className={`${
              mobileFilterPanel ? 'flex items-center gap-5 ' : 'hidden'
            }`}
          >
            <span
              className='cursor-pointer hover:text-gray-200'
              onClick={() => {
                setSelectedFilters(tempFilters)
                setMobileFilterPanel(false)
              }}
            >
              APPLY
            </span>
            <span className='cursor-pointer hover:text-gray-200'>
              CLEAR ALL
            </span>
            <IoClose
              className='text-2xl cursor-pointer hover:text-gray-200'
              onClick={() => {
                setMobileFilterPanel(false)
                setTempFilters(selectedFilters)
              }}
            />
          </div>
        </div>
        <div
          className={`${
            mobileFilterPanel ? 'block bg-white border-0 px-4' : 'hidden'
          }`}
        >
          <FilterPanel
            {...{
              topcategory,
              midcategory,
              subcategory,
              search,
              selectedFilters,
              setSelectedFilters,
              tempFilters,
              setTempFilters,
              isMobile: true,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductListingPage
