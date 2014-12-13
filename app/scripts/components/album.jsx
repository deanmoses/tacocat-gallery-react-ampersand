/** @jsx React.DOM */
'use strict';

//
// React.js components that render photo album screens
//

var Config = require('../config.js');
var User = require('../models/user.js');
var AlbumStore = require('../models/album_store.js');
var Site = require('./site.jsx');
var Thumb = require('./thumb.jsx');
var RichTextEditor = require('./richText.jsx');
var $ = require('jquery');
var React = require('react');

/**
 * The React.js component that renders an album.
 *
 * This is the only component in this module that is exported:
 * it's called by the router to render an album.
 */
var AlbumPage = React.createClass({

	/**
	 * Declare the properties that this component takes.
	 */
	propTypes: {
		// path to album, like '2014/12-31'
	    albumPath: React.PropTypes.string.isRequired
	},

	/**
	 * Initial state of the component.
	 * Invoked once before the component is mounted.
	 * The return value will be used as the initial value of this.state.
	 */
	getInitialState: function() {
		return {
			// Get the album if it already exists client-side.
			// Does NOT fetch it from server.
			// No album: component will show a waiting... indicator.
			// This is Ampersand Collection.get().
			album: AlbumStore.get(this.props.albumPath),
            editMode: User.currentUser().editMode,
            editAllowed: User.currentUser().isAdmin
		};
	},

    /**
     * Invoked once, before component is mounted into the DOM, before initial rendering.
     */
    componentWillMount: function() {
        // Start listening for changes to the user model.

        // When the user gets logged in, this triggers rerendering
        // so the edit button gets drawn.
        User.currentUser().on('change:isAdmin', function() {
            if (this.isMounted()) {
                this.setState({editAllowed: User.currentUser().isAdmin});
            }
        }, this);

        // When the user clicks edit, edit mode on the user is set.
        // Listen for that so we know to draw the edit controls.
        User.currentUser().on('change:editMode', function() {
            if (this.isMounted()) {
                this.setState({editMode: User.currentUser().editMode});
            }
        }, this);
    },

    /**
     * Invoked immediately before a component is unmounted from the DOM.
     */
    componentWillUnmount: function() {
        // Stop listening for changes to the User model
        User.currentUser().off('change:isAdmin');
        User.currentUser().off('change:editMode');
    },

	/**
	 * Invoked after the component is mounted into the DOM.
	 *
	 * Invoked once, immediately after the initial rendering occurs.
	 * At this point in the lifecycle, the component has a DOM
	 * representation which you can access via this.getDOMNode().
	 *
	 * This is the place to send AJAX requests.
	 */
	componentDidMount: function() {
		// console.log('componentDidMount ' + this.props.albumPath);

		// If getInitialState() didn't get the album Model from the
		// client side cache, now's the time to fetch it from the server.
		// This is Ampersand Collection.fetchById().
		if (!this.state.album) {
			AlbumStore.fetchById(this.props.albumPath, function (err, album) {
				if (err) {
					console.log('error getting album', err);
				}
				else {
					//console.log('success getting album ' + album.path);
					if (this.isMounted()) {
						this.setState({
							album: album
						});
					}
				}
			}.bind(this));
		}
	},

	/**
	 * Render the component
	 */
	render: function() {
		var album = this.state.album;
		document.title = album ? album.pageTitle : 'Loading album...';

		// console.log('render(): ' + document.title);

		var type = album ? album.type : 'loading';
		switch (type) {
			case 'root':
				return (
					<RootAlbumPage album={album}/>
				);
			case 'year':
				return (
					<YearAlbumPage album={album}/>
				);
			case 'week':
				return (
					<WeekAlbumPage album={album} user={User.currentUser()}/>
				);
			case 'loading':
				return (
					<LoadingAlbumPage/>
				);
			default:
				throw 'no such type: ' + album.type;
		 }
	}
});

module.exports = AlbumPage;

/**
 * Component that displays an empty album, for use while the real album is
 * being loaded from the server.
 */
