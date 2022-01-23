import { Router } from '@reach/router'

import Layout from 'components/Layout'
import Home from 'pages/Home'
import Login from 'pages/Login'
import Welcome from 'pages/Welcome'

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
