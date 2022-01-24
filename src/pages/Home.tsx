import { Flex, useColorModeValue } from '@chakra-ui/react'
import { navigate } from '@reach/router'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background, addEdge, removeElements } from 'react-flow-renderer'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSelector, useDispatch } from 'react-redux'

import ButtonEdge from 'components/ButtonEdge'
import { actions, Ticket } from 'modules/App'
import { selectIsPushed, selectIsTicketsEmpty, selectTickets } from 'modules/App/App.selectors'
interface Props {
  path?: string
}

const edgeTypes = {
  buttonedge: ButtonEdge,
}

const Home: FC<Props> = (props) => {
  const dispatch = useDispatch()
  const elements = useSelector(selectTickets)
  const isEmpty = useSelector(selectIsTicketsEmpty)
  const isRFpushed = useSelector(selectIsPushed)
  const background = useColorModeValue('white', 'gray.800')
  const bgPointsColor = useColorModeValue('#000', '#999')
  const [showMinmap, setShowMinimap] = useState(true)

  useHotkeys('m', () => setShowMinimap(!showMinmap), [showMinmap])

  useEffect(() => {
    if (isEmpty) {
      navigate('/welcome')
    }
  }, [isEmpty])

  const onElementsRemove = (elementsToRemove: Array<Ticket>) => {
    // @ts-ignore
    const newElements: Array<Ticket> = removeElements(elementsToRemove, elements)
    dispatch(actions.setTickets({ tickets: newElements }))
  }
  const onConnect = (params: Array<Ticket>) => {
    // @ts-ignore
    const newElements: Array<Ticket> = addEdge(params, elements)
    dispatch(actions.setTickets({ tickets: newElements }))
  }

  // @ts-ignore
  const onLoad = (reactFlowInstance) => {
    setTimeout(() => {
      reactFlowInstance.fitView()
    }, 0)
    dispatch(actions.setRFInstance({ rfInstance: reactFlowInstance }))
  }

  return (
    <Flex height="calc(100vh - 88px)" bg={background}>
      <ReactFlow
        // @ts-ignore
        elements={elements}
        onLoad={onLoad}
        snapToGrid
        snapGrid={[15, 15]}
        edgeTypes={edgeTypes}
        // @ts-ignore
        onElementsRemove={onElementsRemove}
        // @ts-ignore
        onConnect={onConnect}
        deleteKeyCode={8} /* 'delete'-key */
        key="edge-with-button"
      >
        {showMinmap ? (
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
        ) : null}
        <Controls />
        <Background color={bgPointsColor} gap={16} />
      </ReactFlow>
    </Flex>
  )
}

export default Home
