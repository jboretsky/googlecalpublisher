var CourseItem = React.createClass({
    render: function() {
        var itemChange = this.props.itemChange;
        var deleteItem = this.props.deleteItem;
        var createItem = function(item, itemIndex) {
            return (
                <div key={itemIndex} style={{marginBottom:'5px'}}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="input-group">
                                <input type="text" style={{borderRadius:'0px'}} className="form-control course-item-input" id={itemIndex} name="title" onChange={itemChange} value={item.title} placeholder="Item Title" />
                                <input type="text" style={{borderRadius:'0px'}} className="form-control course-item-input" id={itemIndex} name="time" onChange={itemChange} value={item.time} placeholder="Time" />
                                <input type="text" style={{borderRadius:'0px'}} className="form-control course-item-input" id={itemIndex} name="date" onChange={itemChange} value={item.date} placeholder="Date" />
                                <input type="text" style={{borderRadius:'0px'}} className="form-control course-item-input" id={itemIndex} name="color" onChange={itemChange} value={item.color} placeholder="Color" />
                                <div className="input-group-btn">
                                    <button className="btn btn-danger" onClick={deleteItem} value={itemIndex}><span className="glyphicon glyphicon-remove" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                {this.props.items.map(createItem)}
            </div>
        );
    }
});

var CourseItemWrapper = React.createClass({
    //this component should not have state
    //need to set up flux component to handle/access state
    getInitialState: function() {
        return {listItems: [], courseTitle: ''}
    },
    handleAdd: function(){
        var id = this.state.listItems.length;
        //all the data in the listItems needs to be updated and consistent with view
        var newItems = [{id: id, title: '', date: '', time: '', color: ''}];
        newItems = this.state.listItems.concat(newItems);
        this.setState({listItems: newItems});
    },
    componentDidMount: function() {
        var newItems = [{id: 0, title: '', date:'', time: '', color: ''}];
        newItems = this.state.listItems.concat(newItems);
        this.setState({listItems: newItems});
        this.setState({courseTitle: this.props.theCourseTitle});
    },
    deleteItem: function(e) {
        if(this.state.listItems.length > 1){
            var index = parseInt(e.target.value, 10);
            this.state.listItems.splice(index,1);
            this.setState({listItems: this.state.listItems});
        }
    },
    itemChange: function(item) {
        this.state.listItems[item.target.id][item.target.name] = item.target.value;
        this.setState({listItems: this.state.listItems});
    },
    render: function() {
        return (
            <div>
                <CourseItem items={this.state.listItems} deleteItem={this.deleteItem} itemChange={this.itemChange} />
                <button className="btn btn-primary" onClick={this.handleAdd}>Add Item</button>
            </div>
        );
    }
});


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
                        <div className="panel-body">
                            <CourseItemWrapper theCourseTitle={item.text} />
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
        return {items: [], text: '', userInfo: {name:'', id:'', email: ''}};  
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
    onSignIn: function(googleUser){
        var name = googleUser.getBasicProfile().getName();
        var id = googleUser.getBasicProfile().getId();
        var email = googleUser.getBasicProfile().getEmail();
        this.setState({userInfo: {name: name, id: id, email: email}});
    },
    Publish: function(){
        console.log(this.state);
    },
    componentDidMount: function(){
        gapi.signin2.render('g-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 175,
            'height': 34,
            'text': 'sign in',
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': this.onSignIn
        })
    },
    render: function(){
        return (
            <div>
                <h2>Google Calendar Publisher
                    <button className="btn btn-success" style={{float:'right', marginLeft:'5px', borderRadius:'0'}} onClick={this.Publish}>Publish</button>
                    <div id="g-signin2" style={{float:'right'}}/>
                </h2>
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
