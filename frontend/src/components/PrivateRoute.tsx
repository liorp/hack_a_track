import { Redirect, Route } from 'react-router-dom'
import * as React from 'react'
import { LoginStore } from 'store'

interface PrivateRouteProps {
  component: React.ElementType
  path: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, path, ...rest }) => {
  const user = LoginStore.useState(s => s.user)

  if (user == null && path !== "/landing") {
    return (
      <Redirect to='landing' />
    )
  }

  return (
    <Route
      {...rest}
      render={routeProps => (
        <Component {...routeProps} />
      )}
    />
  )
}

export default PrivateRoute
