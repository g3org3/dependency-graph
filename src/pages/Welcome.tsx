import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FC, useEffect, useState, useCallback } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import yaml from 'js-yaml'
import { FaMagic } from 'react-icons/fa'
import { useDispatch } from 'react-redux'

import { dependencyInYaml } from 'services/examples'
import { generateLinks, getPreTicketsToById } from 'services/tickets'
import { generateNodes } from 'services/node'
import { actions, PreTicket, Ticket } from 'modules/App'
import { navigate } from '@reach/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { getFileName, openAndChooseFile } from 'services/file'
import { useAuth } from 'config/auth'
import { dbOnValue } from 'config/firebase'

interface Props {
  default?: boolean
  path?: string
}

interface FirebaseFile {
  id: string
  name: string
  depYaml: string
}

const Empty: FC<Props> = () => {
  const dispatch = useDispatch()
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  const toast = useToast()
  const { currentUser } = useAuth()
  const [files, setFiles] = useState<Array<FirebaseFile>>([])
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [fileid, setFileid] = useState(null)

  const loadTickets = useCallback(
    (ymlText: string) => {
      // @ts-ignore
      const preTickets: Array<PreTicket> = yaml.loadAll(ymlText).flat()
      const ticketsById = getPreTicketsToById(preTickets)

      // @ts-ignore
      const tickets: Array<Ticket> = [
        ...preTickets.map(generateNodes(ticketsById, 'off')).filter(Boolean),
        ...preTickets.map(generateLinks).flat().filter(Boolean),
      ]

      dispatch(actions.setTickets({ tickets }))
      navigate('/graph')
      toast({ title: 'Dependency Graph Loaded', status: 'success' })
    },
    [toast, dispatch]
  )

  useHotkeys('o', () => {
    openAndChooseFile()
      .then(({ fileHandler, content }) => {
        dispatch(actions.setFileHandler(fileHandler))
        const filename = getFileName(fileHandler)
        dispatch(actions.setFileName(filename))
        loadTickets(content)
      })
      .catch((err) => {})
  })

  const readExternalFile = useCallback(() => {
    if (fileid) {
      const [file] = files.filter((f) => f.id === fileid)
      dispatch(actions.setFileName(file.name))
      loadTickets(file.depYaml)
    }
    onClose()
  }, [onClose, fileid, files, dispatch, loadTickets])

  useEffect(() => {
    if (currentUser) {
      dbOnValue(
        `/users/${currentUser.uid}/dgraphs`,
        (snapshot: any) => {
          const data = snapshot.val()
          if (!data) return
          const files: Array<FirebaseFile> = Object.values(data)
          if (files.length === 0) return
          setFiles(files)
          onOpen()
        },
        {}
      )
    }
  }, [currentUser, onOpen])

  const handleSelectFileChange = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      // @ts-ignore
      setFileid(e.target.value)
    },
    [setFileid]
  )

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select File</ModalHeader>
          <ModalBody>
            <Select onChange={handleSelectFileChange} placeholder="Select option">
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={readExternalFile}
              bg={useColorModeValue('teal.300', 'teal.800')}
              _hover={{ bg: useColorModeValue('teal.200', 'teal.700') }}
              _active={{ bg: useColorModeValue('teal.400', 'teal.900') }}
            >
              Choose
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <Heading as="h2">
          <span>👋🏼 </span> Welcome
        </Heading>
        <br />
        <Flex mb={4} alignItems="flex-end">
          <Text>Here is an example of dependency graph in yaml</Text>
          <Spacer />
          <Button onClick={() => loadTickets(dependencyInYaml)} leftIcon={<FaMagic />} size="sm">
            Load Dependency
          </Button>
        </Flex>
        <SyntaxHighlighter
          customStyle={{
            width: '90vw',
            height: '50vh',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
            border: '1px solid #ccc',
          }}
          language="yaml"
          style={theme}
        >
          {dependencyInYaml}
        </SyntaxHighlighter>
      </Box>
    </>
  )
}

export default Empty
