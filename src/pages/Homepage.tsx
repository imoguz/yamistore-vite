import Banner from '../components/homepage/Banner'
import Gifts from '../components/homepage/Gifts'
import Bestsellers from '../components/homepage/Bestsellers'
import NewArrivals from '../components/homepage/NewArrivals'

const Homepage = () => {
  return (
    <div className='max-w-screen-2xl flex flex-col mx-auto gap-5 mb-5'>
      <div className='w-full'>
        <Banner />
      </div>
      <div className='w-full'>
        <Gifts />
      </div>
      <div className='w-full'>
        <Bestsellers />
      </div>
      <div className='w-full'>
        <NewArrivals />
      </div>
    </div>
  )
}

export default Homepage
