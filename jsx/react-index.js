console.log("react-index.js");

import React from 'react';
import ReactDOM from 'react-dom';


/**
 * require keys and row in props
 */
function ClinicsRow(props) {
  return (
    <tr>
      {props.keys.map(function(v,i){
        return <td key={v}>{props.row[v]}</td>
      })}
    </tr>
  )
}

function ClinicsHeader(props) {
  return (
    <thead>
      <tr>
        {props.keys.map(function(v,i){
          return <th key={v+i.toString()}>{v}</th>;
        })}
      </tr>
    </thead>
  );
}

function ClinicsTable(props){
  if (props.rows.length==0) return null;

  var keys = Object.keys(props.rows[0]);
  keys = keys.filter(function(k){
    var expections = ["latlong", "sub_type", "longitude", "latitude", "organisation_type"];
    return !(expections.indexOf(k)>=0);
  });
  return (
    <table>
      <ClinicsHeader keys={keys} />
      <tbody>
        {props.rows.map(function(v,i){
          return <ClinicsRow key={i.toString()} keys={keys} row={v} />
        })}
      </tbody>
    </table>
  )
}

ClinicsRow.propTypes = {
  row: React.PropTypes.object.isRequired
}

class ClinicsSection extends React.Component {
  constructor (props) {
    super(props);
    // how to add listener?
    this.formSubmit = this.formSubmit.bind(this);
    this.state = {rows: []};
    console.log("constructing!");
  }
  componentDidMount(){
    console.log("mounted!");
  }
  componentWillUnmount(){
    console.log("unmounted!");
  }

  // handler
  formSubmit(e) {
    e.preventDefault();
    var api = "https://data.gov.uk/data/api/service/health/sql?query={q}";
    var number = e.target.elements["number-of-clinics"].value;
    var url = api.replace('{q}', "SELECT * FROM clinics LIMIT {value}").replace("{value}", number);
    var self = this;
    fetch(url)
    .then(function(response){
      return response.json();
    }).then((json) => {
      // notice why I use arrow function in here?
      // set state
      if (json["success"]){
        var result = json["result"];
        this.setState({
          rows: result
        });
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.formSubmit}> {/* This is an extra wrapper compare with pure */}
        <h2>Get Clinics in UK</h2>
        <p>This part will illurstrate fetching data from API (<a href="https://data.gov.uk/data/api/">https://data.gov.uk/data/api/</a>)</p>
        <label htmlFor="number-of-clinics">Number of Clinics:</label>
        <select name="number-of-clinics" id="number-of-clinics">
          <option value="10">10</option>
          <option value="100">100</option>
          <option value="1000">1000</option>
        </select>
        <input type="submit" className="clinics-get-btn" value="Get" />
        <div className="content">
          <ClinicsTable rows={this.state.rows} />
        </div>
      </form>
    );
  }
}

const clinicsW = <ClinicsSection />;
ReactDOM.render(clinicsW, document.getElementById("demo-table"));
