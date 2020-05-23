import React from "react";
import { Link } from "react-router-dom";
import { delete_specific_resturants_url } from "../urls";
import axios from "axios";
import toaster from "toasted-notes";

class RestaurantRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}
	deleteRequest = () => {
		const id = this.props.id;
		const post = this.props.post;
		const tok = sessionStorage.getItem('key') || this.props.token;
		console.log(tok);
		const url = `${delete_specific_resturants_url}${id}/`;
		const auth = {
			headers: {
				Authorization: `Token ${tok}`
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
	setId = () => {
		sessionStorage.setItem('rest-id', this.props.id);
	}
	

render() {
	const name = this.props.name;
	const url = this.props.url;
	const id = this.props.id;
	const owner = this.props.owner;

	return (
		<div className="col-12 pt-3">
			<div className="row bg-blue border-radius p-2 mx-4 text-center">
				<div className="col-10">
					<Link to={
						{pathname:"/tickets", state:{id}}
					} onClick={this.setId}>
						<div className="tabl inner-glow">{name}</div>
					</Link>
				</div>
				<div className="col-2">
					<button className="button-white" onClick={this.deleteRequest}>Delete</button>
				</div>
			</div>
		</div>
	)}
}
export default RestaurantRow;
