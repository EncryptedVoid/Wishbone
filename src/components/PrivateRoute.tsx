import React, { ReactNode } from 'react'
import { UserAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { session } = UserAuth()

  if (session === null) {
    return <Navigate to="/signup" />
  }

  return <>{children}</>
}

export default PrivateRoute
