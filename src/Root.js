import App from 'components/App'
import { ThemeProvider } from '@mui/material/styles'

import { theme } from './theme'

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  )
}

export default Root
