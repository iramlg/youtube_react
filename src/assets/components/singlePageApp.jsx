import React from 'react';
import {Videos} from './videos.jsx';
import {Home} from './home.jsx';

export class SinglePageApp extends React.Component {
	constructor(){
		super();
		this.state = {
			page: 'home'
		}
	}

	handleFocus() {
		this.setState({
			searchFocus: true
		})
	}

	handleSearch(e) {
		if ((e.key == 'Enter') && $(e.target).val().length) {
			this.setState({
				page: 'videos',
				searchTerm:$(e.target).val()  
			})
		}
		
	}

	setPage(page) {
		if (page == this.state.page)
			return;

		this.setState({
			page: page
		})
	}

	render() {
		let s = this.state;
		let pages = {
			home: <Home setPage={this.setPage.bind(this)} />,
			videos: <Videos term={s.searchTerm} />
		};

		return (
			<div>
				<div className="header">
					<div className="container-fluid">
						<img src="public/img/logo.png" />
						<div className="links-header pull-right">
							<div className={s.searchFocus ? "input-group header-search focus" : "input-group header-search"}>
								<input type="text" className="form-control" onKeyPress={this.handleSearch.bind(this)} onFocus={this.handleFocus.bind(this)} id="" />
								<div className="input-group-addon"><i className="fa fa-search"></i></div>
							</div>
							<div className="dropdown">
								<div href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span>Menu </span><i className="fa fa-bars"></i></div>
								<ul className="dropdown-menu">
									<li><a href="#" onClick={this.setPage.bind(this, 'home')}><i className="fa fa-star-o"></i> Destaques</a></li>
									<li><a href="#" onClick={this.setPage.bind(this, 'videos')}><i className="fa fa-play-circle-o"></i> Vídeos</a></li>
								</ul>
							</div>
						</div> 
					</div>
				</div>   
				<div className="clearfix"></div>
				<div className="content">
					<div className="container-fluid">
						{pages[s.page]}
					</div>
				</div>
			</div>

		)
	}
}