import { ThemeProvider } from '@mui/material/styles'

import App from 'components/App'
import Layout from 'components/Layout'
import { theme } from './theme'

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <App />
      </Layout>
    </ThemeProvider>
  )
}

export default Root
