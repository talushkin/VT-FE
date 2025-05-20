import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// material ui
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logo from "../../components/Icons/Logo/Logo";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

const Menu = (props) => {
  const { window } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const drawerWidth = 240;
  const changeFontColor = {
    color: "#44C8F5",
    fontWeight: "600",
  };
  const fontColor = { color: "#32516D" };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className="h-100" style={{ background: "#F5F5F2" }}>
      <div className="w-100 d-flex justify-content-center h-25">
        <div className={"w-50 h-50 mt-auto"}>
          <Logo />
        </div>
      </div>
      <div className="h-75 ">
        <div className="mb-auto pt-4 h-auto">
          <Divider />
          <List>
            <Link
              to={"/propertySearch"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/propertySearch" ||
                location.pathname === "/Propertysearch"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {location.pathname === "/PropertySearch" ||
                    location.pathname === "/propertySearch" ? (
                      <PermContactCalendarIcon sx={{ color: "#44C8F5" }} />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                  <ListItemText primary={"Search"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              to={"/Clients"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/Clients" ||
                location.pathname === "/Clients"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {location.pathname === "/Clients" ||
                    location.pathname === "/Clients" ? (
                      //console.log("HELLOO"),
                      <PermContactCalendarIcon sx={{ color: "#44C8F5" }} />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                  <ListItemText primary={"Clients"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              to={"/reservations"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/reservations" ||
                location.pathname === "/Reservations"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  </ListItemIcon>
                  <ListItemText primary={"Reservations"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              to={"/reports"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/reports" ||
                location.pathname === "/Reports"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  </ListItemIcon>
                  <ListItemText primary={"Reports"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              to={"profile"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/Profile" ||
                location.pathname === "/profile"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  </ListItemIcon>
                  <ListItemText primary={"Your Profile"} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link
              to={"Agencyprofile"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/AgencyProfile" ||
                location.pathname === "/Agencyprofile"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {location.pathname === "/" ||
                    location.pathname === "/Agencyprofile" ||
                    location.pathname === "/AgencyProfile" ? (
                      <AccountCircleIcon sx={{ color: "#44C8F5" }} />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                  <ListItemText primary={"Agency Profile"} />
                </ListItemButton>
              </ListItem>
            </Link>
            {/* <Link
              to={"TravelAgency"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/TravelAgency" ||
                  location.pathname === "/Travelagency"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {location.pathname === "/" ||
                      location.pathname === "/Travelagency" ||
                      location.pathname === "/TravelAgency" ? (
                      <AccountCircleIcon sx={{ color: "#44C8F5" }} />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                  <ListItemText primary={"Travel Agency"} />
                </ListItemButton>
              </ListItem>
            </Link> */}
            <Link
              to={"ProfileWireTrasfer"}
              className={`text-decoration-none drawer-nav-link`}
              style={
                location.pathname === "/ProfileWireTrasfer" ||
                location.pathname === "/ProfileWireTrasfer"
                  ? changeFontColor
                  : fontColor
              }
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  </ListItemIcon>
                  <ListItemText primary={"Wire Trasfer"} />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        </div>
        <div className="d-flex align-items-end h-5">
          <List>
            {["Get In Touch", "FAQs"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Menu;