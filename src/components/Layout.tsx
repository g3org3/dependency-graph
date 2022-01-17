import React, { useCallback } from 'react'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import base64 from 'base-64'
import yaml from 'js-yaml'
import { useSelector, useDispatch } from 'react-redux'
import { FiX } from 'react-icons/fi'
import { Link as ReachLink, useNavigate } from '@reach/router'

import ColorModeSwitcher from 'components/ColorModeSwitcher'
import { useAuth } from 'config/auth'
import {
  selectFileHandler,
  selectFileName,
  selectIsTicketsEmpty,
  selectRFInstance,
  selectTickets,
} from 'modules/App/App.selectors'
import { actions } from 'modules/App'
import { useHotkeys } from 'react-hotkeys-hook'
import { getFileName, openAndSaveToFile, saveToFile } from 'services/file'
import { rfInstanceToYaml } from 'services/rfinstance'
import { generateLinks, getPreTicketsToById } from 'services/tickets'
import { generateNodes } from 'services/node'
import { dbSet } from 'config/firebase'

interface Props {
  title: string
  homeUrl?: string
  by?: string
  childrend?: React.ReactNode
  path?: string
  menuItems?: Array<{ path: string; label: string; icon: string }>
}

const Layout: React.FC<Props> = ({ homeUrl, children, title, by, menuItems }) => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const dispatch = useDispatch()
  const toast = useToast()
  const fileHandler = useSelector(selectFileHandler)
  const elements = useSelector(selectTickets)
  const fileName = useSelector(selectFileName)
  const rfInstance = useSelector(selectRFInstance)
  const navbarBackgroundColor = useColorModeValue('teal.300', 'teal.500')
  const dividerColor = useColorModeValue('gray.200', 'gray.700')
  const pagePadding = { base: '10px', md: '20px 40px' }
  const isEmpty = useSelector(selectIsTicketsEmpty)

  // @ts-ignore
  const saveFile = (e: any) => {
    e.preventDefault()

    const depYaml = rfInstanceToYaml(rfInstance)

    if (currentUser) {
      const { uid, displayName, email } = currentUser
      let name = fileName
      if (!fileName) {
        name = prompt('flie name?')
      }
      if (!name) return
      const name64 = base64.encode(name)
      const payload = {
        id: name64,
        name: name,
        depYaml,
      }

      dbSet(`/users/${uid}/dgraphs`, name64, payload)
      dbSet(`/users/${uid}`, 'displayName', displayName)
      dbSet(`/users/${uid}`, 'email', email)
      dbSet(`/users/${uid}`, 'id', uid)
    }

    if (!fileHandler) {
      openAndSaveToFile(depYaml)
        .then((fh) => {
          dispatch(actions.setFileHandler(fh))
          const fileName = getFileName(fh)
          dispatch(actions.setFileName(fileName))
          toast({ title: 'Saved', status: 'success' })
        })
        .catch((err) => {
          toast({
            title: 'Error to save file',
            description: err.message,
            status: 'error',
          })
        })

      return
    }

    saveToFile(fileHandler, depYaml)
      .then(() => {
        toast({ title: 'Saved', status: 'success' })
      })
      .catch((err) => {
        toast({
          title: 'Error to save file',
          description: err.message,
          status: 'error',
        })
      })
  }

  const loadTickets = (ymlText: string) => {
    // @ts-ignore
    const preTickets: Array<PreTicket> = yaml.loadAll(ymlText).flat()
    const ticketsById = getPreTicketsToById(preTickets)

    // @ts-ignore
    const tickets: Array<Ticket> = [
      ...preTickets.map(generateNodes(ticketsById)).filter(Boolean),
      ...preTickets.map(generateLinks).flat().filter(Boolean),
    ]

    dispatch(actions.setTickets({ tickets }))
    navigate('/graph')
  }

  const reloadApp = () => {
    if (elements) {
      const newyml = rfInstanceToYaml(rfInstance, { removeColor: true })
      loadTickets(newyml)
      toast({ title: 'refresh', status: 'success' })
    }
  }

  useHotkeys('ctrl+s', saveFile, [rfInstance, fileHandler, toast])
  useHotkeys('command+s', saveFile, [rfInstance, fileHandler, toast])

  const handleAuth = useCallback(() => {
    if (currentUser) {
      logout()
    } else {
      navigate('/login')
    }
  }, [logout, currentUser, navigate])

  const handleReset = useCallback(() => {
    dispatch(actions.reset())
  }, [dispatch])

  const pushDown = () => {
    dispatch(actions.push(true))
  }
  const pushUp = () => {
    dispatch(actions.push(false))
  }

  return (
    <>
      <Grid minH="100vh" minWidth="100vw" pt="48px">
        <Box
          bg={navbarBackgroundColor}
          position="fixed"
          top="0"
          display="flex"
          width="100vw"
          height="48px"
          alignItems="center"
          gap="10px"
          boxShadow="md"
          padding={pagePadding}
        >
          <Menu onClose={pushUp}>
            <MenuButton onClick={pushDown} variant="ghost" as={Button}>
              <Avatar src={currentUser?.photoURL || ''} size="sm" />
            </MenuButton>
            <MenuList>
              {menuItems?.map((item) => (
                <MenuItem key={item.path}>
                  <Link as={ReachLink} to={item.path} display="flex" gap={2}>
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </MenuItem>
              ))}
              {!isEmpty && (
                <MenuItem onClick={reloadApp} display="flex" gap={2}>
                  <span>🎨</span>
                  Change Colors
                </MenuItem>
              )}
              {!isEmpty && currentUser && (
                // @ts-ignore
                <MenuItem onClick={saveFile} display="flex" gap={2}>
                  <span>💾</span>
                  Save
                </MenuItem>
              )}
              {!isEmpty && (
                <MenuItem onClick={handleReset} display="flex" gap={2}>
                  <span>🚧</span>
                  Reset
                </MenuItem>
              )}
              {menuItems && <MenuDivider color={dividerColor} />}
              <MenuItem onClick={handleAuth} display="flex" gap={2}>
                <span>🔓</span>
                {currentUser ? 'Log out' : 'Log in'}
              </MenuItem>
            </MenuList>
          </Menu>
          <Flex grow={{ base: '1', md: '0' }} justifyContent="center">
            <Link as={ReachLink} to={homeUrl || '/'}>
              <Heading as="h1" size="md" display="flex" alignItems="center">
                {title}{' '}
                {by ? (
                  <>
                    <FiX size={13} /> {currentUser?.displayName || by}
                  </>
                ) : null}
              </Heading>
            </Link>
          </Flex>
          <Flex flexGrow={{ base: '0', md: '1' }} gap={3} justify="flex-end" alignItems="center">
            <ColorModeSwitcher />
          </Flex>
        </Box>
        <Flex padding={pagePadding} direction="column" height="50vh">
          {children}
        </Flex>
      </Grid>
    </>
  )
}

export default Layout
