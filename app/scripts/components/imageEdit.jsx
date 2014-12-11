/** @jsx React.DOM */
'use strict';

var $ = require('jquery'); // bootstrap-modal needs jquery so this has to be before it
require('bootstrap-modal');
var React = require('react');

/**
 * The React.js component that renders the photo detail screen.
 *
 * This is the only component in this module that is exported:
 * it's called by the router to render an album.
 */
var ImageEditScreen;
module.exports = ImageEditScreen = React.createClass({
	render: function() {
		var image = this.props.image;
		return(
			<div className={'image-edit-modal ' + this.state.className} role='dialog'>
			  <div className='modal-dialog'>
			    <div className='modal-content'>
			      <div className='modal-header'>
			        <button type='button' className='close' data-dismiss='modal' onClick={this.props.onClose}><span aria-hidden='true'>&times;</span><span className='sr-only'>Close</span></button>
			      	<h4><input type='text' value={image.title} size='50'/></h4>
				  </div>
			      <div className='modal-body'>
					<textarea value={image.description}/>
			      </div>
			      <div className='modal-footer'>
			        <button type='button' className='btn btn-default' onClick={this.props.onClose}>Close</button>
					<button type='button' className='btn btn-primary' onClick={this.handleSave}>Save changes</button>
			      </div>
			    </div>
			  </div>
			</div>
		);
	},
	getInitialState: function() {
	      return {
	        className: 'modal show'
	      };
	    },
    show: function() {
      this.setState({ className: 'modal fade show' });
      setTimeout(function() {
        this.setState({ className: 'modal fade show in' });
      }.bind(this), 0);
    },
    hide: function() {
      // Fade out the help dialog, and totally hide it after a set timeout
      // (once the fade completes)
      this.setState({ className: 'modal fade show' });
      setTimeout(function() {
        this.setState({ className: 'modal fade' });
      }.bind(this), 400);
    },
	handleSave: function() {
		if (this.isMounted()) {
			alert('Not yet implemented');
		}
	}
});
