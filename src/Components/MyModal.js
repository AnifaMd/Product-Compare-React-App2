import React from 'react';
import { Modal, Image } from 'react-bootstrap';
import Button from './Button';
import MYResult from '../json/results.json';
import 'bootstrap/dist/css/bootstrap.css';

export default class MyModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: MYResult.Products || [],
      selected: []
    };

    //this.onSubmit = this.onSubmit.bind(this);
  }

  modalbody() {
    return (
      <div className="row">
        {this.props.body.map(k =>
          <div className="col-12 col-sm-6">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" value={k} onChange={this.onSelect.bind(this)} />
              <label className="form-check-label" key={k}>{k}</label>
            </div>
          </div>
        )}
      </div>
    )
  }

  onSelect(event) {
    //console.log("input val --"+event.target.value)
    let modifiedRow;
    if (event.target.checked) {
      modifiedRow = [...this.state.selected, event.target.value];
    } else {
      modifiedRow = this.state.selected.filter(s => s !== event.target.value);
    }
    //console.log("modifiedRow -- "+modifiedRow)

    this.setState({ selected: modifiedRow });
  }

  onSubmit = (event) => {
    //this.props.handleClose
    event.preventDefault();
    this.props.handleClose();
    const data = this.state.data;
    const selectedData = this.state.selected;
    console.log("selectedData -- " + selectedData)
    let filterredData = data.filter(row =>
      selectedData.includes(row.PartNumber)
    );
    this.setState({ data: filterredData });

    const filteredPartNumbers = this.state.data.map(partnumbers => partnumbers.PartNumber);
    const filteredProductLines = this.state.data.map(productlines => productlines.productline);
    const filteredProductImages = this.state.data.map(productimages => productimages.url);

    return (
      <div>
        <table id="compare-results-table" className="table vertical table-bordered">
          <tbody>
            <tr>
              <th>Part Number</th>
              {filteredPartNumbers.map(k => <td key={k}>{k}</td>)}
            </tr>
            <tr>
              <th>Product Line</th>
              {filteredProductLines.map(k => <td key={k}>{k}</td>)}
            </tr>
            <tr>
              <th>Product Image</th>
              {filteredProductImages.map(k => <td key={k}><Image src={k} /></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    )
  };


  render() {
    // console.log("inmodal =="+this.props.allPartNumbers)
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.modalbody()}
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={this.onSubmit.bind(this)} >Submit</button>
          <Button variant="primary" onClick={this.props.handleClose} text="Reset" />
        </Modal.Footer>
      </Modal>
    )
  }
}