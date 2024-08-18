import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '../helpers/ScrollToTop'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import Homepage from '../pages/Homepage'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import ProductListingPage from '../pages/ProductListingPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import Checkout from '../pages/Checkout'
import Wishlist from '../pages/Wishlist'

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/'>
          <Route index element={<Homepage />} />
          <Route path='/plp' element={<ProductListingPage />} />
        </Route>
        <Route path='/pdp/:productID' element={<ProductDetailPage />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/account/profile' element={<Profile />} />
        <Route path='/account/settings' element={<Settings />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default Router
