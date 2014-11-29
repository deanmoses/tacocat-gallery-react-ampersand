/** @jsx React.DOM */

//
// React.js components that render the photo detail screen
//

var Site = require('./site.jsx'); // other React.js components these components depend on

var React = window.React = require('react');

// The component called by the router when rendering the photo detail screen
var ImagePage = React.createClass({
	render: function() {
		var album = this.props.album;
		var image = album.images.get(this.props.imagePath);
		return (
			<div>
				<Site.HeaderTitle href={album.href} title={image.title} />
				<Site.HeaderButtons>
					<li><a className="btn">caption</a></li>
					<li><a className="btn" target="edit" href="">edit</a></li>
					<div className="btn-group">
						<Site.PrevButton href={image.prevImageHref} />
						<Site.UpButton href={album.href} title={album.title} />
						<Site.NextButton href={image.nextImageHref} />
					</div>
				</Site.HeaderButtons>
				<ImagePageBody image={image} />
			</div>
		);
	}
});

module.exports = ImagePage;

var ImagePageBody = React.createClass({
	render: function() {
		var image = this.props.image;
		var style = {
			'width': '100%',
			'maxWidth': image.width,
			'maxHeight': image.height
		};
		return (
			<div className="container-fluid photo-body">
				<section className="col-md-3">
					<h2 className="hidden">Caption</h2>
				    <span className="caption" dangerouslySetInnerHTML={{__html: image.description}}/>
				</section>
				<section className="col-md-9">
					<h2 className="hidden">Photo</h2>
					<img src={'http://tacocat.com' + image.urlSized} style={style} />
				</section>
			</div>
		);
	}
});
