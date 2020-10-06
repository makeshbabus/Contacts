import React, { Component } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DuplicateIcon from '@material-ui/icons/FilterNone';
import Checkbox from '@material-ui/core/Checkbox';
import axios from "axios";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Typography from '@material-ui/core/Typography';

// Generate Order Data

function preventDefault(event) {
	event.preventDefault();
}



class Orders extends Component {

	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			page: 0,
			rowsPerPage: 5,
			selected: [],
			contactList: [],
			dialogOpen: false,
			name: "",
			number: "",
			location: "",
			inCount: "",
			outCount: "",
			id: "",
			clickRow: "",
			anchorE2: null,
			filterList: [],
		}
	}

	componentDidMount() {
		this.getContacts();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.searchText !== this.props.searchText) {
			if (this.props.searchText !== "") {
				let select = this.state.contactList.filter(
					rec => {
						let data = rec.name
						return data.toLowerCase().includes(this.props.searchText.toLowerCase())
					}

				)
				if (select.length > 0) {
					this.setState({ contactList: select })
				}
			} else {
				this.getContacts();
			}
		}
	}

	onlyUnique = (value, index, self) => {
		return self.indexOf(value) === index;
	}

	getContacts = () => {
		axios.get("/contacts").then(response => {
			this.setState({ contactList: response.data }, () => {
				var names = this.state.contactList.map(function (item) {
					return item['location'];
				});
				var unique = names.filter(this.onlyUnique);
				
				this.setState({ filterList: unique })
			});
		});
	}

	handleClick = (event, row) => {
		this.setState({ clickRow: row, anchorEl: event.currentTarget })
	}

	handleClose = () => this.setState({ anchorEl: null })

	handleChangePage = (event, newPage) => {
		//setPage(newPage);
		this.setState({ page: newPage });
	};

	handleClickOpenDialog = () => {
		this.setState({ id: "", dialogOpen: true })
	};

	handleCloseDialog = () => {
		this.setState({ dialogOpen: false })
	};

	handleClickE2 = event => this.setState({ anchorE2: event.currentTarget })
	handleCloseE2 = () => this.setState({ anchorE2: null })



	handleBackButtonClick = (event) => {
		//setPage(page - 1);
		this.setState({ page: this.state.page - 1 });
	};

	handleNextButtonClick = (event) => {
		//setPage(page + 1);
		this.setState({ page: this.state.page + 1 });
	};

	handleSaveDialog = () => {
		const Value =
		{
			"name": this.state.name,
			"location": this.state.location,
			"phone": this.state.number,
			"inCount": this.state.inCount,
			"outCount": this.state.outCount,
			"date": new Date().toISOString(),
		}

		if (this.state.id === "") {
			axios.post("/addcontact", Value).then(response => {
				if (response.status === 201) {
					this.getContacts();
					this.handleCloseDialog();
				}
			});
		} else {
			axios.patch("/contacts/" + this.state.id, Value).then(response => {
				this.getContacts();
				this.handleCloseDialog();
			});
		}
	}

	handleEditContact = (e) => {
		let row = this.state.clickRow
		this.setState({
			id: row.id, name: row.name, location: row.location, number: row.phone, inCount: row.inCount,
			outCount: row.outCount, date: row.date
		}, () => {
			this.setState({ dialogOpen: true, anchorEl: null });
		});
	}

	handleDelete = () => {
		let row = this.state.clickRow
		axios.delete("/contact/" + row.id).then(response => {
			this.getContacts();
			this.setState({ anchorEl: null });
		});
	}

	handleDuplicateContact = (e) => {
		let row = this.state.clickRow
		this.setState({
			id: "", name: row.name, location: row.location, number: row.phone, inCount: row.inCount,
			outCount: row.outCount, date: row.date
		}, () => {
			this.setState({ dialogOpen: true, anchorEl: null });
		});
	}


	handleSelect = (event, name) => {
		const selectedIndex = this.state.selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(this.state.selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(this.state.selected.slice(1));
		} else if (selectedIndex === this.state.selected.length - 1) {
			newSelected = newSelected.concat(this.state.selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				this.state.selected.slice(0, selectedIndex),
				this.state.selected.slice(selectedIndex + 1),
			);
		}

		//setSelected(newSelected);
		this.setState({ selected: newSelected });
	};

	textChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	handleFilter = (res) => {
		axios.get("/contacts").then(response => {
			this.setState({ contactList: response.data }, () => {
				if(res !== "none"){
					let select = this.state.contactList.filter(
						rec => {
							let data = rec.location
							return data.toLowerCase().includes(res.toLowerCase())
						}
					)
					if (select.length > 0) {
						this.setState({ contactList: select, anchorE2: null })
					}
					
				}else{
					this.setState({anchorE2: null })
				}

			});
		});
	}

	formatDate=(undate)=>{
		if(undate){
			let date = new Date(undate);
			return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
		}else{
			return null
		}
	}

	render() {
		const { anchorEl } = this.state
		const { anchorE2 } = this.state
		const isSelected = (name) => this.state.selected.indexOf(name) !== -1;

		return (
			<React.Fragment>
				<Toolbar>
					<Grid
						container
						direction="row"
						justify="center"
						alignItems="center"
					>
						<Grid item xs={6}>
							<Title>Contacts</Title>
						</Grid>
						<Grid item xs={6} style={{ textAlign: "right" }}>

							<span>Filter</span>
							<Tooltip title="Filter list">
								<IconButton aria-label="filter list" onClick={this.handleClickE2}>
									<FilterListIcon />
								</IconButton>
							</Tooltip>
							<Menu
								id="simple-menu"
								anchorEl={anchorE2}
								keepMounted
								open={Boolean(anchorE2)}
								onClose={this.handleCloseE2}
							>
								<MenuItem onClick={() => this.handleFilter("none")}>None</MenuItem>
								{this.state.filterList.length > 0 ? this.state.filterList.map(res => {
									return <MenuItem onClick={() => this.handleFilter(res)}>{res}</MenuItem>
								})
									: ""}
							</Menu>
							<Button variant="contained" color="primary" style={{ "width": "200px", textAlign: "right" }} onClick={this.handleClickOpenDialog}>
								Add Contact
     					</Button>

						</Grid>
					</Grid>
				</Toolbar>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Number</TableCell>
							<TableCell>Incoming Call Count</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Outgoing Call Count</TableCell>							
							<TableCell>Created Date</TableCell>
							<TableCell>
								<IconButton disabled={this.state.page === 0} aria-label="previous page"
									onClick={this.handleBackButtonClick}>
									{<KeyboardArrowLeft />}
								</IconButton>
								<IconButton
									disabled={this.state.page >= Math.ceil(this.state.contactList.length / this.state.rowsPerPage) - 1}
									aria-label="next page"
									onClick={this.handleNextButtonClick}
								>
									{<KeyboardArrowRight />}
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					{this.state.contactList && this.state.contactList.length > 0 ?
						<TableBody>
							{this.state.contactList
								.slice((this.state.page * this.state.rowsPerPage), (this.state.page * this.state.rowsPerPage + this.state.rowsPerPage))
								.map((row, index) => {
									const isItemSelected = isSelected(row.name);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow key={index} selected={isItemSelected}>
											<TableCell padding="checkbox">
												<Checkbox
													checked={isItemSelected}
													inputProps={{ 'aria-labelledby': labelId }}
													onClick={(event) => this.handleSelect(event, row.name)}
												/>
											</TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.phone}</TableCell>
											<TableCell align="center">{row.inCount}</TableCell>
											<TableCell >{row.location}</TableCell>
											<TableCell align="center">{row.outCount}</TableCell>											
											<TableCell>{this.formatDate(row.date)}</TableCell>
											<TableCell align="center">
												<div>
													<IconButton
														aria-label="more"
														aria-controls="long-menu"
														aria-haspopup="true"
														key={index}
														onClick={(event) => this.handleClick(event, row)}
													>
														<MoreHorizIcon />
													</IconButton>

													<Menu
														key={index}
														id="long-menu"
														anchorEl={anchorEl}
														keepMounted
														open={Boolean(anchorEl)}
														onClose={this.handleClose}
													>
														<MenuItem onClick={(e) => this.handleEditContact(e)}>
															<ListItemIcon style={{ minWidth: "30px" }}>
																<CreateIcon fontSize="small" />
															</ListItemIcon>

															<Typography variant="inherit">Edit Contact</Typography>
														</MenuItem>
														<MenuItem onClick={this.handleDelete}>
															<ListItemIcon style={{ minWidth: "30px" }}>
																<DeleteIcon fontSize="small" />
															</ListItemIcon>
												Delete Contact
											</MenuItem>
														<MenuItem onClick={this.handleDuplicateContact}>
															<ListItemIcon style={{ minWidth: "30px" }}>
																<DuplicateIcon fontSize="small" />
															</ListItemIcon>
												Duplicate
											</MenuItem>
													</Menu>
												</div>
											</TableCell>
										</TableRow>
									)
								})}
						</TableBody> : ""}
				</Table>

				<Dialog open={this.state.dialogOpen} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Contact Detail</DialogTitle>
					<DialogContent>
						<Grid container wrap="nowrap" alignItems="center" justify="flex-end">
							<Grid item>
								<Typography noWrap variant="body2">Name: </Typography>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									inputProps={{
										style: {
											padding: 5,
											margin: 0
										}
									}}
									name="name"
									variant="outlined"
									required
									id="name"
									value={this.state.name}
									onChange={this.textChange}
								/>
							</Grid>
						</Grid>
						<Grid container wrap="nowrap" alignItems="center" justify="flex-end">
							<Grid item>
								<Typography noWrap variant="body2">Number: </Typography>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									inputProps={{
										style: {
											padding: 5,
											margin: 0
										}
									}}
									onInput={(e) => {
										e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
									}}
									type="number"
									name="number"
									variant="outlined"
									required
									id="number"
									value={this.state.number}
									onChange={this.textChange}
								/>
							</Grid>
						</Grid>
						<Grid container wrap="nowrap" alignItems="center" justify="flex-end">
							<Grid item>
								<Typography noWrap variant="body2">Incoming Count: </Typography>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									inputProps={{
										style: {
											padding: 5,
											margin: 0
										}
									}}
									onInput={(e) => {
										e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
									}}
									type="number"
									name="inCount"
									variant="outlined"
									required
									id="inCount"
									value={this.state.inCount}
									onChange={this.textChange}
								/>
							</Grid>
						</Grid>
						<Grid container wrap="nowrap" alignItems="center" justify="flex-end">
							<Grid item>
								<Typography noWrap variant="body2">Location: </Typography>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									inputProps={{
										style: {
											padding: 5,
											margin: 0
										}
									}}
									name="location"
									variant="outlined"
									required
									id="location"
									value={this.state.location}
									onChange={this.textChange}
								/>
							</Grid>
						</Grid>
						<Grid container wrap="nowrap" alignItems="center" justify="flex-end">
							<Grid item>
								<Typography noWrap variant="body2">Outgoing Count: </Typography>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									inputProps={{
										style: {
											padding: 5,
											margin: 0
										}
									}}
									onInput={(e) => {
										e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
									}}
									type="number"
									name="outCount"
									variant="outlined"
									required
									id="outCount"
									value={this.state.outCount}
									onChange={this.textChange}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCloseDialog} color="primary">
							Cancel
          </Button>
						<Button onClick={this.handleSaveDialog} color="primary">
							Save
          </Button>
					</DialogActions>
				</Dialog>
			</React.Fragment >
		);
	}
}

export default Orders