import React from 'react'
import { Toaster } from 'react-hot-toast'

interface Props {
  children: React.ReactNode
}

const Layout = (props: Props) => {
  return <>
    <Toaster
      position="top-right"
      reverseOrder={true}
    />
    {props.children}
  </>
}

export default Layout