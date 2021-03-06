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
var PropTypes = require('prop-types');

/**
 * The React.js component that renders an album.
 *
 * This is the only component in this module that is exported:
 * it's called by the router to render an album.
 */
class AlbumPage extends React.Component {

    /**
     * Constructor is invoked once, before the component is mounted
     */
    constructor(props) {
        super(props);

        // Initial state of the component
        this.state = {
            // Get the album if it already exists client-side.
            // Does NOT fetch it from server.
            // No album: component will show a waiting... indicator.
            // This is Ampersand Collection.get().
            album: AlbumStore.getAlbum(this.props.albumPath),
            editMode: User.currentUser().editMode,
            editAllowed: User.currentUser().isAdmin
        };
    }

    /**
     * Invoked immediately before a component is unmounted from the DOM.
     */
    componentWillUnmount() {
        // Stop listening for changes to the User model
        User.currentUser().off('change:isAdmin');
        User.currentUser().off('change:editMode');
        if (this.state.album) {
            this.state.album.off('change');
        }
    }

	/**
	 * Invoked after the component is mounted into the DOM.
	 *
	 * Invoked once, immediately after the initial rendering occurs.
	 * At this point in the lifecycle, the component has a DOM
	 * representation which you can access via this.getDOMNode().
	 *
	 * This is the place to send AJAX requests.
	 */
	componentDidMount() {
        // Start listening for user changes that would require rerending

        // When the user gets logged in, this triggers rerendering
        // so the edit button gets drawn.
        User.currentUser().on('change:isAdmin', function() {
            this.setState({editAllowed: User.currentUser().isAdmin});
        }, this);

        // When the user clicks edit, edit mode on the user is set.
        // Listen for that so we know to draw the edit controls.
        User.currentUser().on('change:editMode', function() {
            this.setState({editMode: User.currentUser().editMode});
        }, this);

		// If the constructor didn't get the album Model from the
		// client side cache, now's the time to fetch it from the server.
		// This is Ampersand Collection.fetchById().
		if (!this.state.album) {
			AlbumStore.fetchAlbum(this.props.albumPath, function (err, album) {
				if (err) {
                    console.log('error getting album', err);
                    this.setState({err: err});
				}
				else {
					//console.log('success getting album ' + album.path);
                    this.setState({
                        album: album
                    });

                    // If the admin updates the cache for this album, this triggers 
                    // rerendering so that the new album info gets drawn.
                    album.on('change', function (model, val) {
                        this.setState({album: model});
                    }, this);
				}
			}.bind(this));
		}
	}

