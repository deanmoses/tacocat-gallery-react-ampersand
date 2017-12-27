/** @jsx React.DOM */
/*global CKEDITOR */
'use strict';

var $ = require('jquery');
var React = require('react');
var PropTypes = require('prop-types');

/**
 * React.js component that displays a CKEDITOR-powered rich text editor.
 */
class RichTextEditor extends React.Component {
	render() {
		return(
            <div id='ckedtr' contentEditable='true' className='caption' dangerouslySetInnerHTML={{__html: this.props.valueToEdit}}/>
		);
    }
    
    componentWillMount() {
        // if the CKEDITOR script exists...
        if (window.CKEDITOR) {
            // ... tell it to not automatically make contentEditable elements rich text;
            // I want to supply a menu config first.
            CKEDITOR.disableAutoInline = true;
        }
        // else load CKEDITOR
        else {
            $.ajax({
                url: '//cdn.ckeditor.com/4.4.6/standard/ckeditor.js',
                dataType: 'script',
                cache: true
            }).done(function() {
                // now that it's loaded, configure the editor
                if (window.CKEDITOR) {
                    //console.log('CKEDITOR', window.CKEDITOR);
                    CKEDITOR.inline('ckedtr', {
                        toolbar: [
                            ['Bold', 'Italic', 'Underline'],
                            ['BulletedList', 'NumberedList'],
                            ['Link', 'Unlink']
                        ],
                        removeButtons: null,
                        linkShowAdvancedTab: false,
                        linkShowTargetTab: false
                    });
                }
            });
        }
    }

    componentDidMount() {
        if (window.CKEDITOR) {
            CKEDITOR.inline('ckedtr', {
                toolbar: [
                    ['Bold', 'Italic', 'Underline'],
                    ['BulletedList', 'NumberedList'],
                    ['Link', 'Unlink']
                ],
                removeButtons: null,
                linkShowAdvancedTab: false,
                linkShowTargetTab: false
            });
        }
    }
};
RichTextEditor.propTypes = {
    valueToEdit: PropTypes.string
};
module.exports = RichTextEditor;