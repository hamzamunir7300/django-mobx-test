import React from "react";
import Auth from "../auth";
import toaster from "toasted-notes";
import RestaurantRow from "../normal common/RestaurantRow";
import axios from "axios";
import { get_all_resturants_url, create_resturant_instance_url } from '../urls';
import Popup from 'reactjs-popup';

class Dashboard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			a: [],
			modal: false,
			name: null,
			b: 1,
		}
	}
	openModal = () => {
		this.setState({modal: true})
	}
	closeModal = () => {
		this.setState({modal: false})
	}
	getName = (e) => {
		let x = e.target.value;
		this.setState({name: x});
	}
	logout = () => {
		sessionStorage.removeItem("key");
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("email");
		sessionStorage.removeItem("id");
		Auth.logout(() => {
			this.props.history.push("/login");
		});
		toaster.notify(" Logged Out ", {
			duration: 3000,
			type: 'success' 
		});
	}

	postRequest = (event) => {
		event.preventDefault();
		const tok = sessionStorage.getItem('key') || this.props.token;
		const url = create_resturant_instance_url;
		const data = {name: this.state.name};
		const auth = {
			headers: {
				Authorization: `Token ${tok}`
			}
		};
		axios.post(url, data, auth)
		.then((response) => {
			console.log(response);
			toaster.notify("Restaurant Registered.", {
				duration: 4000,
				type: 'error'
			});
			this.closeModal();
			this.Request();
		})
		.catch(error => {
			console.log(error.response);
			toaster.notify("Failed.", {
				duration: 4000,
				type: 'error'
			})
			this.closeModal();	
		});
	}
	Request = () => {
		const tok = sessionStorage.getItem('key') || this.props.token;
		console.log(tok);
		const url = get_all_resturants_url;
		const auth = {
			headers: {
				Authorization: `Token ${tok}`
			}
		};
		axios.get(url,auth)
		.then((response) => {
			// console.log(response.data.data);
			this.setState({a: response.data.data});
		})
		.catch((error) => {
			console.log(error);
			toaster.notify("Something isn't right.", {
				duration: 3000,
				type: 'error' 
			})
		})
	}
	
	componentDidMount() {
		this.Request();
	}

	rend = () => {
		const {a} = this.state;
		if (a.length !== 0) {
			return (
				<div className="row mt-3">
					{a.map(object => (
						<RestaurantRow 
							key={object.id}
							id={object.id}
							name={object.name}
							url={object.restaurants_url}
							owner={object.owner}
							post={this.Request}
						/>
					))} 
				</div>
			)
		}
		else {
			return (
				<h2 className="text-center black mt-5"> No Restaurants Yet. Please Create One. </h2>
			)
		}
	}
	
	render() {
		const {a} = this.state;
		const x = sessionStorage.getItem('key');
		const y = sessionStorage.getItem('user');
		const id = sessionStorage.getItem('id');
		const user = y || this.props.location.state.user;
		const tok = x || this.props.location.state.tok;
		return (

			<div className="container mt-4 text-center">
				<button className="button-white inner-glow inline abs" onClick={this.logout}>Logout</button>
				<h1>Manage Restaurants</h1>
				<p>To access any restaurant's ticket page, please click on restaurant's name.</p>
				<button className="button inner-glow" onClick={this.openModal}>Create Restaurant</button>
				<Popup
					open={this.state.modal}
					closeOnDocumentClick
					onClose={this.closeModal}
				>
					<div className="modall">
						<a className="close" onClick={this.closeModal}>
							&times;
						</a>
						<h1 className="header"> Register Restaurant </h1>
						<p className="content text-center">
							Please write the name of your restaurant and press Create button to register your restaurant.
						</p>
						<form className="actions" onSubmit={this.postRequest}>
							<div>
								<input className="email-input" type="text" placeholder="Restaurant's Name" onChange={this.getName} required/>
							</div>
							<div>
								<button className="button mb-3" type="submit">
									Create
								</button>
							</div>
							<span
								className="nothanks"
								onClick={this.closeModal}
							>
								Back To Page
							</span>
						</form>
					</div>
				</Popup>
				{this.rend()}
			</div>
		)
	}
}
export default Dashboard;