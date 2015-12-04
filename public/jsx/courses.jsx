var Course = React.createClass({
   render: function() {
        var createCourse = function(item){
            return (
                <div className="panel panel-default" key={item.id}>
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <a className="btn-block" data-toggle="collapse" style={{outline:'0'}} href={"#collapse"+item.id}>{item.text}</a>
                        </h4>
                    </div>
                    <div id={"collapse"+item.id} className="panel-collapse collapse in">
                        {/*this is where we will inject another react class it is within the collapsible container*/}
                        <div className="panel-body">
                            <h4> Item, Time, Date, Color </h4>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="panel-group" id="accordion">{this.props.items.map(createCourse)}</div>
        );
   }
});

var CourseData = React.createClass({
    getInitialState: function() {
        return {items: [], text: ''};  
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        if(this.state.text != ""){
            var id = this.state.items.length + 1;
            var newItems = [{text: this.state.text, id: id}];
            newItems = newItems.concat(this.state.items);
            var nextText = '';
            this.setState({items: newItems, text: nextText});
        }                   
    },

    //use componentDidMount for initial action! (it's like document.onload)

    render: function(){
        return (
            <div>
                <h2>Courses</h2>
                <form onSubmit={this.handleSubmit}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <input placeholder="New Course" onChange={this.onChange} value={this.state.text} /> <div onClick={this.handleSubmit} className="glyphicon glyphicon-plus add-course" />
                        </h4>
                    </div>
                </div>
                </form>
                <Course items={this.state.items} />
            </div>
        );
    }
});

ReactDOM.render(
    <CourseData />,
    document.getElementById('courses')
);
