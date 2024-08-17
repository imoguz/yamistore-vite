import { footerData } from './data'

export default function FooterNav() {
  return (
    <div className='flex gap-5'>
      {footerData.map((item, index) => (
        <div key={index}>
          <p>{item.section}</p>
          {item.menuItems.map((item, index) => (
            <p
              key={index}
              className='text-gray-600 hover:text-gray-950 cursor-pointer'
            >
              {item}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
