import React from "react";
import axios from "axios";
import Auth from "../auth";
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css";
import {login_url} from '../urls';

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		};
	}
	getEmail = (event) => {
		let x = event.target.value;
		this.setState({username:x});
	}
	getPass = (event) => {
		let x = event.target.value;
		this.setState({password:x});
	}
	login = (x) => {
		Auth.login(() => {
			this.props.history.push({
				pathname:"/dashboard",
				state: {
					username: x.data.user.username,
					token: x.data.token,
				}
			})
		})
	}
	success = (y) => {
		console.log(y);
		toaster.notify(" Login Successful ", {
			duration: 3000,
			type: 'success' 
		});
		if (y) {
			sessionStorage.setItem('key', y.data.token);
			sessionStorage.setItem('email', y.data.user.email);
			sessionStorage.setItem('user', y.data.user.username);
			sessionStorage.setItem('id', y.data.user.id);
		}
		if (y) {
			this.login(y);
		}
	}
	Request = (event) => {
		event.preventDefault();
		const url = login_url;
		const data = {username:this.state.username , password:this.state.password};
		axios.post(url,data)
		.then((response) => 
			this.success(response)
		)
		.catch((error) => {
			console.log(error);
			toaster.notify("Invalid Credentials", {
				duration: 3000,
				type: 'error' 
		  })
		})
	}

	render() {
			return (
				<div>
					<div className="heightmaxx container special-margin rel">
						<div className="col-container">
							<div className="box xx text-center p-5">
								<form onSubmit={this.Request} autoComplete="on">
									<h2 className="black">Login to your Account</h2>
									<div className="my-5">
										<input className="input" name="email" type="username" size="60" placeholder="Email" onChange={this.getEmail} required />
									</div>
									<div className="my-2">
										<input className="input" name="password" type="password" size="60" placeholder="Password" onChange={this.getPass} required />
									</div>
									<div className="mt-5 mb-3">
										<button className="button" type="submit">Login</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			);
		}
}
export default Login;