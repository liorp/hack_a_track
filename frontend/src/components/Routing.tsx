import React from 'react'
import {
  BrowserRouter as Router, Redirect,
  Route,
  Switch
} from 'react-router-dom'
import About from 'components/About'
import Home from 'components/Home'
import PrivateRoute from 'components/PrivateRoute'
import Landing from 'components/Landing'
import {LoginStore} from "../store";

const routes = [
  { path: '/about', component: About },
  { path: '/home', component: Home },
  { path: '/landing', component: Landing }
]

function Routing (): JSX.Element {
  const user = LoginStore.useState(s => s.user)

  return (
    <Router>
      <Switch>
        {routes.map((route) => (<PrivateRoute key={route.path} path={route.path} component={route.component} />))}
        <Route path="/">
          {user ? <Redirect to="/home" /> : <Landing />}
        </Route>
      </Switch>
    </Router>
  )
}

export default Routing