	/**
	 * Render the component
	 */
	render() {
        if (this.state.err) {
            return (
                <ErrorAlbumPage/>
            );
        }

		var album = this.state.album;
		document.title = album ? album.pageTitle : 'Loading album...';

		var type = album ? album.type : 'loading';
		switch (type) {
			case 'root':
				return (
					<RootAlbumPage album={album} user={User.currentUser()}/>
				);
			case 'year':
				return (
					<YearAlbumPage album={album} user={User.currentUser()}/>
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
}
/**
 * Declare the properties that this component takes.
 */
AlbumPage.propTypes = {
    // path to album, like '2014/12-31'
    albumPath: PropTypes.string.isRequired
};
module.exports = AlbumPage;

/**
 * Component that displays an empty album, for use while the real album is
 * being loaded from the server.
 */
class LoadingAlbumPage extends React.Component {
	render() {
		var emptyThumbArray = [];
		return (
			<Site.Page className='albumpage loading' hideFooter={true}>
				<Site.HeaderTitle hideSiteTitle={true} hideSearch={true}>
					<Site.PrevButton />
					<Site.UpButton />
					<Site.NextButton />
				</Site.HeaderTitle>
				<div className='fullPageMessage'>
                    <p><Site.WaitingSpinner /></p>
                </div>
			</Site.Page>
		);
	}
}

/**
 * Component shown for 404 (Album Not Found) or other error retrieving album
 */
class ErrorAlbumPage extends React.Component {
    render() {
        return (
            <Site.Page className='albumpage rootalbumtype'>
                <Site.HeaderTitle title={Config.site_title} shortTitle={Config.site_title_short} noTitleLink={true} hideSiteTitle={true} path=''/>
                <div className='fullPageMessage'>
                    <p>Album not found.</p>
                    <p><a href='#'>Go back <Site.GlyphIcon glyph='home'/>?</a></p>
                </div>
            </Site.Page>
        );
    }
}

/**
 * Component that displays the root album (i.e., displays each year as a thumbnail)
 */
class RootAlbumPage extends React.Component {
	render() {
		var a = this.props.album;
		return (
			<Site.Page className='albumpage rootalbumtype'>
                <Site.HeaderTitle title={Config.site_title} shortTitle={Config.site_title_short} noTitleLink={true} hideSiteTitle={true} path=''/>
                <div className='container-fluid'>
                    <section className='col-md-3 sidebar latest'>
                        <h2>Latest Album</h2>
                        <Thumb.Nail item={a.latest} isAlbum={true} albumType='latest'/>
                    </section>
                    <section className='col-md-9 col-md-offset-3'>
                        <Thumb.List items={a.albums} isAlbum={true} albumType='root'/>
                    </section>
                </div>
            </Site.Page>
		);
	}
}
RootAlbumPage.propTypes = {
    album: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

/**
 * Component that displays a year album (like 2014)
 */
class YearAlbumPage extends React.Component {
	render() {
		var a = this.props.album;
        var user = this.props.user;
		return (
			<Site.Page className='albumpage yearalbumtype'>
				<Site.HeaderTitle href='#' title={a.pageTitle} path={this.props.album.path}>
					<Site.PrevButton href={a.nextAlbumHref} title={a.nextAlbumTitle} />
					<Site.UpButton href='#' title='All Years' />
					<Site.NextButton href={a.prevAlbumHref} title={a.prevAlbumTitle}/>
				</Site.HeaderTitle>
				<FirstsAndThumbs album={a} user={user}/>
			</Site.Page>
		);
	}
}
YearAlbumPage.propTypes = {
    album: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

/**
 * Component that displays a week album (like 2014/12-31/)
 */
class WeekAlbumPage extends React.Component {
    constructor() {
        this.onThumbSelect = this.onThumbSelect.bind(this);
    }

	render() {
		var a = this.props.album;
        var user = this.props.user;
        var desc = (user.editMode)
            ? <RichTextEditor valueToEdit={a.description}/>
            : <div className='caption' dangerouslySetInnerHTML={{__html: a.description}}/>;
        var selectedItem = user.editMode ? a.thumb : null;
		return (
			<Site.Page className='albumpage weekalbumtype'>
				<Site.HeaderTitle href={'#'+a.parent_album.path} title={a.pageTitle} path={a.path}>
					<Site.PrevButton href={a.nextAlbumHref} title={a.nextAlbumTitle}/>
					<Site.UpButton href={a.parentAlbumHref} title={a.parentAlbumTitle}/>
					<Site.NextButton href={a.prevAlbumHref} title={a.prevAlbumTitle}/>
				</Site.HeaderTitle>
				<section className='overview'>
					<h2 className='hidden'>Overview</h2>
                    {desc}
				</section>
				<Thumb.List items={a.images} isAlbum={false} editMode={user.editMode} selectedItem={selectedItem} onSelect={this.onThumbSelect}/>
                <EditMenu album={a} allowEdit={user.isAdmin} editMode={user.editMode} />
			</Site.Page>
		);
	}

    /**
     * Invoked once, before component is mounted into the DOM, before initial rendering.
     */
    componentWillMount() {
        this.props.album.on('change:thumb', function() {
            this.setState({}); // just to trigger a rerender
        }, this);
    }

    /**
     * Invoked immediately before a component is unmounted from the DOM.
     */
    componentWillUnmount() {
        this.props.album.off('change:thumb');
    }

    /**
     * Set thumbnail for the album
     * @param fullpath full path to image like 2001/12-23/felix.jpg
     */
    onThumbSelect(fullpath) {
        var path = fullpath.split('/').pop(); // we just want 'felix.jpg'
        if (!path) {
            window.alert('set thumbnail: no image path');
            this.setState({step: ''});
            return;
        }

        this.setState({step: 'saving'});

        var ajaxData = {
            eip_context	: 'album',
            thumb: path
        };

        $.ajax({
            type: "POST",
            url: Config.zenphotoAlbumViewUrl(this.props.album.path),
            cache: false,
            dataType: "json",
            data: ajaxData
        })
        .done(function(result) {
            if (!result.success) {
                console.log('Error setting thumbnail: ', result);
                window.alert('Error setting thumbnail: ', result);
                return;
            }

            //console.log('Set thumbnail success. Server result: ', result);

            // set the thumb on the album model
            this.props.album.thumb = path;

            // set the thumb on my parent's model, if it's been downloaded
            //console.log('album to set thumb on: ', this.props.album);
            var parentAlbum = this.props.album.getFullParentAlbum();
            if (parentAlbum) {
                //console.log('result: ', result);
                if (result.urlThumb) {
                    //console.log('Set thumbnail: setting URL of new thumb for album [%s] on parent album to [%s]', this.props.album.path, result.urlThumb);
                    var me = parentAlbum.getChildAlbumThumb(this.props.album.path);
                    if (me) {
                        me.urlThumb = result.urlThumb;
                        //console.log('Set thumbnail: successfully updated thumb on parent');
                    }
                    //else {
                    //    console.log('Set thumbnail: did not find album thumb [%s] in parent', this.props.album.path);
                    //}
                }
                //else {
                //    console.log('Set thumbnail: server didn\'t return new thumb URL');
                //}
            }
            //else {
            //    console.log('Set thumbnail: parent album is not yet downloaded');
            //}

            this.setState({step: 'saved'});
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('error setting album thumbnail: %s\n\tstatus: %s\n\txhr: %s', errorThrown, textStatus, jqXHR);
            window.alert('Error saving: ' + errorThrown);
            this.setState({step: ''});
        }.bind(this));
    }
}
WeekAlbumPage.propTypes = {
    album: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

/**
 * Component for year pages.
 * Displays the year's firsts and the child albums' thumbnails
 */
class FirstsAndThumbs extends React.Component {
	render() {
		var a = this.props.album;
        var user = this.props.user;
        var desc = (user.editMode)
            ? <RichTextEditor valueToEdit={a.description}/>
            : <div className='firsts-text' dangerouslySetInnerHTML={{__html: a.description}}/>;

		return (
			<div className='container-fluid'>
				<section className='col-md-3 firsts sidebar'>
					<h2 className='hidden'>Firsts</h2>
				    {desc}
                    <EditMenu album={a} allowEdit={user.isAdmin} editMode={user.editMode} />
				</section>
				<section className='col-md-9 col-md-offset-3'>
                    <h2 className='hidden'>Thumbnails</h2>
					<MonthThumbs album={a}/>
				</section>
			</div>
		);
	}
}
FirstsAndThumbs.propTypes = {
    album: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

/**
 * Component for year pages.
 * Displays the thumbnail of each individual week album in the year.
 */
class MonthThumbs extends React.Component {
    render() {
        var months = this.props.album.childAlbumsByMonth.map(function (child) {
            return <MonthThumb month={child} key={child.monthName}/>;
        });

        return (
        	<div>
        		{months}
			</div>
        );
    }
}

/**
 * Component for year pages.
 * Displays the thumbnails of each individual week album in a given month.
 */
class MonthThumb extends React.Component {
    render() {
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
}

/**
 * Component that renders the admin's album edit controls.
 */
class EditMenu extends React.Component {

    /**
     * Constructor is invoked once, before the component is mounted
     */
    constructor(props) {
        super(props);

        // Initial state of the component
        this.state = {
            step: ''
        };

        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    render() {
        var a = this.props.album;

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
            var summaryControl = (a.type === 'year') ? '' : <input className='albumSummary' type='text' defaultValue={a.summary} placeholder='Summary'/>;
            var publishControl = (a.type === 'year') ? '' : <span><input className='albumPublished' type='checkbox' defaultChecked={!a.unpublished}/> published</span>;
            var saveMessage = this.state.step === 'saved' ? <span className='editStatusMsg'>Saved.</span> : '';
            return (
                <div className='editControls'>
                    <div className='btn-group'>
                        <button type='button' className='btn btn-default' onClick={this.cancel} title='Leave edit mode'><Site.GlyphIcon glyph='remove'/> Cancel</button>
                        <button type='button' className='btn btn-default' onClick={this.save} title='Save album description'><Site.GlyphIcon glyph='ok'/> Save</button>
                    </div>
                    {summaryControl}
                    {publishControl}
                    {saveMessage}
                </div>
            );
        }
        // else user is allowed to edit but isn't currently editing.  Give them an edit button and a dropdown of other options
        else  {
            var zeditUrl = Config.zenphotoAlbumEditUrl(a.path);
            var zviewUrl = Config.zenphotoAlbumViewUrl(a.path);
            var refreshControl = (a.type !== 'year') ? '' : <li><a href='javascript:void(0);' onClick={this.refresh} title='Refresh Cache'><Site.GlyphIcon glyph='refresh'/> Refresh Cache</a></li>;
            return (
                <div className='editControls'>
                    <div className='btn-group'>
                        <button type='button' className='btn btn-default' onClick={this.edit}><Site.GlyphIcon glyph='pencil'/> Edit</button>
                        <button type='button' className='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>
                            <span className='caret'></span>
                            <span className='sr-only'>Toggle Dropdown</span>
                        </button>
                        <ul className='dropdown-menu' role='menu'>
                            <li><a href={zeditUrl} target='zenedit' title='Edit in Zenphoto'><Site.GlyphIcon glyph='wrench'/> Edit in Zenphoto</a></li>
                            <li><a href={zviewUrl} target='zenedit' title='View in Zenphoto'><Site.GlyphIcon glyph='eye-open'/> View in Zenphoto</a></li>
                            {refreshControl}
                        </ul>
                    </div>
                </div>
            );
        }
    }

    edit() {
        // will trigger the event listener in a parent component
        User.currentUser().editMode = true;
    }

    cancel() {
        // will trigger the event listener in a parent component
        User.currentUser().editMode = false;
    }

    refresh() {
        // hit the PHP endpoint that refreshes the cache
        $.ajax({
            type: 'GET',
            url: Config.refreshAlbumCacheUrl(this.props.album.path),
            cache: false,
            dataType: 'json',
        })
        .done(function(result) {
            // the PHP returns its status in JSON format
            if (result.status !== 'success') {
                console.log('Error refreshing cache of album: ', result);
                window.alert('Error refreshing cache of album: ' + result);
                return;
            }
            // fetch album from server.  Gets it from the cache we just updated.
            this.props.album.fetch({
                success(model, response, options) {
                    console.log('Successfully fetched album');
                },
                error(model, response, options) {
                    console.log('Error fetching album: ', response);
                    window.alert('Error fetching album: ' + response);
                }
            });
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('error refreshing cache of album: %s\n\tstatus: %s\n\txhr: %s', errorThrown, textStatus, jqXHR);
            window.alert('Error refreshing cache of album: ' + errorThrown);
        }.bind(this));
    }

    /**
     * Save to server
     */
    save() {
        var a = this.props.album;
        var isYearAlbum = (a.type === 'year');

        var descInputElement = $('.caption');
        if (!descInputElement.length) {
            window.alert('album save: could not find description input element');
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

        var summary;
        if (!isYearAlbum) {
            var summaryInput = $('input.albumSummary');
            if (!summaryInput.length) {
                window.alert('album save: could not find summary input element');
                this.setState({step: ''});
                return;
            }
            summary = summaryInput.val();
        }

        var published;
        if (!isYearAlbum) {
            var publishedCheckbox = $('input.albumPublished');
            if (!publishedCheckbox.length) {
                window.alert('album save: could not find published checkbox element');
                this.setState({step: ''});
                return;
            }
            published = publishedCheckbox.prop('checked');
        }

        console.log('desc', description);
        if (!isYearAlbum) {
            console.log('summary', summary);
            console.log('published', published);
        }

        this.setState({step: 'saving'});

        var ajaxData = {
            eip_context	: 'album',
            desc: description
        };

        if (!isYearAlbum) {
            ajaxData.summary = summary;
            ajaxData.show = published;
        }

        $.ajax({
            type: 'POST',
            url: Config.jsonAlbumEditUrl(this.props.album.path),
            cache: false,
            dataType: 'json',
            data: ajaxData,
            xhrFields: { withCredentials: true } // necessary when sending an authenticated AJAX request to a subdomain, otherwise it won't pass the cookies
        })
        .done(function(result) {
            if (!result.success) {
                console.log('Error saving album: ', result);
                window.alert('Error saving album: ', result);
                this.setState({step: ''});
                return;
            }

            // If it's a year album, hit the PHP that triggers refreshing the album's cache on the server. 
            // Don't bother looking at response; there's nothing we can do if it fails.
            if (isYearAlbum) {
                $.ajax({
                    type: 'POST',
                    url: 'https://tacocat.com/p_json/refresh.php',
                    cache: false,
                    dataType: 'json',
                    data: {
                        album: this.props.album.path
                    }
                });
            }

            // Hit the PHP that triggers refreshing the parent album's cache on the server.
            // Don't bother looking at response; there's nothing we can do if it fails.
            $.ajax({
                type: 'POST',
                url: 'https://tacocat.com/p_json/refresh.php',
                cache: false,
                dataType: 'json',
                data: {
                    album: this.props.album.parentAlbumPath
                }
            });

            // set the description on the album model
            this.props.album.description = description;
            this.props.album.summary = summary;
            this.props.album.unpublished = !published;
            var parentAlbum = this.props.album.getFullParentAlbum();
            if (parentAlbum) {
                var me = parentAlbum.getChildAlbumThumb(this.props.album.path);
                if (me) {
                    me.summary = this.props.album.summary;
                    me.unpublished = this.props.album.unpublished;
                }
            }

            this.setState({step: 'saved'});
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('error saving album: %s\n\tstatus: %s\n\txhr: %s', errorThrown, textStatus, jqXHR);
            window.alert('Error saving: ' + errorThrown);
            this.setState({step: ''});
        }.bind(this));
    }
}
EditMenu.propTypes = {
    album: PropTypes.object.isRequired,
    allowEdit: PropTypes.bool.isRequired,
    editMode: PropTypes.bool.isRequired
};