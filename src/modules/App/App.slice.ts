import { createSlice } from '@reduxjs/toolkit'
import React from 'react'

import { getTicketsToById } from 'services/tickets'

export interface PreTicket {
  colorid?: string
  id: string
  notes?: string
  owner?: string
  parent?: string
  label?: string
  tag?: string
  points?: number
  position?: string
  status?: string
}

export interface Ticket extends PreTicket {
  colorid: string
  data: { label: React.ReactNode }
  style: string
}

export interface State {
  ticketsById: Map<string, Ticket>
  count: number
  rfInstance: any
  isRFpushed: boolean
  fileHandler: any
  fileName: string | null
}

export default createSlice({
  name: 'app',
  initialState: {
    count: 0,
    ticketsById: new Map(),
    rfInstance: null,
    isRFpushed: false,
    fileHandler: null,
    fileName: null,
  },
  reducers: {
    setTickets: (state: State, action: { type: string; payload: { tickets: Array<Ticket> } }) => {
      state.ticketsById = getTicketsToById(action.payload.tickets)
    },
    setRFInstance: (state: State, action: { type: string; payload: { rfInstance: any } }) => {
      state.rfInstance = action.payload.rfInstance
    },
    push: (state: State, action: { type: string; payload: boolean }) => {
      state.isRFpushed = action.payload
    },
    setFileHandler: (state: State, action: { type: string; payload: any }) => {
      state.fileHandler = action.payload
    },
    setFileName: (state: State, action: { type: string; payload: string }) => {
      state.fileName = action.payload
    },
    reset: (
      state: State,
      action: {
        type: string
      }
    ): void => {
      state.ticketsById = new Map()
      state.count = 0
      state.ticketsById = new Map()
      state.rfInstance = null
      state.isRFpushed = false
      state.fileHandler = null
      state.fileName = null
    },
  },
})
