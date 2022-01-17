import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

import Routes from 'components/Routes'
import { AuthProvider } from 'config/auth'
import theme from 'config/theme'

const Root = () => {
  return (
    <AuthProvider>
      <ColorModeScript />
      <ChakraProvider theme={theme}>
        <Routes />
      </ChakraProvider>
    </AuthProvider>
  )
}

export default Root
