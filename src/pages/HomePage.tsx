import { useTranslation } from 'react-i18next'
import Header from '../component/Header'

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Header />
      <h1 className='bg-amber-900 p-4 text-white'>{t('home.welcome')}</h1>
    </div>
  )
}

export default HomePage
