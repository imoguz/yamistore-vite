/* eslint-disable @typescript-eslint/no-explicit-any */

interface IAuthResult {
  status: 'success' | 'error'
  message: string
}

// Sign Up
interface ISignUpValues {
  firstName: string
  lastName: string
  email: string
  password: string
}
// Sign In
interface ISignInValues {
  email: string
  password: string
}

// Settings
interface IFormField {
  fieldName: string
  label: string
  type: string
  initialValue: string
  validationSchema: any
  action: any
}

// Header Interfaces
interface INavMenuItems {
  image: string
  mainMenu: string
  subMenu: ISubMenu[]
}

interface ISubMenu {
  name: string
  description: string
  image: string
  subMenuItems: string[]
}

interface IOpenDropdown {
  open: boolean
  menuName: string | null
  subMenu: ISubMenu[] | null
}

// Review interface
interface IReview {
  _id: string
  user_id: IUser
  product_id: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

// Color interface
interface IColor {
  _id: string
  name: string
  hex_code: string
  createdAt: Date
  updatedAt: Date
}

// Size interface
interface ISize {
  _id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Variant interface
interface IVariant {
  _id: string
  product_id: string
  color_id: IColor
  size_id: ISize
  image_url: string
  stock: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

// Image interface
interface IImage {
  url: string
  isMainImage: boolean
}

// Brand interface
interface IBrand {
  _id: string
  name: string
  description: string
  logo_url: string
  website_url: string
  createdAt: Date
  updatedAt: Date
}

// Category interface
interface ICategory {
  _id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Store interface
interface IStore {
  _id: string
  name: string
  slug: string
  description: string
  image_url: string
  logo_url: string
  createdAt: Date
  updatedAt: Date
}

// Discount interface
interface IDiscount {
  _id: string
  type: string
  amount: number
  start_date: Date
  end_date: Date
  createdAt: Date
  updatedAt: Date
}

// Promotion interface
interface IPromotion {
  _id: string
  code: string
  description: string
  type: string
  amount: number
  min_purchase: number
  expired_date: Date
  createdAt: Date
  updatedAt: Date
}

// Main Product interface
interface IProduct {
  _id: string
  name: string
  slug: string
  description: string
  brand: IBrand
  category: ICategory[]
  store: IStore[]
  price: number
  discount: IDiscount
  promotion: IPromotion
  variants: IVariant[]
  reviews: IReview[]
  images: IImage[]
  createdAt: Date
  updatedAt: Date
}

// Query params
interface IQuery {
  subcategory?: string | undefined
  midcategory?: string | undefined
  topcategory?: string | undefined
  search?: string | undefined
  page?: number
  limit?: number
  filteroptions?: ISelectedFilters
  sort?: { [string]: 1 | -1 }
}

// Api returning
interface IProductData {
  pageSize: number
  totalRecords: number
  pages: {
    total: number
    previous: number | boolean
    current: number
    next: number | boolean
  }
  data: IProduct[]
}

// Sort Menu
interface ISortMenu {
  open: boolean
  selectedOption: string
  field: string
  order: 1 | -1
}

interface ISortOptions {
  title: string
  field: string
  order: 1 | -1
}

interface ISelectedFilters {
  [key: string]: string[]
}

// Product detail page  - variant
interface ISelectedVariant {
  variantId: string | null
  size: string
  color: string | null
  colorName: string | null
  stock: number | null
  image: string | null
}

// cart interface
interface ICart {
  _id: string
  user_id: IUser
  product_id: IProduct
  variant_id: IVariant
  quantity: number
  status: 'pending' | 'completed' | 'canceled'
  orderDate: Date
}

interface INewCart {
  user_id: string
  product_id: string
  variant_id: string
  quantity: number
  status: 'pending' | 'completed' | 'canceled'
  orderDate: Date
}

interface IUpdateCartItem {
  data: {
    user_id?: string
    product_id?: string
    variant_id?: string
    quantity?: number
    status?: 'pending' | 'completed' | 'canceled'
    orderDate?: Date
  }
  cartId: string
}

// Wishlist
interface IWishlist {
  _id: string
  user_id: IUser
  product_id: IProduct
}

interface INewWishlist {
  user_id: string
  product_id: string
}

// Banner
interface IBanner {
  _id: string
  label: string
  description: string
  image_url: string
  link: string
}

// Gift
interface IGift {
  _id: string
  label: string
  description: string
  image_url: string
  hex_code: string
  path: string
}

// footer
interface ISocialMedia {
  icon: React.ReactNode
  link: string
  label: string
  color: string
}

interface IFooterData {
  section: string
  menuItems: string[]
}

// PLP FilterPanel
interface IFilterOptions {
  title: string
  options: string[] | []
}
