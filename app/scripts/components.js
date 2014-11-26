/** @jsx React.DOM */
var React = window.React = require('react'),
    Timer = require("./ui/Timer");

var TodoList = React.createClass({
  render: function() {
    var createItem = function(itemText) {
      return <li>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});
var TodoApp = React.createClass({
  getInitialState: function() {
    return {items: [], text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
  	switch(this.props.albumType) {
  		case 'root': return (<div>ROOT POX</div>);
  		case 'week': return (<div>WEEK POX</div>);
  		case 'year': return (<div>YEAR POX</div>);
  		default: 
	
  	    return (
  	      <div>
  	        <h3>TODO</h3>
  	        <TodoList items={this.state.items} />
  	        <form onSubmit={this.handleSubmit}>
  	          <input onChange={this.onChange} value={this.state.text} />
  	          <button>{'Add #' + (this.state.items.length + 1)}</button>
  	        </form>
  	        <Timer />
  	      </div>
  	    );
      }
	

  }
});

module.exports = TodoApp;
