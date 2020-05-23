import React from "react";
import axios from "axios";
import Auth from "../auth";
import toaster from "toasted-notes";
import {signup_url, login_url} from "../urls";

class SignUp extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false
		}
	}
	getEmail = (event) => {
		let x = event.target.value;
		this.setState({email:x});
	}
	getPass = (event) => {
		let x = event.target.value;
		this.setState({password:x});
	}
	getUser = (event) => {
		let x = event.target.value;
		this.setState({username:x});
	}
	success = (y) => {
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
	loginRequest = () => {
		const url = login_url;
		const data = {username:this.state.username , password:this.state.password};
		axios.post(url,data)
		.then((response) => 
			this.success(response)
		)
		.catch(() => {
			this.setState({loading:false});
			toaster.notify("Some Error.", {
			duration: 3000,
			type: 'error' 
		  })
		})
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
	redirect = () => {
		toaster.notify("Account Created Succesfully.", {
			duration: 4000,
			type: 'success'
		})
		this.loginRequest();
	}
	postRequest = (event) => {
		event.preventDefault();
		const url = signup_url;
		const data = {username:this.state.username, email:this.state.email , password:this.state.password};
		axios.post(url, data)
		.then((response) => {
			console.log(response);
			this.redirect();
		})
		.catch(error => {
			console.log(error.response);
			toaster.notify("Failed.", {
				duration: 4000,
				type: 'error'
			})
		});
	}

	render() {
		return (
			<div>
				<div className="heightmaxx container special-margin rel">
					<div className="col-container">
						<div className="box xx text-center p-5">
							<form onSubmit={this.postRequest} autoComplete="on">
								<h2 className="black">Register Your Account</h2>
								<div className="mt-5 mb-3">
									<input className="input" autoComplete="username" name="username" type="text" size="60" placeholder="Username" onChange={this.getUser} required />
								</div>
								<div className="my-3">
									<input className="input" autoComplete="email" name="email" type="email" size="60" placeholder="Email" onChange={this.getEmail} required />
								</div>
								<div className="my-3">
									<input className="input" autoComplete="password" name="password" type="password" size="60" placeholder="Password" onChange={this.getPass} required />
								</div>
								<div className="mt-5 mb-3">
									<button className="button" type="submit">Register</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default SignUp;