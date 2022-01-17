import { enableMapSet } from 'immer'

import app from './App'

enableMapSet()

const reducers = {
  app: app.reducer,
}

export default reducers
