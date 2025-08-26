import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./App.css";

import GuardRoute from "./authentication/guardRoute";
// import Navbar from "./share-view/navbar";
import RouterView from "./web-view/router-view";

import UserRouter from "./user-view/router-user";

// import HeaderUser from "./user-view/components/headerUser";

import RouterAdmin from "./admin-view/router-admin";
import NavBarAdmin from "./admin-view/components/navBarAdmin";
import HeaderAdmin from "./admin-view/components/headerAdmin";

import { Box, Grid } from "@mui/material";
import CartIcon from "./web-view/icon-component/iconCart";
import Footer from "./components/footer";
import Header from "./web-view/component-view/header";
import NavBarUser from "./user-view/components/navBarAdmin";

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#f5f5fa" }}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={2000}
      >
        <Router>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
            <Route
              path="/admin/*"
              element={<GuardRoute element={AdminLayout} />}
            />
            {/* <Route path="/admin/*" element={<AdminLayout />} /> */}
            <Route path="/profile/*" element={<RouterUser />} />
            {/* <Route path="/admin/*" element={<RouterAdmin />} /> */}
          </Routes>
        </Router>{" "}
      </SnackbarProvider>
    </div>
  );
}

// Giao diện cơ bản
const MainLayout = () => {
  return (
    <>
      <Header />{" "}
      <div className="p-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Click me
        </button>
      </div>
      <div
        style={{
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          paddingLeft: "5px",
          paddingRight: "5px",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#f5f5fa",
          marginTop: "0px",
        }}
      >
        <CartIcon /> {/* Icon giỏ hàng */}
        <Routes>
          <Route path="/*" element={<RouterView />} />
        </Routes>
      </div>{" "}
    </>
  );
};

const RouterUser = () => (
  <>
    {" "}
    <div style={{ backgroundColor: "#fff" }}>
      {" "}
      <HeaderAdmin />
      <Grid container style={{ height: "100vh" }}>
        <Grid item xs={3} md="auto" sx={{ flexBasis: "20.8333%" }}>
          <NavBarUser />
        </Grid>
        <Grid item xs={9} md="auto" sx={{ flexBasis: "79.1667%" }}>
          <Routes>
            <Route path="/*" element={<UserRouter />} />
          </Routes>
        </Grid>
      </Grid>{" "}
    </div>
  </>
);

const AdminLayout = () => (
  <>
    {" "}
    <div style={{ backgroundColor: "#fff" }}>
      <HeaderAdmin />

      <Grid container style={{ height: "100vh" }}>
        <Grid item xs={3} md="auto" sx={{ flexBasis: "20.8333%" }}>
          <NavBarAdmin />
        </Grid>
        <Grid item xs={9} md="auto" sx={{ flexBasis: "79.1667%" }}>
          <Routes>
            <Route path="/*" element={<RouterAdmin />} />
          </Routes>
        </Grid>
      </Grid>
    </div>
  </>
);

export default App;
