import React from "react";
import { purchased_tickets_url } from "../urls";
import axios from "axios";
import toaster from "toasted-notes";

class PurchaseRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}
	
	purchaseRequest = () => {
		const request = this.props.request;
		const coupon  = this.props.coupon;
		console.log(coupon);
		const url = `${purchased_tickets_url}`;
		const data = { ticket_coupon: coupon }
		axios.post(url,data)
		.then((response) => {
			toaster.notify(response.data.status, {
				duration: 3000,
				type: 'success' 
			})
			request();
		})
		.catch((error) => {
			console.log(error.response);
			toaster.notify("Purchase Failed.", {
				duration: 3000,
				type: 'error' 
			})
		})
	}

render() {
	const ticket = this.props.ticket;
	const restaurant  = this.props.restaurant;
	const price = this.props.price;
	const limit = this.props.limit;
	const sell  = this.props.sell;

	return (
		<div className="coll">
			<div className="mainn bg-blue py-4">
				<h3>{ticket}</h3>
				<p className="text-white mt-3">Restaurant : {restaurant}</p>
				<p className="text-white">Price : {price}</p>
				<p className="text-white">Max Purchase Limit : {limit}</p>
				<p className="text-white">Sell Out : {sell}</p>
				<button className="button-white" onClick={this.purchaseRequest}>Purchase</button>
			</div>
		</div>
	)}
}
export default PurchaseRow;
