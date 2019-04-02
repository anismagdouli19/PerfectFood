'use strict';
import React, { Component ,PropTypes,Fragment} from 'react';
import { Link, IndexLink } from 'react-router';
import { ADMIN_API_URL } from '../../actions/index';
import axios from 'axios';
import {getSettings,saveSettings} from '../../actions/settings';
import { connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Dropzone from 'react-dropzone';

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
class Settings extends Component {
	constructor() {
		super()
		this.state = {
			banner: null,
			SocialLinks: [],
			errorMessage: "",
			file: null
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
    this.onFormSubmit1 = this.onFormSubmit1.bind(this);
    this.onChange1 = this.onChange1.bind(this);
	}

  /**** logo upload **/
	onFormSubmit(e) {
		e.preventDefault();
		const formData = new FormData();
		formData.append('logo', this.state.file);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		};
		for (var pair of formData.entries()) {
			console.log(pair[1]);
		}
		axios.post(`${ADMIN_API_URL}/addLogo`, formData, config)
			.then((response) => {
				console.log(response);
				alert("The file is successfully uploaded");
			}).catch((error) => {
				alert("error");
			});
	}
onChange(e) {
this.setState({file:e.target.files[0]});
}
/**** logo upload end**/
/*** banner upload **/
onFormSubmit1(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('banner', this.state.banner);
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  for (var pair of formData.entries()) {
    console.log(pair[1]);
  }
  axios.post(`${ADMIN_API_URL}/addBanner`, formData, config)
    .then((response) => {
      console.log(response);
      alert("The file is successfully uploaded");
    }).catch((error) => {
      alert("error");
    });
}
onChange1(e) {
this.setState({banner:e.target.files[0]});
//console.log(this.state.banner);
}
/**** banner upload end ***/

componentDidMount() {
	this.props.getSettings().then(
		(response) => {
			//    console.log(response.settings[0].header);
			const SocialLinks = response.settings;
			this.setState({
				SocialLinks: response.settings
			})
			var initData = {
				"header": response.settings[0].header,
				"sub_header": response.settings[0].sub_header,
				"instagram": response.settings[0].instagram,
				"facebook": response.settings[0].facebook,
				"twitter": response.settings[0].twitter,
				"linkedin": response.settings[0].linkedin,
				"youtube": response.settings[0].youtube,
				"copyright": response.settings[0].copyright,
			};
			this.props.initialize(initData);
		},
		(err) => err.response.json().then(({
			errors
		}) => {
			console.log('**** get user reviews error ****' + JSON.stringify(errors));
		})
	)
}
handleFormSubmit(formProps) {
	try {
		//  console.log(formProps);
		this.props.saveSettings(formProps).then(
			(response) => {
				//console.log(response);
				const SocialLinks = response.settings;
				this.setState({
					SocialLinks
				})
			},
			(err) => err.response.json().then(({
				errors
			}) => {
				console.log('**** get user reviews error ****' + JSON.stringify(errors));
			})
		)
	} catch (e) {
		console.log("Catch");
		console.log("ERRRRR");
		console.log(e)
	}
}
render() {

const { handleSubmit, reset, pristine, submitting, valid } = this.props;
let links=this.state.SocialLinks;
console.log(links);
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
            {this.state.errorMessage && this.state.errorMessage!=null && this.state.errorMessage!=undefined && this.state.errorMessage!="" &&
              <div className="alert alert-danger">{this.state.errorMessage}</div>
            }
            {this.state.successMessage && this.state.successMessage!=null && this.state.successMessage!=undefined && this.state.successMessage!="" &&
              <div className="alert alert-success">{this.state.successMessage}</div>
            }
         <div className="settings">
            <div className="col-lg-6">
               <div className="card">
                  <div className="card-body card-block">
                     <div className="row form-group">
                        <form onSubmit={this.onFormSubmit}>
                           <div className="col col-md-3"><label  className=" form-control-label">Logo</label></div>
                           <div className="col-12 col-md-7"> <input type="file" name="myImage" onChange= {this.onChange} /></div>
                           <div className="col-12 col-md-2"><button type="submit" className="btn btn-success">Upload</button></div>
                        </form>
                     </div>
                     <div className="row form-group">
                        <form onSubmit={this.onFormSubmit1}>
                           <div className="col col-md-3"><label  className=" form-control-label">Header Banner</label></div>
                           <div className="col-12 col-md-7"> <input type="file" name="banner" onChange= {this.onChange1} /></div>
                           <div className="col-12 col-md-2"><button type="submit" className="btn btn-success">Upload</button></div>
                        </form>
                     </div>
                     <form   onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                        <div className="row form-group">
                           <div className="col col-md-3"><label  className=" form-control-label">Header</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text" component="input" id="text-input"  required name="header" placeholder="Enter Header"  className="form-control"  />
                           </div>
                        </div>
                        <div className="row form-group">
                           <div className="col col-md-3"><label  className=" form-control-label">Sub Header</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text" component="input" id="text-input"  required name="sub_header" placeholder="Enter Sub Header"  className="form-control" />
                           </div>
                        </div>
                        <div className="row form-group">
                           <div className="col col-md-3"><label  className=" form-control-label">Instagram</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text" component="input" id="instagram-input" required name="instagram" placeholder="Instagram" className="form-control"   />
                           </div>
                        </div>
                        <div className="row form-group">
                           <div className="col col-md-3"><label  className=" form-control-label">Facebook</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text" component="input" id="facebook-input" required name="facebook" placeholder="Facebook" className="form-control" />
                           </div>
                        </div>
                        <div className="row form-group">
                           <div className="col col-md-3"><label className=" form-control-label">Twitter</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text"  component="input" id="twitter-input" required name="twitter" placeholder="Twitter" className="form-control"   />
                           </div>
                        </div>
                        <div className="row form-group">
                           <div className="col col-md-3"><label  className=" form-control-label">Linkedin</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text" component="input" id="linkedin-input" required name="linkedin" placeholder="Linkedin" className="form-control"  />
                           </div>
                        </div>
                        <div className="row form-group">
                           <div className="col col-md-3"><label  className=" form-control-label">Youtube</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text" component="input" id="youtube-input" required  name="youtube" placeholder="Youtube" className="form-control"  />
                           </div>
                        </div>
                        <div className="row form-group">
                           <div className="col col-md-3"><label  className=" form-control-label">Copyright Text</label></div>
                           <div className="col-12 col-md-9">
                              <Field type="text" component="input"  id="copyright-input" required name="copyright" placeholder="Copyright Text"  className="form-control" />
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
function mapStateToProps(state) {
return {
loaded: !!this.state.SocialLinks,
initialValues: this.state.SocialLinks
};
}
export default connect(null, { saveSettings,getSettings })(reduxForm({
form: 'simple',
saveSettings,
enableReinitialize: true,
keepDirtyOnReinitialize : true,
})(Settings));
