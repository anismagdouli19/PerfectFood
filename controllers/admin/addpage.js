import React, { Component ,PropTypes,Fragment} from 'react';
import { Link, IndexLink } from 'react-router';
import { ADMIN_API_URL } from '../../actions/index';
import axios from 'axios';
import {getSettings,saveSettings} from '../../actions/settings';
import { connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import CKEditor from "react-ckeditor-component";

const input = ({input,type,placeholder,id,className,meta: { touched, error },...rest}) => {
return (
<div>
   <input {...input} placeholder={placeholder} type={type} id={id} className={className}/>
   {touched && error && <p style={{ color: 'red' }}>{error}</p>}
</div>
);
};
var myValidator = values => {
const errors = {};
// if (!values.password) {
//   errors.password = 'Password is required';
// } else if (values.password.length < 3) {
//   errors.password = "Password can't be that short!";
// }
// if (!values.email) {
//   errors.email = 'Hold on a minute, we need an email!';
// } else if (!/(.+)@(.+){2,}\.(.+){2,}/i.test(values.email)) {
//   // use a more robust RegEx in real-life scenarios
//   errors.email = 'Valid email please!';
// }
// return errors;
};
const form = reduxForm({
form: 'gatorForm',
validate: myValidator
});

class addPage extends Component {

  constructor(props) {
       super(props);
       this.state = {
           content: '',
           featured:[],
           title:''
       }
      // this.onFormSubmit = this.onFormSubmit.bind(this);
       this.onChangeimage = this.onChangeimage.bind(this);
       this.onChange = this.onChange.bind(this);
   }

  handleFormSubmit(formProps) {
	//	e.preventDefault();
console.log(formProps);
    //var ckcontent= evt.editor.getData();
		const formData = new FormData();
		formData.append('featured', this.state.featured);
    formData.append('content',this.state.content);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		};
		for (var pair of formData.entries()) {
			console.log(pair[0]+pair[1]);
		}
		axios.post(`${ADMIN_API_URL}/addPage`, formData, config)
			.then((response) => {
				console.log(response);
				alert("The file is successfully uploaded");
			}).catch((error) => {
				alert("error");
			});
	}
onChangeimage(e) {
this.setState({featured:e.target.files[0]});
}
onChange(evt){
      console.log("onChange fired with event info: ", evt);
      var newContent = evt.editor.getData();
      this.setState({
        content: newContent
      })
    }
  render() {
    const { handleSubmit, reset, pristine, submitting, valid } = this.props;
    return (
      <div className="inner_right">
         <div className="breadcrumbs">
            <div className="col-sm-4">
               <div className="page-header float-left">
                  <div className="page-title">
                     <h1>Dashboard</h1>
                  </div>
               </div>
            </div>
            <div className="col-sm-8">
               <div className="page-header float-right">
                  <div className="page-title">
                     <ol className="breadcrumb text-right">
                        <li className="active">Dashboard</li>
                     </ol>
                  </div>
               </div>
            </div>
         </div>
         <div className="content mt-12">
            <div className="col-sm-12">

               <div className="settings">
                  <div className="col-lg-12">
                     <div className="card">
                        <div className="card-body card-block">
                        <form  onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                           <div className="row form-group">
                                 <div className="col col-md-3"><label  className=" form-control-label">Featured Image</label></div>
                                 <div className="col-12 col-md-7"> <input type="file" name="myImage" onChange= {this.onChangeimage} /></div>
                           </div>
                              <div className="row form-group">
                                 <div className="col col-md-3"><label  className=" form-control-label">Title</label></div>
                                 <div className="col-12 col-md-9">
                                    <Field type="text"  component="input" id="text-input"  required name="title" placeholder="Enter Page title"  className="form-control"  />
                                 </div>
                              </div>
                              <div className="row form-group">
                                 <div className="col col-md-3"><label  className=" form-control-label">Sub Header</label></div>
                                 <div className="col-12 col-md-9">
                                 <CKEditor
                                      activeClass="p10"
                                      content={this.state.content}
                                      required name="content"
                                      events={{
                                     "blur": this.onBlur,
                                     "afterPaste": this.afterPaste,
                                     "change": this.onChange
                                   }}
                                    />
                                 </div>
                              </div>
                              <button type="submit"  className="btn btn-success" disabled={pristine || submitting} >Submit</button>
                              <button type="button" className="btn btn-info" disabled={!valid || pristine || submitting} onClick={reset}>
                              Clear Values
                              </button>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }
}

export default connect(null, { })(reduxForm({
form: 'simple',
enableReinitialize: true,
keepDirtyOnReinitialize : true,
})(addPage));
