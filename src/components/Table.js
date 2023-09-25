import React, { useEffect, useState } from "react";
import "./Table.css";
import Swal from "sweetalert2";
import swal from "sweetalert";
import axios from "axios";
import Page from "./Page";

function Table({ Data, setData }) {
  //Function for sorting array

  const Sort = (newdata) => {
    const ndata = newdata.sort((a, b) => {
      let fa = a.first_name.toLowerCase();
      let fb = b.first_name.toLowerCase();
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    return ndata;
  };

  //Function to get current date
  const getDate = () => {
    const now = new Date();
    const date =
      now.getFullYear() +
      "-" +
      (now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1) +
      "-" +
      now.getDate() +
      " " +
      now.getHours() +
      ":" +
      (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
      ":" +
      (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
    return date;
  };
  const cdata = Sort([...Data]);
  const [searchValue, setSearchvalue] = useState("");

  //For maintaining a copy of Data to reset table when search from is empty
  const [updateData, setUpdatedata] = useState("");
  useEffect(() => {
    setUpdatedata(Data);
  }, [Data]);

  //Declaring variables required for pagination
  const [currentPage, setcurrentPage] = useState(1);
  const recordPerPage = 9;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = cdata.slice(firstIndex, lastIndex);
  const npage = Math.ceil(Data.length / recordPerPage);

  //Function for adding customer
  const add = () => {
    Swal.fire({
      title: "Add Employee",
      html: `<div className="form-group"><label for="swal-input1"  style="width: 100px;">Email ID:</label>
          <input label="email" id="swal-input1" value="" class="swal2-input"><div/>
          <div className="form-group"><label for="swal-input2" style="width: 100px;">First Name:</label>
          <input id="swal-input2" value="" class="swal2-input"><div/>
          <div className="form-group"><label for="swal-input3" style="width: 100px;">Last Name:</label>
          <input id="swal-input3" value="" class="swal2-input"><div/>
          <div className="form-group"><label for="swal-input4" style="width: 100px;">IP Address:</label>
          <input id="swal-input4" value="" class="swal2-input"><div/>
          <div className="form-group"><label for="swal-input5" style="width: 100px;">Latitude:</label>
          <input id="swal-input5" value="" class="swal2-input"><div/>
          <div className="form-group"><label for="swal-input6" style="width: 100px;">Longitude:</label>
          <input id="swal-input6" value="" class="swal2-input"><div/>`,

      showCancelButton: true,
      confirmButtonText: "Add",
    }).then((result) => {
      if (result.isConfirmed) {
        const new_email = document.getElementById("swal-input1").value;
        const new_first_name = document.getElementById("swal-input2").value;
        const new_last_name = document.getElementById("swal-input3").value;
        const new_ip = document.getElementById("swal-input4").value;
        const new_latitude = document.getElementById("swal-input5").value;
        const new_longitude = document.getElementById("swal-input6").value;

        let update = [...Data];
        //Calculating id of the element to be added
        let items = [];
        update.map((item) => items.push(item.id));
        const m = Math.max(...items);
        const new_id = m + 1;

        const date = getDate();

        const obj = {
          id: new_id,
          email: new_email,
          first_name: new_first_name,
          last_name: new_last_name,
          ip: new_ip,
          latitude: new_latitude,
          longitude: new_longitude,
          created_at: date,
        };
        update.push(obj);
        update = Sort(update);
        axios
          .post("http://localhost:3001/api/customers", {
            email: new_email,
            first_name: new_first_name,
            last_name: new_last_name,
            ip: new_ip,
            latitude: new_latitude,
            longitude: new_longitude,
            created_at: date,
          })
          .catch((err) => {
            alert(`An error has occured while adding ${err}`);
          });
        setUpdatedata(update);
        setData(update);
      }
    });
  };

  //Function to get value entered in the search form
  const getSearchvalue = (e) => {
    const s = e.target.value;
    if (s === "") {
      console.log("inside empty search");
      //console.log(updateData);
      setData(updateData);
      setSearchvalue("");
      console.log("Searchvalue:" + searchValue);
    } else setSearchvalue(s);
  };

  //Function to display search result
  const handleSearch = () => {
    let flag = 0;
    if (searchValue !== "") {
      const searchData = Data.filter((value) => {
        if (
          value.first_name.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          flag = 1;
          return true;
        } else return false;
      });
      if (flag === 0) new Swal("Not Found");
      else setData(searchData);
    }
  };

  //Function to delete customer
  const del = (id) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure u want to delete this row?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const update = Data.filter((item) => item.id != id);
        axios
          .delete(`http://localhost:3001/api/customers${id}`)
          .catch((err) => {
            alert(`An error has occured while deleting ${err}`);
          });
        setUpdatedata(update);
        setData(update);
        swal({
          title: "Successfully Deleted",
          icon: "success",
        });
      }
    });
  };

  //Function to edit customer details
  const update = (id) => {
    Data.map((item) => {
      if (item.id === id) {
        Swal.fire({
          title: "Edit Employee Details",
          html: `<div className="form-group"><label for="swal-input1"  style="width: 100px;">Email ID:</label>
                <input label="email" id="swal-input1" value=${item.email} class="swal2-input"><div/>
                <div className="form-group"><label for="swal-input2" style="width: 100px;">First Name:</label>
                <input id="swal-input2" value=${item.first_name} class="swal2-input"><div/>
                <div className="form-group"><label for="swal-input3" style="width: 100px;">Last Name:</label>
                <input id="swal-input3" value=${item.last_name} class="swal2-input"><div/>
                <div className="form-group"><label for="swal-input4" style="width: 100px;">IP Address:</label>
                <input id="swal-input4" value=${item.ip} class="swal2-input"><div/>
                <div className="form-group"><label for="swal-input5" style="width: 100px;">Latitude:</label>
                <input id="swal-input5" value=${item.latitude} class="swal2-input"><div/>
                <div className="form-group"><label for="swal-input6" style="width: 100px;">Longitude:</label>
                <input id="swal-input6" value=${item.longitude} class="swal2-input"><div/>`,

          showCancelButton: true,
          confirmButtonText: "Save",
        }).then((result) => {
          if (result.isConfirmed) {
            //Storing the new customer details
            const new_email = document.getElementById("swal-input1").value;
            const new_first_name = document.getElementById("swal-input2").value;
            const new_last_name = document.getElementById("swal-input3").value;
            const new_ip = document.getElementById("swal-input4").value;
            const new_latitude = document.getElementById("swal-input5").value;
            const new_longitude = document.getElementById("swal-input6").value;
            const date = getDate();

            let update = [...Data];
            //Finding index of the customer to be updated
            const itemIndex = update.findIndex((item) => item.id === id);

            //Updating customer details
            if (itemIndex !== -1) {
              update[itemIndex].email = new_email;
              update[itemIndex].first_name = new_first_name;
              update[itemIndex].last_name = new_last_name;
              update[itemIndex].ip = new_ip;
              update[itemIndex].latitude = new_latitude;
              update[itemIndex].longitude = new_longitude;
              update[itemIndex].updated_at = date;
              update = Sort(update);
              setUpdatedata(update);
              setData(update);
            }
            axios
              .patch(`http://localhost:3001/api/customers${id}`, {
                email: new_email,
                first_name: new_first_name,
                last_name: new_last_name,
                ip: new_ip,
                latitude: new_latitude,
                longitude: new_longitude,
                updated_at: date,
              })
              .catch((err) => {
                alert(`An error has occured while updating ${err}`);
              });
            swal("Updated", "Data has been updated successfully", "success");
          }
        });
      }
    });
  };

  return (
    <div className="con">
      <nav className="navbar fixed-top navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">
            <h3>Employee Data</h3>
          </a>
          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search By First Name"
              aria-label="Search"
              onChange={getSearchvalue}
            ></input>
            <button
              className="btn btn-outline-success"
              type="submit"
              onClick={() => handleSearch()}
            >
              Search
            </button>
          </form>
        </div>
      </nav>
      <div className="table-responsive m-3">
        <div className="container-fluid">
          <div className="emp-btn">
            <button className="btn btn-primary" onClick={() => add()}>
              Add Employee
            </button>
          </div>
          <table id="myTable" className="table table-hover table-stripped">
            <thead className="table table-dark">
              <tr>
                <th>Id</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>IP</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, index) => (
                <tr className="rows" key={item.id} id={item.id}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.ip}</td>
                  <td>{item.latitude}</td>
                  <td>{item.longitude}</td>
                  <td>{item.created_at}</td>
                  <td>{item.updated_at}</td>
                  <td>
                    <div className="btn-container">
                      <button
                        className="btn btn-danger"
                        id={item.id}
                        onClick={() => del(item.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => update(item.id)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Page
          currentpage={currentPage}
          setcurrentpage={setcurrentPage}
          nPage={npage}
        />
      </div>
    </div>
  );
}
export default Table;
