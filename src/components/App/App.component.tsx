import Button from '@mui/material/Button'
import React, { createRef, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer'
import yaml from 'js-yaml'
import { toast } from 'react-hot-toast'

import { generateNodes, generateLinks, getTicketsToById } from './App.service'
import type { PreTicket, TicketsById, Ticket } from './App.service'
import { dependencyInYaml } from './example.yml'
import { useFile } from './App.hook'
import { rfInstanceToYaml } from './rfinstance.service'

const textareaRef: React.RefObject<HTMLTextAreaElement> = createRef()

const OverviewFlow = () => {
  const [rfINstance, setRFInstance] = useState(null)
  const [print, setPrint] = useState<string | null>(null)
  const [elements, setElements] = useState<Array<Ticket> | null>(null)
  // const [] = useFile()

  // @ts-ignore
  const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance)
    reactFlowInstance.fitView()
    setRFInstance(reactFlowInstance)
  }

  const loadTickets = (ymlText: string) => {
    // @ts-ignore
    const tickets: Array<PreTicket> = yaml.load(ymlText)
    const ticketsById = getTicketsToById(tickets)
    // @ts-ignore
    const initialElements: Array<Ticket> = [
      ...tickets.map(generateNodes(ticketsById)).filter(Boolean),
      ...tickets.map(generateLinks).filter(Boolean).flat(),
    ]
    setElements(initialElements)
  }

  const loadYaml = () => {
    if (!!textareaRef.current) {
      loadTickets(textareaRef.current.value)
      toast.success('Dependency Loaded')
    }
  }
  const reloadApp = () => {
    if (elements) {
      const newyml = rfInstanceToYaml(rfINstance, { removeColor: true })
      loadTickets(newyml)
      toast.success('refresh')
    }
  }
  const show = () => {
    // @ts-ignore
    const ymlContent = rfInstanceToYaml(rfINstance)
    setPrint(ymlContent)
  }

  if (!elements) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', padding: '20px' }}>
        <textarea ref={textareaRef} style={{ height: '50vh', width: '50%' }} defaultValue={dependencyInYaml} />
        <Button size="large" variant="contained" onClick={loadYaml}>
          load
        </Button>
      </div>
    )
  }

  if (print) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px', background: '#eee' }}>
          <Button variant="contained" onClick={() => setPrint(null)}>
            print
          </Button>
          <Button color="error" variant="outlined" onClick={() => { setElements(null); setPrint(null) }}>
            reset
          </Button>
          <Button color="success" variant="outlined" onClick={() => reloadApp()}>
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
        <Button color="error" variant="outlined" onClick={() => setElements(null)}>
          reset
        </Button>
        <Button color="success" variant="outlined" onClick={() => reloadApp()}>
          change color
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
          // @ts-ignore
          elements={elements}
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
