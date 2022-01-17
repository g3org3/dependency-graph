import { Router } from '@reach/router'

import Layout from 'components/Layout'
import Welcome from 'pages/Welcome'
import Login from 'pages/Login'
import Home from 'pages/Home'

// const menuItems = []

const Routes = () => {
  return (
    <Router>
      <Layout title="Dep-Graph" by="Jorge Adolfo" homeUrl="/graph" menuItems={[]} path="/">
        <Home path="/graph" />
        <Login path="/login" />
        <Welcome default />
      </Layout>
    </Router>
  )
}

export default Routes
