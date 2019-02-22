import React from "react";
import MYResult from "../json/results.json";
import BootstrapTable from "react-bootstrap-table-next";
import Button from "./Button";
import MyModal from "./MyModal";
import "../css/mystyles.css";
import "bootstrap/dist/css/bootstrap.css";
import { Image } from "react-bootstrap";

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.input = React.createRef();

    this.state = {
      show: false,
      data: MYResult.Products || [],
      actualData: MYResult.Products || [],
      columns: MYResult.ParametricList_Attributes || [],
      filterAttributes: MYResult.ParametricList_Filter_Attributes,
      isCompareClicked: false,
      isDisabled: true,
      selected: [],
      activeFilter: false,
      checkboxInputValue: "",
      modalBody: ""
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(event) {
    this.setState({ show: true, checkboxInputValue: event.target.value });
  }

  componentDidMount() {
    const radio = (column, colIndex) => {
      //console.log(colIndex)
      //console.log("column text "+column.text)
      if ("Part Number" === column.text || "Product Line" === column.text) {
        return (
          <div>
            {column.text}
            <span>
              <input
                type="radio"
                name="parametricfilter"
                value={column.text}
                ref={this.input}
                onClick={this.handleShow}
              />
            </span>
          </div>
        );
      } else {
        return <div>{column.text} </div>;
      }
    };
    const newColumn = this.state.columns.map(column => {
      //console.log("column --"+column.text)
      return { ...column, headerFormatter: radio };
    });
    //console.log("newColumn --"+newColumn)
    this.setState({ columns: newColumn });

    const filterAttrs = this.state.filterAttributes.map(attr => {
      return Object.values(attr);
    });
    this.setState({ filterAttributes: filterAttrs });
  }

  onSelectClick = (row, isSelect) => {
    let modifiedRow;
    if (isSelect) {
      console.log("inside if " + this.state.selected);
      modifiedRow = [...this.state.selected, row.PartNumber];
    } else {
      console.log("inside else " + this.state.selected);
      modifiedRow = this.state.selected.filter(s => s !== row.PartNumber);
    }
    //console.log("modifiedRow -- "+modifiedRow)
    this.setState({ isCompareClicked: true, selected: modifiedRow });
    if (modifiedRow.length < 2) {
      this.setState({ isDisabled: true });
    } else {
      this.setState({ isDisabled: false });
    }
  };

  onButtonClick = () => {
    const data = this.state.data;
    const selectedData = this.state.selected;
    console.log("selectedData -- " + selectedData);
    let filterredData = data.filter(row =>
      selectedData.includes(row.PartNumber)
    );
    this.setState({ data: filterredData, activeFilter: true });
  };

  onSelectAll = (isSelect, rows) => {
    //console.log("rows --- "+rows);
    //console.log("isSelect --- "+isSelect);
    let newRows = isSelect ? rows.map(row => row.PartNumber) : [];
    this.setState({ selected: newRows });

    if (isSelect) {
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }
  };

  onClearClick = () => {
    this.setState(state => ({
      data: state.actualData,
      selected: [],
      isDisabled: true,
      activeFilter: false
    }));
  };

  fullList() {
    var selectRowProp = {
      mode: "checkbox",
      clickToSelect: true,
      selected: this.state.selected,
      onSelect: this.onSelectClick,
      onSelectAll: this.onSelectAll
    };
    return (
      <BootstrapTable
        keyField="PartNumber"
        selectRow={selectRowProp}
        data={this.state.data}
        columns={this.state.columns}
      />
    );
  }

  compareView() {
    //const filters = [...this.state.filterAttributes]
    const filteredPartNumbers = this.state.data.map(
      partnumbers => partnumbers.PartNumber
    );
    const filteredProductLines = this.state.data.map(
      productlines => productlines.productline
    );
    const filteredProductImages = this.state.data.map(
      productimages => productimages.url
    );
    // console.log("filteredPartNumbers --"+filteredPartNumbers )
    // console.log("filteredProductLines --"+filteredProductLines )
    return (
      <div>
        <table
          id="compare-results-table"
          className="table vertical table-bordered"
        >
          <tbody>
            <tr>
              <th>Part Number</th>
              {filteredPartNumbers.map(k => (
                <td key={k}>{k}</td>
              ))}
            </tr>
            <tr>
              <th>Product Line</th>
              {filteredProductLines.map(k => (
                <td key={k}>{k}</td>
              ))}
            </tr>
            <tr>
              <th>Product Image</th>
              {filteredProductImages.map(k => (
                <td key={k}>
                  <Image src={k} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    //console.log(this.state);
    const allPartNumbers = this.state.data.map(
      partnumbers => partnumbers.PartNumber
    );
    const allProductLines = this.state.data.map(
      productlines => productlines.productline
    );

    var btnstyle = { marginRight: "10px" };

    return (
      <div>
        <Button
          onClick={this.onButtonClick}
          text="Compare"
          isDisabled={this.state.isDisabled}
          style={btnstyle}
        />
        <Button onClick={this.onClearClick} text="Clear" />
        <br />
        <br />
        {!this.state.activeFilter ? this.fullList() : this.compareView()}
        <br />
        <MyModal
          show={this.state.show}
          handleClose={this.handleClose}
          body={
            this.state.checkboxInputValue === "Part Number"
              ? allPartNumbers
              : allProductLines
          }
          title={this.state.checkboxInputValue}
          submit={this.onButtonClick}
        />
      </div>
    );
  }
}

export default Container;
