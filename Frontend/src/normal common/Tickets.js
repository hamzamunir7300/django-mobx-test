import React from "react";
import Auth from "../auth";
import toaster from "toasted-notes";
import axios from "axios";
import { get_all_resturants_tickets_url, create_ticket_instance_url } from '../urls';
import Popup from 'reactjs-popup';
import TicketsRow from "./TicketsRow";
import CreateTicket from "./CreateTicket";

class Tickets extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			a: [],
			modal: false,
			id: null
		}
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

	postRequest = () => {
		const id = sessionStorage.getItem('rest-id');
		const tok = sessionStorage.getItem('key') || this.props.token;
		const url = `${get_all_resturants_tickets_url}${id}/tickets/`;
		const auth = {
			headers: {
				Authorization: `Token ${tok}`
			}
		};
		axios.get(url,auth)
		.then((response) => {
			console.log(response.data.data);
			this.setState({a:response.data.data})
		})
		.catch(error => {
			console.log(error.response);
			toaster.notify("Failed.", {
				duration: 4000,
				type: 'error'
			})
		});
	}
	
	componentDidMount() {
		this.postRequest();
	}

	rend = () => {
		const {a} = this.state;
		if (a.length !== 0) {
			return (
				<div>
					<div className="row mt-5 p-2 mx-4 text-center">
						<div className="col-4">
							<div className="tabl black">Name</div>
						</div>
						<div className="col-2">
							<div className="tabl black">Amount</div>
						</div>
						<div className="col-2">
							<div className="tabl black">Max Purchase</div>
						</div>
						<div className="col-2">
							<div className="tabl black">Sell Out</div>
						</div>
						<div className="col-2">
							{/* <div className="tabl black">Delete Button</div> */}
						</div>
					</div>
					<div className="row">
						{a.map(object => (
							<TicketsRow 
								key={object.id}
								id={object.id}
								name={object.name}
								amount={object.amount}
								maxPurchase={object.max_purchase}
								sellOut={object.sell_out}
								post={this.postRequest}
							/>
						))} 
					</div>
				</div>
			)
		}
		else {
			return (
				<h2 className="text-center black mt-5"> No Tickets Yet. Please Create One.</h2>
			)
		}
	}
	
	render() {
		return (

			<div className="container mt-4 text-center">
				<button className="button-white inner-glow inline abs" onClick={this.logout}>Logout</button>
				<h1>Manage Tickets</h1>
				<CreateTicket requestAgain={this.postRequest} />
				{this.rend()}
			</div>
		)
	}
}
export default Tickets;