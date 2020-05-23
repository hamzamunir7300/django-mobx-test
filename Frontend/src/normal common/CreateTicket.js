import React, { useState } from "react";
import Popup from "reactjs-popup";
import toaster from "toasted-notes";
import axios from "axios";
import { create_ticket_instance_url } from "../urls";

const CreateTicket = ({requestAgain}) => {

	const [Modal,setModal] = useState(false);
	const [Name, setName] = useState('');
	const [Purchase, setPurchase] = useState('');
	const [Amount, setAmount] = useState('');
 
	const openModal = () => {
		setModal(true);
	}
	const closeModal = () => {
		setModal(false);
	}
	const getName = (e) => {
		let x = e.target.value;
		setName(x);
	}
	const getPurchase = (e) => {
		let x = e.target.value;
		setPurchase(x);
	}
	const getAmount = (e) => {
		let x = e.target.value;
		setAmount(x);
	}
	const request = (event) => {
		event.preventDefault();
		const id = sessionStorage.getItem('rest-id');
		const tok = sessionStorage.getItem('key') || this.props.token;
		const url = `${create_ticket_instance_url}${id}/ticket/`;
		console.log(url);
		const data = {name: Name, max_purchase: Purchase, amount: Amount};
		console.log(data);
		const auth = {
			headers: {
				Authorization: `Token ${tok}`
			}
		};
		axios.post(url,data,auth)
		.then((response) => {
			console.log(response.data.data);
			toaster.notify("Ticket Added Successfully.", {
				duration: 3000,
				type: 'success' 
			})
			closeModal();
			requestAgain();
			
		})
		.catch((error) => {
			console.log(error);
			toaster.notify("Something isn't right.", {
				duration: 3000,
				type: 'error' 
			})
		})
	}

	return (
		<div>
			<button className="button inner-glow mt-3" onClick={openModal}>Create Ticket</button>
			<Popup
				open={Modal}
				closeOnDocumentClick
				onClose={closeModal}
			>
				<div className="modall">
					<a className="close" onClick={closeModal}>
						&times;
					</a>
					<h1 className="header"> Create Ticket </h1>
					<p className="content text-center">
						Please write the name of your restaurant and press Create button to register your restaurant.
					</p>
					<form className="actions" onSubmit={request}>
						<div>
							<input className="email-input" type="text" placeholder="Ticket's Name" onChange={getName} required/>
						</div>
						<div>
							<input className="email-input" type="number" placeholder="Max Purchase" onChange={getPurchase} required/>
						</div>
						<div>
							<input className="email-input" type="number" placeholder="Amount" onChange={getAmount} required/>
						</div>
						<div>
							<button className="button mb-3" type="submit">
								Create
							</button>
						</div>
						<span
							className="nothanks"
							onClick={closeModal}
						>
							Back To Page
						</span>
					</form>
				</div>
			</Popup>
		</div>
	)
}
export default CreateTicket;