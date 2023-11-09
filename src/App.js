//import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import Table from "./components/Table";

function App() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <Header />
      <div className="flex-1"></div>
      <Table />
    </div>
  );
}

export default App;
