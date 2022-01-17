import React from 'react'

interface Props {
  children: React.ReactNode
  value?: boolean | null | undefined
}

// @ts-ignore
const ShowIf: React.FC<Props> = ({ value, children }) => {
  return value && children ? children : null
}

export default ShowIf
