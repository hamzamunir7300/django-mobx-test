import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from './auth';
import toaster from "toasted-notes";

export const ProtectedRoute = ({ component: Component, ...rest}) => {
	const key = sessionStorage.getItem('key');

	const failed = () => {
		toaster.notify("Please Login First", {
			duration: 3000,
			type: 'error' 
		});
	}
	return (
		<Route
			{...rest}
			render = {props => {
				if (Auth.isAuthenticated() || key) { 
					return <Component {...props} />;
				}
				else {
					failed();
					return (
						<Redirect to = {{
							pathname: "/login",
							state: {
								from: props.location
								}
							}}
						/>
					)
				}
			}}
		/>
	);
};	