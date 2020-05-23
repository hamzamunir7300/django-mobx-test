import React from 'react';
import { get_ticket_purchase_list_url } from './urls';
import axios from "axios";
import toaster from "toasted-notes";
import PurchaseRow from './normal common/PurchaseRow';

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			a: []
		}
	}
	Request = () => {
		const url = get_ticket_purchase_list_url;
		axios.get(url)
		.then((response) => {
			console.log(response.data.data);
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

	render() {
		const {a} = this.state;
		return (
			<div className="App">
				<div className="container mt-4 text-center">
					<h1 className="black"> Purchase Your Favourite Tickets </h1>
					<div className="col-containerr mt-5">
						{a.map(object => (
							<PurchaseRow 
								key={object.id}
								price={object.amount}
								ticket={object.name}
								restaurant={object.restaurant_name}
								limit={object.max_purchase}
								sell={object.sell_out}
								coupon={object.ticket_coupon}
								request={this.Request}
							/>
						))} 
					</div>
				</div>
			</div>
		);
	}
}

export default App;
