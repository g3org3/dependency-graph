import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Root from 'components/Root'
import store from 'modules/store'
import 'index.css'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
