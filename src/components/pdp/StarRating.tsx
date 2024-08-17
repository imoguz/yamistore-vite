import React from 'react'
import { IoStarOutline, IoStarHalf, IoStar } from 'react-icons/io5'

interface IStarRatingProp {
  rating: number
}

const StarRating: React.FC<IStarRatingProp> = ({ rating }) => {
  const integerPart = Math.trunc(rating)
  const fractionalPart = rating - integerPart
  const totalStars = 5

  const stars = []

  for (let i = 0; i < integerPart; i++) {
    stars.push(<IoStar key={`star-${i}`} className='text-yellow-500' />)
  }

  if (fractionalPart > 0) {
    stars.push(<IoStarHalf key={'halfStar'} className='text-yellow-500' />)
  }

  const remainingStars = totalStars - stars.length

  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <IoStarOutline key={`starOutline-${i}`} className='text-gray-600' />
    )
  }

  return (
    <div className='flex gap-3 items-center'>
      <div className='flex gap-[1px] text-lg items-center'>{stars}</div>
      <span className='text-base '>{rating}</span>
    </div>
  )
}

export default StarRating
