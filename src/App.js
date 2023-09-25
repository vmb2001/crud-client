import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "./components/Table";

function App() {
  const [customers, setCustomers] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api")
      .then((result) => setCustomers(result.data));
  }, []);

  console.log(customers);

  return (
    <div>
      <Table Data={customers} setData={setCustomers} />
    </div>
  );
}

export default App;
