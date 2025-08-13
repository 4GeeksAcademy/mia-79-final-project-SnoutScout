import { Navigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

const PrivateRoute = ({ children }) => {
  const { store } = useGlobalReducer();

  // Check if user is authenticated
  if (!store.user || !store.token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default PrivateRoute;