var LoadingAlbumPage = React.createClass({
	render: function() {
		var emptyThumbArray = [];
		return (
			<div className='albumpage loading container'>
				<Site.HeaderTitle title=''>
					<Site.PrevButton />
					<Site.UpButton />
					<Site.NextButton />
				</Site.HeaderTitle>
				<Thumb.List items={emptyThumbArray} isAlbum={true} />
			</div>
		);
	}
});

/**
 * Component that displays the root album (i.e., displays each year as a thumbnail)
 */
var RootAlbumPage = React.createClass({
	render: function() {
		var a = this.props.album;
		return (
			<div className='albumpage rootalbumtype container-fluid'>
				<Site.HeaderTitle title={a.pageTitle} path=''/>
				<section className='col-md-3 latest'>
					<h2>Latest Album</h2>
					<Thumb.Nail item={a.latest} isAlbum={true} albumType='root'/>
				</section>
				<section className='col-md-9'>
					<Thumb.List items={a.albums} isAlbum={true} albumType='root'/>
				</section>
			</div>
		);
	}
});

/**
 * Component that displays a year album (like 2014)
 */
var YearAlbumPage = React.createClass({
	render: function() {
		var a = this.props.album;
		return (
			<div className='albumpage yearalbumtype container-fluid'>
				<Site.HeaderTitle href='#' title={a.pageTitle} path={this.props.album.path}>
					<Site.PrevButton href={a.nextAlbumHref} title={a.nextAlbumTitle} />
					<Site.UpButton href='#' title='' />
					<Site.NextButton href={a.prevAlbumHref} title={a.prevAlbumTitle}/>
				</Site.HeaderTitle>
				<FirstsAndThumbs album={a}/>
			</div>
		);
	}
});

/**
 * Component that displays a week album (like 2014/12-31/)
 */
var WeekAlbumPage = React.createClass({
    propTypes: {
        album: React.PropTypes.object.isRequired,
        user: React.PropTypes.object.isRequired
    },

	render: function() {
		var a = this.props.album;
        var user = this.props.user;
        var desc = (user.editMode)
            ? <RichTextEditor valueToEdit={a.description}/>
            : <span className='caption' dangerouslySetInnerHTML={{__html: a.description}}/>;
		return (
			<div className='albumpage weekalbumtype container'>
				<Site.HeaderTitle href={'#'+a.parent_album.path} title={a.pageTitle}>
					<Site.PrevButton href={a.nextAlbumHref} title={a.nextAlbumTitle}/>
					<Site.UpButton href={a.parentAlbumHref} title={a.parentAlbumTitle}/>
					<Site.NextButton href={a.prevAlbumHref} title={a.prevAlbumTitle}/>
				</Site.HeaderTitle>
				<section className='overview'>
					<h2 className='hidden'>Overview</h2>
                    {desc}
				</section>
				<Thumb.List items={a.images} isAlbum={false}/>
                <EditMenu album={a} allowEdit={user.isAdmin} editMode={user.editMode} />
			</div>
		);
	}
});

/**
 * Component for year pages.
 * Displays the year's firsts and the child albums' thumbnails
 */
var FirstsAndThumbs = React.createClass({
	render: function() {
		var a = this.props.album;
		return (
			<div>
				<section className='col-md-3 firsts'>
					<h2 className='hidden'>Firsts</h2>
				    <div className='firsts-text' dangerouslySetInnerHTML={{__html: a.description}}/>
				</section>
				<section className='col-md-9'>
                    <h2 className='hidden'>Thumbnails</h2>
					<MonthThumbs album={a}/>
				</section>
			</div>
		);
	}
});

/**
 * Component for year pages.
 * Displays the thumbnail of each individual week album in the year.
 */
var MonthThumbs = React.createClass({
    render: function () {

        var months = this.props.album.childAlbumsByMonth.map(function (child) {
            return <MonthThumb month={child} key={child.monthName}/>;
        });

        return (
        	<div>
        		{months}
			</div>
        );
    }
});

/**
 * Component for year pages.
 * Displays the thumbnails of each individual week album in a given month.
 */
