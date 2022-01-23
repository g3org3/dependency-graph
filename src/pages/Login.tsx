import { Button, Flex, useColorModeValue, useToast } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import { FC } from 'react'
import { FcGoogle } from 'react-icons/fc'

import { useAuth } from 'config/auth'

interface Props {
  path?: string
}

const Login: FC<Props> = (props) => {
  const btnBackground = useColorModeValue('gray.200', 'blue.800')
  const toast = useToast()
  const navigate = useNavigate()
  const { currentUser, loginWithGoogle } = useAuth()

  if (currentUser) {
    navigate('/')

    return null
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      toast({
        title: 'Error to login',
        // @ts-ignore
        description: err.message,
        status: 'error',
      })
    }
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Flex direction="column" gap={2} minWidth={{ base: '', md: '400px' }}>
        <Button leftIcon={<FcGoogle />} onClick={handleLogin} bg={btnBackground}>
          Log in
        </Button>
      </Flex>
    </Flex>
  )
}

export default Login
