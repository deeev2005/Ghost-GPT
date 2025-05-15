import { useEffect } from "react";

function BackendTest() {
  useEffect(() => {
    fetch("http://localhost:5000")
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error("Error fetching backend:", error));
  }, []);

  return <h2>Testing Backend Connection...</h2>;
}

export default BackendTest;
