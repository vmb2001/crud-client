import React, { useEffect, useState } from "react";
import "./Table.css";
import Swal from "sweetalert2";
import swal from "sweetalert";
import axios from "axios";
import Page from "./Page";

function Table({ Data, setData }) {
  // Function for sorting array
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

  // Function to get current date
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

  // Declaring variables required for pagination
  const [currentPage, setcurrentPage] = useState(1);
  const recordPerPage = 7;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = cdata.slice(firstIndex, lastIndex);
  const npage = Math.ceil(Data.length / recordPerPage);

  // Function for adding a customer
  const add = () => {
    Swal.fire({
      title: "Add Employee",
      html: `<div className="form-group"><label for="swal-input1" style="width: 100px;">Email ID:</label>
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

        // Create a new customer object
        const newCustomer = {
          email: new_email,
          first_name: new_first_name,
          last_name: new_last_name,
          ip: new_ip,
          latitude: new_latitude,
          longitude: new_longitude,
          created_at: getDate(),
        };

        // Make an API call to add the new customer
        axios
          .post("http://localhost:3001/api/customers", newCustomer)
          .then((response) => {
            if (response.status === 200) {
              // The customer added successfully, so fetch updated data
              axios
                .get("http://localhost:3001/api")
                .then((result) => {
                  setData(Sort(result.data));
                })
                .catch((error) => {
                  console.error("Error fetching data:", error);
                });
            }
          })
          .catch((err) => {
            alert(`An error has occurred while adding ${err}`);
          });
      }
    });
  };

  // Function to get value entered in the search form
  const getSearchvalue = (e) => {
    const s = e.target.value;
    if (s === "") {
      //Reset data if search empty
      axios
        .get("http://localhost:3001/api")
        .then((result) => {
          setData(result.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      setSearchvalue("");
    } else setSearchvalue(s);
  };

  // Function to display search result
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
      if (flag === 0) swal("Not Found");
      else setData(searchData);
    }
  };

  // Function to delete customer
  const del = (id) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure u want to delete this row?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Make an API call to delete the customer
        axios
          .delete(`http://localhost:3001/api/customers${id}`)
          .then((response) => {
            if (response.status === 200) {
              // The customer was deleted successfully, so fetch updated data
              axios
                .get("http://localhost:3001/api")
                .then((result) => {
                  setData(Sort(result.data));
                })
                .catch((error) => {
                  console.error("Error fetching data:", error);
                });
            }
          })
          .catch((err) => {
            alert(`An error has occurred while deleting ${err}`);
          });
      }
    });
  };

  // Function to edit customer details
  const update = (id) => {
    Data.map((item) => {
      if (item.id === id) {
        Swal.fire({
          title: "Edit Employee Details",
          html: `<div className="form-group"><label for="swal-input1" style="width: 100px;">Email ID:</label>
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
            // Get the new customer data
            const new_email = document.getElementById("swal-input1").value;
            const new_first_name = document.getElementById("swal-input2").value;
            const new_last_name = document.getElementById("swal-input3").value;
            const new_ip = document.getElementById("swal-input4").value;
            const new_latitude = document.getElementById("swal-input5").value;
            const new_longitude = document.getElementById("swal-input6").value;
            const date = getDate();

            // Make an API call to update the customer
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
              .then((response) => {
                if (response.status === 200) {
                  // The customer was updated successfully, so fetch updated data
                  axios
                    .get("http://localhost:3001/api")
                    .then((result) => {
                      setData(Sort(result.data));
                    })
                    .catch((error) => {
                      console.error("Error fetching data:", error);
                    });
                }
              })
              .catch((err) => {
                alert(`An error has occurred while updating ${err}`);
              });
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
              <tr key={item.id} id={item.id}>
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
