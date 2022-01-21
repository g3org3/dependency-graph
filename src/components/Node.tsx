import { FC } from 'react'

import { PreTicket } from 'modules/App'

interface Props {
  ticket: PreTicket
}

const backgrounds: { [key: string]: string } = {
  '0.': '#f8f8f8',
  '1.': 'pink',
  '2.': 'orange',
  '3.': 'yellow',
  '4.': 'cornflowerblue',
  '5.': 'green',
}

const Node: FC<Props> = ({ ticket }) => {
  const backgroundKey = Object.keys(backgrounds)
    .filter((key) => ticket.status?.indexOf(key) !== -1)
    .concat(['0.'])[0]
  const background = backgrounds[backgroundKey]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'space-between' }}>
        <b
          style={{
            background: backgrounds['0.'],
            border: '2px solid white',
            color: '#000',
            padding: '4px 8px',
            boxSizing: 'border-box',
            fontFamily: 'monospace',
          }}
        >
          {ticket.points || '_'}
        </b>
        <b
          style={{
            background: 'transparent',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            boxSizing: 'border-box',
            fontFamily: 'monospace',
          }}
        >
          {ticket.id}
        </b>
      </div>
      {ticket.owner ? (
        <small
          style={{
            background: 'blue',
            textAlign: 'center',
            padding: '4px',
            borderRadius: '14px',
          }}
        >
          {ticket.owner}
        </small>
      ) : null}
      {ticket.status ? (
        <small
          style={{
            background,
            textAlign: 'center',
            padding: '4px',
            borderRadius: '4px',
          }}
        >
          {ticket.status}
        </small>
      ) : null}
      <small
        style={{
          textTransform: 'capitalize',
          background: '#fff',
          textAlign: 'left',
          padding: '4px',
        }}
      >
        {ticket.notes?.indexOf('\n') !== -1 ? <pre>{ticket.notes}</pre> : ticket.notes}
      </small>
    </div>
  )
}

export default Node