var MonthThumb = React.createClass({
    render: function () {
    	var month = this.props.month;
        var thumbs = month.albums.map(function (child) {
            return <Thumb.Nail item={child} isAlbum={true} key={child.path}/>;
        });

        return (
        	<section className='month'>
				<h1>{month.monthName}</h1>
				{thumbs}
			</section>
        );
    }
});

/**
 * Component that renders the admin's image edit controls.
 */
var EditMenu = React.createClass({
    propTypes: {
        album: React.PropTypes.object.isRequired,
        allowEdit: React.PropTypes.bool.isRequired,
        editMode: React.PropTypes.bool.isRequired
    },

    render: function() {

        // if user isn't allowed to edit, render nothing
        if (!this.props.allowEdit) {
            return false;
        }
        // else if we're in the middle of saving, say so and don't draw any buttons
        else if (this.state.step === 'saving') {
            return (
                <div>
                Saving...
                </div>
            );
        }
        // else if we're in edit mode, give controls to save and cancel
        else if (this.props.editMode) {
            var saveMessage = this.state.step === 'saved' ? <span className='editStatusMsg'>Saved.</span> : '';
            return (
                <div>
                    <div className='btn-group'>
                        <button type='button' className='btn btn-default' onClick={this.cancel} title='Leave edit mode'><Site.GlyphIcon glyph='remove'/> Cancel</button>
                        <button type='button' className='btn btn-primary' onClick={this.save} title='Save album description'><Site.GlyphIcon glyph='ok'/> Save</button>
                    </div>
                    {saveMessage}
                </div>
            );
        }
        // else user is allowed to edit but isn't currently editing.  Give them an edit button.
        else  {
            var album = this.props.album;
            var zeditUrl = Config.zenphotoAlbumEditUrl(album.path);
            var zviewUrl = Config.zenphotoAlbumViewUrl(album.path);
            var tacocatUrl = Config.staticAlbumUrl(album.path);
            return (
                <div>
                    <div className='btn-group'>
                        <button type='button' className='btn btn-default' onClick={this.edit}><Site.GlyphIcon glyph='pencil'/> Edit</button>
                        <button type='button' className='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>
                            <span className='caret'></span>
                            <span className='sr-only'>Toggle Dropdown</span>
                        </button>
                        <ul className='dropdown-menu' role='menu'>
                            <li><a href={zeditUrl} target='zenedit' title='Edit in Zenphoto'><Site.GlyphIcon glyph='new-window'/> Full Edit</a></li>
                            <li><a href={zviewUrl} target='zenedit' title='View in Zenphoto'><Site.GlyphIcon glyph='eye-open'/> Full View</a></li>
                            <li><a href={tacocatUrl} target='zenedit' title="View on old tacocat"><Site.GlyphIcon glyph='road'/> View in Tacocat</a></li>
                        </ul>
                    </div>
                </div>
            );
        }

    },

    getInitialState: function() {
        return {
            step: ''
        };
    },

    edit: function() {
        // will trigger the event listener in a parent component
        User.currentUser().editMode = true;
    },

    cancel: function() {
        // will trigger the event listener in a parent component
        User.currentUser().editMode = false;
    },

    /**
     * Save to server
     */
    save: function() {
        var descInputElement = $('.caption');
        if (!descInputElement.length) {
            alert('image save: could not find description input element');
            this.setState({step: ''});
            return;
        }

        // If there's no actual text, but maybe some <p> or <br>,
        // set it to blank.
        var description;
        if (!descInputElement.text().trim()) {
            description = '';
        }
        // else set it to the full HTML of the caption area
        else {
            description = descInputElement.html();
        }

        console.log('desc', description);

        this.setState({step: 'saving'});

        var ajaxData = {
            eip_context	: 'album',
            desc: description
        };

        $.ajax({
            type: "POST",
            url: Config.zenphotoAlbumViewUrl(this.props.album.path),
            cache: false,
            dataType: "text",
            data: ajaxData
        })
        .done(function() {
            // set the description on the album model
            this.props.album.description = description;
            this.setState({step: 'saved'});
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('error saving album: %s\n\tstatus: %s\n\txhr: %s', errorThrown, textStatus, jqXHR);
            alert('Error saving: ' + errorThrown);
            this.setState({step: ''});
        }.bind(this));
    }
});
