import { configureStore } from '@reduxjs/toolkit'

import reducers from './reducers'

export default configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['app/setTickets', 'app/setRFInstance', 'app/setFileHandler'],
        // Ignore these field paths in all actions
        // ignoredActionPaths: ['payload.notes.date'],
        // Ignore these paths in the state
        ignoredPaths: ['app.ticketsById', 'app.fileHandler', 'app.rfInstance'],
      },
    }),
})
