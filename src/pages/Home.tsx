import { Flex, useColorModeValue } from '@chakra-ui/react'
import { selectIsPushed, selectIsTicketsEmpty, selectTickets } from 'modules/App/App.selectors'
import { FC, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer'
import { navigate } from '@reach/router'
import { actions } from 'modules/App'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  path?: string
}

const Home: FC<Props> = (props) => {
  const dispatch = useDispatch()
  const elements = useSelector(selectTickets)
  const isEmpty = useSelector(selectIsTicketsEmpty)
  const isRFpushed = useSelector(selectIsPushed)
  const background = useColorModeValue('gray.100', 'gray.900')

  useEffect(() => {
    if (isEmpty) {
      navigate('/welcome')
    }
  }, [isEmpty])

  // @ts-ignore
  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView()
    dispatch(actions.setRFInstance({ rfInstance: reactFlowInstance }))
  }

  return (
    <AnimatePresence>
      <motion.div animate={{ y: isRFpushed ? 200 : 0 }} transition={{ duration: 0.2 }}>
        <Flex height="90vh" bg={background}>
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
        </Flex>
      </motion.div>
    </AnimatePresence>
  )
}

export default Home
