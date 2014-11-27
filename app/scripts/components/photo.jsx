/** @jsx React.DOM */

//
// React.js components that render the photo detail screen
//

require('./site.jsx'); // other React.js components these components depend on

var React = window.React = require('react');

// The component called by the router when rendering the photo detail screen
var PhotoPage = React.createClass({
	render: function() {
		var parentAlbumPath = "/path/to/album";
		var fulltitle = "Some Photo Title";
		return (
			<div>
				<HeaderTitle title={fulltitle} />
				<HeaderButtons>
					<li><a className="btn">caption</a></li>
	<li><a className="btn" target="edit" href="http://tacocat.com/pictures/main.php?g2_view=core.ItemAdmin&g2_subView=core.ItemEdit&g2_itemId={{photo.id}}">edit</a></li>
					<div className="btn-group">
						<PrevButton href={this.props.prevPhoto} />
						<UpButton href={parentAlbumPath} title={parentAlbumPath} />
						<NextButton href={this.props.nextPhoto} />
					</div>
				</HeaderButtons>
				<PhotoPageBody photo={this.props.photo} />
			</div>
		);
	}
});

module.exports = PhotoPage;

var PhotoPageBody = React.createClass({
	render: function() {
		var photo = this.props.photo;
		var style = {
			'width': '100%',
			'max-width': photo.width,
			'max-height': photo.height
		};
		return (
			<div className="container-fluid photo-body">
				<section className="col-md-3">
					<h2 className="hidden">Caption</h2>
				    <span className="caption" dangerouslySetInnerHTML={{__html: photo.description}}/>
				</section>
				<section className="col-md-9">
					<h2 className="hidden">Photo</h2>
					<img src={photo.fullSizeImage.url} style={style} />
				</section>
			</div>
		);
	}
});
