import { FaXTwitter, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa6'
import FooterNav from './FooterNav'

function Footer() {
  const socialMedia: ISocialMedia[] = [
    {
      icon: <FaXTwitter />,
      link: 'https://twitter.com/',
      label: 'X',
      color: '#242424',
    },
    {
      icon: <FaInstagram />,
      link: 'https://www.instagram.com/',
      label: 'Instagram',
      color: '#F08080',
    },
    {
      icon: <FaLinkedin />,
      link: 'https://www.linkedin.com/imoguz',
      label: 'Linkedin',
      color: '#0077b5',
    },
    {
      icon: <FaYoutube />,
      link: 'https://www.youtube.com',
      label: 'Youtube',
      color: 'red',
    },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className='flex flex-col pt-3  bg-gray-100 '>
      <section className='mx-auto'>
        <FooterNav />
      </section>
      <hr className='border-0 border-t border-gray-300 my-3 mx-80' />

      <section className='flex justify-center items-center h-12 gap-8 text-3xl'>
        {socialMedia.map((item) => (
          <a
            style={{ color: item.color }}
            className='hover:scale-110 transition-scale duration-300'
            key={item.label}
            href={item.link}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={item.label}
          >
            {item.icon}
          </a>
        ))}
      </section>
      <section className='flex justify-center items-center bg-gray-200 w-full h-8 text-xs'>
        {`© ${currentYear} YAMISTORE. All Rights Reserved.`}
      </section>
    </footer>
  )
}

export default Footer
