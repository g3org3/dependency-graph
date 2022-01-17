import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'

import Routes from 'components/Routes'
import { AuthProvider } from 'config/auth'

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
