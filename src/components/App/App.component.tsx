import Button from '@mui/material/Button'
import React, { createRef, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer'
import yaml from 'yaml'
import { toast } from 'react-hot-toast'

import { dependencyInYaml } from './example.yml'

const textareaRef: React.RefObject<HTMLTextAreaElement> = createRef()

const getRColor = () => Math.floor(Math.random() * 16777215).toString(16)

interface PreTicket {
  colorid?: number
  id: string
  notes?: string
  owner?: string
  parent?: string
  points?: number
  position?: string
  status?: string
}
interface Ticket extends PreTicket {
  colorid: number
}
interface TicketsById {
  [id: string]: Ticket
}
const getRoot = (byId: TicketsById, id: string): Ticket => {
  const ticket = byId[id]
  if (!ticket.parent) {
    return ticket
  }
  if (ticket.parent.indexOf(',') !== -1) {
    return ticket
  }
  return getRoot(byId, ticket.parent)
}

const OverviewFlow = () => {
  const [yamlText, setYaml] = useState<string | null>(null)
  const [rfINstance, setRFInstance] = useState(null)
  const [print, setPrint] = useState<string | null>(null)

  // @ts-ignore
  const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance)
    reactFlowInstance.fitView()
    setRFInstance(reactFlowInstance)
  }

  const loadYaml = () => {
    if (!!textareaRef.current) {
      toast.success('Dependency Loaded')
      setYaml(textareaRef.current.value)
    }
  }

  if (!yamlText) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', padding: '20px' }}>
        <textarea ref={textareaRef} style={{ height: '50vh', width: '50%' }} defaultValue={dependencyInYaml} />
        <Button size="large" variant="contained" onClick={loadYaml}>
          load
        </Button>
      </div>
    )
  }

  const tickets = yaml.parse(yamlText)
  const ticketsById = tickets.reduce((_: {}, t: PreTicket): TicketsById => ({ ..._, [t.id]: { ...t, colorid: getRColor() } }), {})

  const generateNodes = (ticket: PreTicket, i: number) => {
    const backgrounds: { [key: string]: string } = {
      default: '#f8f8f8',
      doing: 'orange',
      done: 'green',
      return: 'red',
      todo: 'cornflowerblue',
    }
    const background = backgrounds[ticket.status || 'default']
    const position = { x: 0, y: i * 70 }
    if (ticket.position) {
      position.x = Number(ticket.position.split(',')[0])
      position.y = Number(ticket.position.split(',')[1])
    }
    let colorid = ticket.colorid || ticketsById[ticket.id].colorid
    if (!ticket.colorid && ticket.parent && ticket.parent.indexOf(',') === -1) {
      const t = getRoot(ticketsById, ticket.parent)
      console.log(ticket.id, t.id)
      colorid = t.colorid
    }
    return {
      id: ticket.id,
      status: ticket.status,
      notes: ticket.notes,
      owner: ticket.owner,
      points: ticket.points,
      colorid,
      data: {
        label: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'space-between' }}>
              <b
                style={{
                  background,
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
                  background: '#fff',
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
            {ticket.owner ? <small style={{
              background: '#fff',
              textAlign: 'center',
              padding: '4px',
              borderRadius: '14px'
            }}>{ticket.owner}</small>
              : null}
            <small
              style={{
                textTransform: 'capitalize',
                background: '#fff',
                textAlign: 'left',
                padding: '4px',
              }}
            >
              {ticket.notes}
            </small>
          </div>
        ),
      },
      position,
      style: {
        border: '1px solid #' + colorid,
        background: '#' + colorid,
      },
    }
  }

  const generateLinks = (ticket: PreTicket, i: number) => {
    if (!ticket.parent) return null

    if (ticket.parent.split(',').length > 1) {
      return ticket.parent
        .split(',')
        .map((parent) => parent.trim())
        .map((parent) => ({
          id: `${parent}-${ticket.id}`,
          source: parent,
          target: ticket.id,
          // type: "smoothstep"
          // animated: true
        }))
    }

    return {
      id: `${ticket.parent}-${ticket.id}`,
      source: ticket.parent,
      target: ticket.id,
      // type: "smoothstep"
      // animated: true
    }
  }

  const initialElements = [
    ...tickets.map(generateNodes),
    ...tickets.map(generateLinks).filter(Boolean).flat(),
  ]

  const show = () => {
    // @ts-ignore
    const byId = rfINstance.toObject().elements.reduce((_, e) => ({ ..._, [e.id]: e }), {})

    Object.keys(byId).forEach((key) => {
      const ticket = byId[key]
      if (!ticket.source || !ticket.target) return
      const child = byId[ticket.target]
      if (!child.parent) {
        child.parent = ticket.source
      } else {
        child.parent += ',' + ticket.source
      }
    })

    const tickets = Object.values(byId)
      //@ts-ignore
      .filter((t) => !t.source)
      .map((t) => {
        const o = {
          //@ts-ignore
          id: t.id,
          //@ts-ignore
          status: t.status,
          //@ts-ignore
          notes: t.notes,
          //@ts-ignore
          position: t.position ? `${Math.floor(t.position.x)},${Math.floor(t.position.y)}` : null,
          //@ts-ignore
          parent: t.parent,
          //@ts-ignore
          points: t.points,
          //@ts-ignore
          owner: t.owner,
          //@ts-ignore
          colorid: t.colorid,
        }
        return Object.keys(o)
          //@ts-ignore
          .filter((k) => !!o[k])
          //@ts-ignore
          .reduce((_, k) => ({ ..._, [k]: o[k] }), {})
      })

    let yamlContent = ""
    for (const id in tickets) {
      const ticket = tickets[id]
      yamlContent += "- "
      yamlContent += yaml.stringify(ticket).split('\n').join('\n  ')
      yamlContent += "\n"
    }
    setPrint(yamlContent)
  }

  if (print) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px', background: '#eee' }}>
          <Button variant="contained" onClick={() => setPrint(null)}>
            print
          </Button>
          <Button color="error" variant="outlined" onClick={() => { setYaml(null); setPrint(null) }}>
            reset
          </Button>
          <Button color="success" variant="outlined" onClick={() => setYaml(yamlText + '\n')}>
            change color
          </Button>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <pre>
            {print}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px', background: '#eee' }}>
        <Button variant="outlined" onClick={show}>
          print
        </Button>
        <Button color="error" variant="outlined" onClick={() => setYaml(null)}>
          reset
        </Button>
        <Button color="success" variant="outlined" onClick={() => setYaml(yamlText + '\n')}>
          change color
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
          elements={initialElements}
          onLoad={onLoad}
          snapToGrid
          snapGrid={[15, 15]}
        >
          <MiniMap
            //@ts-ignore
            nodeStrokeColor={(n) => {
              if (n.style?.background) return n.style.background
              return '#eee'
            }}
            //@ts-ignore
            nodeColor={(n) => {
              if (n.style?.background) return n.style.background
              return '#fff'
            }}
            nodeBorderRadius={2}
          />
          <Controls />
          <Background color="#eee" gap={16} />
        </ReactFlow>
      </div>
      <div></div>
    </div>
  )
}

export default OverviewFlow
