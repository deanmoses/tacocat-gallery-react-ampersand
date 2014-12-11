/** @jsx React.DOM */
'use strict';

var React = require('react');

/**
 * React.js component that displays a CKEDITOR-powered rich text editor.
 */
var RichTextEditor;
module.exports = RichTextEditor = React.createClass({
    propTypes: {
        valueToEdit: React.PropTypes.string.isRequired
    },
	render: function() {
		return(
            <div id='ckedtr' contentEditable='true' className='caption' dangerouslySetInnerHTML={{__html: this.props.valueToEdit}}/>
		);
	},

    componentWillMount: function() {
        // if the CKEDITOR script exists...
        if (window.CKEDITOR) {
            // ... tell it to not automatically make contentEditable elements rich text;
            // I want to supply a menu config first.
            CKEDITOR.disableAutoInline = true;
        }
        // else load CKEDITOR
        else {
            $.ajax({
                url: 'http://cdn.ckeditor.com/4.4.6/standard/ckeditor.js',
                dataType: 'script',
                cache: true
            }).done(function() {
                // now that it's loaded, configure the editor
                if (window.CKEDITOR) {
                    console.log('CKEDITOR', window.CKEDITOR);
                    CKEDITOR.inline('ckedtr', {
                        toolbar: [
                            ['Bold', 'Italic', 'Underline'],
                            ['BulletedList', 'NumberedList'],
                            ['PasteText', '-', 'RemoveFormat']
                        ],
                        removeButtons: null
                    });
                }
            });
        }
    }
});