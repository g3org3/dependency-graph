import { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import Root from './Root'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
    <Root />
  </StrictMode>,
  rootElement
)
