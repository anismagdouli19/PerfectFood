import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL } from '../../actions/index';
import axios from 'axios';
import {getPersonal} from '../../actions/settings';
import { connect} from 'react-redux';
import moment from 'moment';
import DataTable from 'react-redux-datatable';
import 'react-redux-datatable/dist/styles.css';

const apiLocation = {
  "searchSuccess": true,
  "dataTotalSize": 2,
  "data": [
    {
      "ref_id":"5",
      "first_name":"Ted",
      "surname":"Corkscrew",
      "type":"Add"
    },
    {
      "ref_id":"26",
      "first_name":"Edwina",
      "surname":"Hosepipe",
      "type":"Add"
    }
  ]
}

const tableSettings = {
    tableID: 'DataTable',
    keyField: 'ref_id',
    tableColumns: [
        {
            title: 'Ref',
            key: 'ref_id',
            filter: 'NumberFilter',
            defaultValue: { comparator: '=' },
        },
        {
            title: 'First Name',
            key: 'first_name',
        },
        {
            title: 'Surname',
            key: 'surname',
        },
        {
            title: 'Type',
            key: 'type',
            filter: 'SelectFilter',
            filterOptions: {
                Add: 'Add',
                Amend: 'Amend',
                Remove: 'Remove',
            },
        },
    ],
};

const DataTable1 = () => (
    <DataTable
      tableSettings={tableSettings}
      apiLocation={apiLocation}
    />
);
class Personal extends Component {

  componentDidMount() {
    this.props.getPersonal().then(
      (response) => {
        //    console.log(response.settings[0].header);
        // const SocialLinks = response.settings;
        // this.setState({
        //   SocialLinks: response.settings
        // })
        var initData = {
          // "header": response.settings[0].header,
          // "sub_header": response.settings[0].sub_header,
          // "instagram": response.settings[0].instagram,
          // "facebook": response.settings[0].facebook,
          // "twitter": response.settings[0].twitter,
          // "linkedin": response.settings[0].linkedin,
          // "youtube": response.settings[0].youtube,
          // "copyright": response.settings[0].copyright,
        };
      //  this.props.initialize(initData);
      },
      (err) => err.response.json().then(({
        errors
      }) => {
        console.log('**** get user reviews error ****' + JSON.stringify(errors));
      })
    )
  }

  render() {

    return (
      <div className="personal">
      egeg {DataTable1}
      </div>
    );
  }
}

export default connect(null, { getPersonal })((Personal));
