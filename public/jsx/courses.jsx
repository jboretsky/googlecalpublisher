// there is a mix of state/global state going on here
// will refactor more to use only master state (appstore)
// Have finished working on CourseData but would like to refactor CourseItemWrapper as well
// Individual components should access their data through the master store / update the master store
// eventually this should use redux
// or at least should move the dispatcher/stores to another source file
// also should transfer all CDN's to npm packages and browserify
// Google calendar api working

/*
* THIS IS JUST A SAVE in case i fuck everything up
*/

var appStore = {
	_state: {
		panelHeading: '',
		courses: []
	},
	getState: function() {
		return this._state;
	},
	addCourse: function(course){
		var newItems = course.concat(this._state.courses);
		this._state.courses = newItems;
		this._state.panelHeading = '';
	},
	addUserInfo: function(name,id,email) {
		this._state.userInfo.userId = id;
		this._state.userInfo.userName = name;
		this._state.userInfo.userEmail = email;
	},
	updateCourses: function(newData, course){
		for(var i=0;i<this._state.courses.length;i++){
			if(this._state.courses[i].text == course) this._state.courses[i].innerItems = newData;
		}
	},
	updatePanelHeading: function(text) {
		this._state.panelHeading = text;
	},
	//debugging
	printState(){
		console.log(this.getState());
	}
};

var stateDispatcher = {
	addCourse: function(course) {
		appStore.addCourse(course);
	},
	addUserInfo: function(name, id, email) {
		appStore.addUserInfo(name,id,email);
	},
	updateInnerItem: function(newData, course) {
		appStore.updateCourses(newData, course);
	},
	updatePanelHeading: function(text) {
		appStore.updatePanelHeading(text);
	}
};

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
                                <input type="text" style={{borderRadius:'0px',width:'25%'}} className="form-control course-item-input" id={itemIndex} name="title" onChange={itemChange} value={item.title} placeholder="Item Title" />
                                <div type="text" style={{borderRadius:'0px',width:'50%'}} className="form-control course-item-input" id={itemIndex} name="time" onChange={itemChange} value={item.time} placeholder="Time"> DateTime picker here </div>
                                    <input type="text" style={{borderRadius:'0px',width:'25%'}} className="form-control course-item-input" id={itemIndex} name="color" onChange={itemChange} value={item.color} placeholder="Color picker here" />
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

//should read/update master store rather than having it's own state maybe
var CourseItemWrapper = React.createClass({
    //this component should not have state
    getInitialState: function() {
        return {listItems: []}
    },
    handleAdd: function(){
        //all the data in the listItems needs to be updated and consistent with view
        var newItems = [{title: '', date: '', time: '', color: ''}];
        newItems = this.state.listItems.concat(newItems);
        this.setState({listItems: newItems});
    },
    componentDidMount: function() {
        var newItems = [{title: '', date:'', time: '', color: ''}];
        newItems = this.state.listItems.concat(newItems);
        this.setState({listItems: newItems});
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
		stateDispatcher.updateInnerItem(this.state.listItems, this.props.theCourseTitle);
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
	getStateFromStore: function() {
		return appStore.getState();
	},
    getInitialState: function() {
        return this.getStateFromStore();
    },
    onChange: function(headingText) {
		stateDispatcher.updatePanelHeading(headingText.target.value);
        this.setState(this.getStateFromStore());
    },
    handleSubmit: function(e) {
        e.preventDefault();
        if(this.state.text != ""){
			var id = this.state.courses.length;
			var newItems = [{text: this.state.panelHeading, id: id, innerItems: []}];
			stateDispatcher.addCourse(newItems);
            this.setState(this.getStateFromStore());
        }                   
    },
    Publish: function(googleUser){
        //appStore.printState();
        
        var self = this;

        var SCOPES = ["https://www.googleapis.com/auth/calendar"];

        gapi.auth.authorize({
            'client_id': '561945636153-uklpekimklqoum49u0u3ia2arss2gktn.apps.googleusercontent.com',
            'scope': SCOPES.join(' '),
            'immediate': false
        }, handleAuthResult);

        function handleAuthResult(authResult) {
            if(authResult && !authResult.error) {
                loadCalendarApi();
            } else {
                console.log("error in auth");
            }
        }
        
        function loadCalendarApi() {
            gapi.client.load('calendar', 'v3', postEvents);
        }

        function postEvents() {
            
            //console.log(self.getStateFromStore().courses);
            var title = "";
            var date = "";
            var time = "";
            var color = "";
            var course = "";
            self.getStateFromStore().courses.forEach(function(item){
                course = item.text;
                item.innerItems.forEach(function(item){
                    title = item.title;
                    date = item.date;
                    time = item.time;
                    color = item.color;
                    console.log(course + " " + title + " " + date + " " + time + " " + color);
                    var resource = {
                        "summary": course + ": " + title,
                        "colorId": color,
                        "start": {
                            "dateTime": "2015-12-10T12:00:00.000-07:00"
                        },
                        "end": {
                            "dateTime": "2015-12-10T12:30:00.000-07:00"
                        }
                    };
                    //console.log(resource);
                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': resource
                    });
                    request.execute(function(resp) {
                        console.log(resp);
                    });
                });
            });
        }
    },
    componentDidMount: function(){
        console.log("mounted");
    },
    render: function(){
        return (
            <div>
                <h2>Google Calendar Publisher
                    <button className="btn btn-success" style={{float:'right', marginLeft:'5px', borderRadius:'0'}} onClick={this.Publish}>Publish</button>
                </h2>
                <form onSubmit={this.handleSubmit}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <input placeholder="New Course" onChange={this.onChange} value={this.state.panelHeading} /> <div onClick={this.handleSubmit} className="glyphicon glyphicon-plus add-course" />
                        </h4>
                    </div>
                </div>
                </form>
                <Course items={this.state.courses} />
            </div>
        );
    }
});

ReactDOM.render(
    <CourseData />,
    document.getElementById('courses')
);
