/**
 * The external imports
 */
import { Icon } from '@chakra-ui/react'
import { FC } from 'react'

/**
 * The internal imports
 */
import { IconProps } from '@/types'

const DownloadIcon: FC<IconProps> = props => (
  <Icon viewBox='0 0 16 16' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12.4127 7.05955L13.131 7.75099L8.22719 12.8454L3.13283 7.94153L3.82427 7.22322L7.69079 10.9402L7.51769 1.85688L8.51751 1.83782L8.69061 10.9212L12.4127 7.05955ZM13.2644 14.7497L13.2263 12.7501L14.2261 12.731L14.2642 14.7307C14.2693 14.9958 14.1688 15.2522 13.9848 15.4432C13.8009 15.6343 13.5486 15.7445 13.2834 15.7495L3.28526 15.9401C3.02009 15.9451 2.76377 15.8446 2.5727 15.6607C2.38162 15.4768 2.27144 15.2245 2.26639 14.9593L2.22828 12.9597L3.2281 12.9406L3.2662 14.9403L13.2644 14.7497Z'
      fill='currentColor'
    />
  </Icon>
)

export default DownloadIcon
