import { Divider, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import PieChart from "./Charts/PieChart";
import GroupIcon from "@material-ui/icons/Group";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CloseIcon from "@material-ui/icons/Close";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import BarChart from "./Charts/BarChart";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  filterContainer: {
    display: "flex",
    alignItems: "baseline",
    marginRight: "30px",
    "&>*": {
      margin: theme.spacing(1),
    },
  },
  whiteBackground: {
    backgroundColor: "#fff",
    alignItems: "center",
    "& svg": {
      fontSize: "60px",
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "10px",
    },
    "&> h4": {
      padding: "20px 10px",
      backgroundColor: "#2296f3",
      color: '#fff',
      fontWeight: 'bold',
    },
    "&>div": {
      display: "flex",
      margin: "20px 10px",
      justifyContent: "space-between",
    },
  },
}));
export default function Orders() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-between" alignItems="baseline">
            <Typography
              variant="h4"
              display="flex"
              align="center"
              alignItems="baseline"
            >
              Subscription Analytics
            </Typography>
            <div className={classes.filterContainer}>
              <KeyboardDatePicker
                views={["year", "month"]}
                disableToolbar
                inputVariant="outlined"
                margin="normal"
                id="date-picker-inline"
                label="From"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </div>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>

      <Grid container item xs={12} spacing={6}>
        <Grid item xs={12} md={6}>
          <Grid className={classes.whiteBackground}>
            <Typography variant="h4">Total Subscription</Typography>
            <Divider />
            <div>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Total Sum</Typography>
            </div>
            <div>
              <Typography variant="h6">USD</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">EUR</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">NIS</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Payments Method</Typography>
            </div>
            <div>
              <Typography variant="h6">CC</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">PAYPAL</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">CCEU</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h6">Percentage</Typography>
              <Typography variant="h6">34.5%</Typography>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid className={classes.whiteBackground}>
            <Typography variant="h4">New Subscription</Typography>
            <Divider />
            <div>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Total Sum</Typography>
            </div>
            <div>
              <Typography variant="h6">USD</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">EUR</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">NIS</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Payments Method</Typography>
            </div>
            <div>
              <Typography variant="h6">CC</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">PAYPAL</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">CCEU</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h6">Percentage</Typography>
              <Typography variant="h6">34.5%</Typography>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid className={classes.whiteBackground}>
            <Typography variant="h4">Failed Subscription</Typography>
            <Divider />
            <div>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Total Sum</Typography>
            </div>
            <div>
              <Typography variant="h6">USD</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">EUR</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">NIS</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Payments Method</Typography>
            </div>
            <div>
              <Typography variant="h6">CC</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">PAYPAL</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">CCEU</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h6">Percentage</Typography>
              <Typography variant="h6">34.5%</Typography>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid className={classes.whiteBackground}>
            <Typography variant="h4">Cancelled Subscription</Typography>
            <Divider />
            <div>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Total Sum</Typography>
            </div>
            <div>
              <Typography variant="h6">USD</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">EUR</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">NIS</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h5">Payments Method</Typography>
            </div>
            <div>
              <Typography variant="h6">CC</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">PAYPAL</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <div>
              <Typography variant="h6">CCEU</Typography>
              <Typography variant="h6">245</Typography>
            </div>
            <Divider />
            <div>
              <Typography variant="h6">Percentage</Typography>
              <Typography variant="h6">34.5%</Typography>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
