import React from "react";
import { Button, Drawer, Grid } from "@material-ui/core";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MUIDataTable from "mui-datatables";
import AccountsComponent from "./DrawerComponents/AccountsComponent";

const DrawerContainer = styled.div`
  max-width: 35vw;
  min-width: 35vw;
`;

const AccordinContainer = styled(Grid)`
  margin: 7.5px 0px;
`;

const ActionContainer = styled(Grid)`
  margin: 7.5px 0px;
  text-align: right;
  button {
    margin: 10px;
  }
`;

export default function OrdersDrawer({ open, close }) {
  return (
    <div>
      <Drawer anchor={"right"} open={open} onClose={close}>
        <DrawerContainer>
          <TabView />
        </DrawerContainer>
      </Drawer>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    "& .MuiAppBar-colorPrimary": {
      backgroundColor: "#fff !important",
      color: "#000",
    },
    "& .Mui-selected": {
      color: "#1976d2",
    },
    "& .MuiAccordion-rounded": {
      backgroundColor: "#f3f2f2 !important",
    },
    "& .MuiAccordionDetails-root .MuiTypography-body1": {
      width: "100%",
    },
    "& .MuiPaper-root.MUIDataTable-paper-30, .MUIDataTableHeadCell-fixedHeader-75":
      {
        backgroundColor: "transparent !important",
      },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function TabView() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options = {
    selectableRows: false,
    download: false,
    print: false,
    pagination: false,
    responsive: "scroll",
    search: false,
    filter: false,
    viewColumns: false,
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Notes" {...a11yProps(1)} />
          <Tab label="History" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Box>
          <Grid container>
            <AccountsComponent />
            <AccordinContainer item xs={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    {t("orders.orderInformation")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <MUIDataTable
                      columns={[
                        {
                          label: t("orders.information"),
                        },
                        {
                          label: t("orders.value"),
                        },
                      ]}
                      data={[
                        ["Created At", "22-04-2020"],
                        ["Created At", "22-04-2020"],
                        ["Created At", "22-04-2020"],
                      ]}
                      options={options}
                    />
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </AccordinContainer>
            <AccordinContainer item xs={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    {t("orders.paymentInformation")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{t("common.notAvailable")}</Typography>
                </AccordionDetails>
              </Accordion>
            </AccordinContainer>
            <ActionContainer item xs={12}>
              <Button variant="contained" color="primary">
                {t("orders.pause")}
              </Button>
              <Button variant="contained" color="primary">
                {t("orders.modify")}
              </Button>
              <Button variant="contained" color="primary">
                {t("orders.cancel")}
              </Button>
            </ActionContainer>
          </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {t("common.notAvailable")}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {t("common.notAvailable")}
      </TabPanel>
    </div>
  );
}
