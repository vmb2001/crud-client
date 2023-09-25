import React from "react";

function Page({ currentpage, setcurrentpage, nPage }) {
  const num = [];
  const maxVpages = 8;
  const halfMax = Math.floor(maxVpages / 2);
  const startPage = Math.max(1, currentpage - halfMax);
  const endPage = Math.min(nPage, startPage + maxVpages - 1);
  for (let i = startPage; i <= endPage; i++) {
    num.push(i);
  }

  function prePage() {
    if (currentpage !== 1) {
      setcurrentpage(currentpage - 1);
    }
  }

  function changeCpage(id) {
    setcurrentpage(id);
  }

  function nextPage() {
    if (currentpage < nPage) {
      setcurrentpage(currentpage + 1);
    }
  }
  return (
    <nav className="page">
      <ul className="pagination">
        <li className="page-item">
          <a href="#" className="page-link" onClick={() => prePage()}>
            Prev
          </a>
        </li>
        {num.map((n, i) => (
          <li
            className={`page-item ${currentpage === n ? "active" : ""}`}
            key={i}
          >
            <a href="#" className="page-link" onClick={() => changeCpage(n)}>
              {n}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a href="#" className="page-link" onClick={() => nextPage()}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}
export default Page;
