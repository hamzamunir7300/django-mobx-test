import React from "react";
import { delete_specific_resturants_tickets_url } from "../urls";
import axios from "axios";
import toaster from "toasted-notes";

class TicketsRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}
	deleteRequest = () => {
		const id = this.props.id;
		const rest_id = sessionStorage.getItem('rest-id');
		const post = this.props.post;
		const tok = sessionStorage.getItem('key') || this.props.token;
		console.log(tok);
		const url = `${delete_specific_resturants_tickets_url}${rest_id}/ticket_id/`;
		const auth = {
			headers: {
				Authorization: `Token ${tok}`
			},
			params: {
				id: id
			}
		};
		axios.delete(url,auth)
		.then((response) => {
			console.log(response.data);
			toaster.notify("Successfully Deleted.", {
				duration: 3000,
				type: 'success' 
			})
			post();
		})
		.catch((error) => {
			console.log(error);
			toaster.notify("Deletion Failed.", {
				duration: 3000,
				type: 'error' 
			})
		})
	}
	

render() {
	const name = this.props.name;
	const amount  = this.props.amount;
	const maxPurchase = this.props.maxPurchase;
	const sellOut  = this.props.sellOut;

	return (
		<div className="col-12 pt-3">
			<div className="row bg-blue border-radius p-2 mx-4 text-center">
				<div className="col-4">
					<div className="tabl">{name}</div>
				</div>
				<div className="col-2">
					<div className="tabl">{amount}</div>
				</div>
				<div className="col-2">
					<div className="tabl">{maxPurchase}</div>
				</div>
				<div className="col-2">
					<div className="tabl">{sellOut}</div>
				</div>
				<div className="col-2">
					<button className="button-white" onClick={this.deleteRequest}>Delete</button>
				</div>
			</div>
		</div>
	)}
}
export default TicketsRow;
