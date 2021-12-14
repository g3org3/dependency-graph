import React, { createRef, useState } from 'react'
import Button from '@mui/material/Button'
import yaml from 'yaml'

import ReactFlow, { removeElements, addEdge, MiniMap, Controls, Background } from 'react-flow-renderer'

const textareaRef = createRef()

const getRColor = () => Math.floor(Math.random() * 16777215).toString(16)

const getRoot = (byId, id) => {
  if (!byId[id].parent) {
    return byId[id]
  }
  if (byId[id].parent.indexOf(',') !== -1) {
    return byId[id]
  }
  return getRoot(byId, byId[id].parent)
}

const OverviewFlow = () => {
  const [elements, setElements] = useState([])
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els))
  const onConnect = (params) => setElements((els) => addEdge(params, els))
  const [yamlText, setYaml] = useState(null)
  const [rfINstance, setRFInstance] = useState(null)

  const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance)
    reactFlowInstance.fitView()
    setRFInstance(reactFlowInstance)
  }

  const loadYaml = () => {
    setYaml(textareaRef.current.value)
  }

  if (!yamlText) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <textarea ref={textareaRef} style={{ height: '50vh' }} />
        <Button variant="contained" onClick={loadYaml}>
          load
        </Button>
      </div>
    )
  }

  const tickets = yaml.parse(yamlText)
  const ticketsById = tickets.reduce((_, t) => ({ ..._, [t.id]: { ...t, colorid: getRColor() } }), {})

  const generateNodes = (ticket, i) => {
    const colors = {
      done: 'green',
      doing: 'orange',
      todo: 'blue',
      return: 'red',
    }
    const color = colors[ticket.status] || 'black'
    const backgrounds = {
      done: 'green',
      doing: 'orange',
      todo: 'purple',
      return: 'red',
    }
    const background = backgrounds[ticket.status] || '#f8f8f8'
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

  const generateLinks = (ticket, i) => {
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
      .filter((t) => !t.source)
      .map((t) => {
        const o = {
          id: t.id,
          status: t.status,
          notes: t.notes,
          position: t.position ? `${Math.floor(t.position.x)},${Math.floor(t.position.y)}` : null,
          parent: t.parent,
          points: t.points,
          owner: t.owner,
          colorid: t.colorid,
        }
        return Object.keys(o)
          .filter((k) => !!o[k])
          .reduce((_, k) => ({ ..._, [k]: o[k] }), {})
      })

    console.log(yaml.stringify(tickets))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
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
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={onLoad}
          snapToGrid
          snapGrid={[15, 15]}
        >
          <MiniMap
            nodeStrokeColor={(n) => {
              if (n.style?.background) return n.style.background

              return '#eee'
            }}
            nodeColor={(n) => {
              if (n.style?.background) return n.style.background

              return '#0F0'
            }}
            nodeBorderRadius={2}
          />
          <Controls />
          <Background color="#eee" gap={16} />
        </ReactFlow>
      </div>
    </div>
  )
}

export default OverviewFlow
