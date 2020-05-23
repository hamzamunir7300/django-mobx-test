import React from 'react';
// import PropTypes from 'prop-types';
// import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import Login from './normal common/Login';
import SignUp from './normal common/SignUp';
import Dashboard from './container components/Dashboard';
import { ProtectedRoute } from './protectedRoute';
import Tickets from './normal common/Tickets';


const Root = () => (
<Router>
	<Switch>
		<Route exact path="/" component={App} />
		<Route exact path="/login" component={Login} />
		<Route path="/sign-up" component={SignUp} />
		<Route path="/tickets" component={Tickets} />
		<ProtectedRoute exact path="/dashboard" component={Dashboard} />
		<Route path="*" component={() => <h1 className="text-center mt-5">Error 404 <br/>Page Not Found</h1>} />
	</Switch>
</Router>
)

// Root.propTypes = {
//   store: PropTypes.object.isRequired
// }

export default Root;