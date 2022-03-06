import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
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
    marginRight: '30px',
    "&>*": {
      margin: theme.spacing(1),
    },
  },
  whiteBackground: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "10px",
    "& svg": {
      fontSize: "60px",
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "10px",
    },
    "&>*": {
      margin: "10px",
    },
  },
}));
export default function Customers() {
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
              Customer Reports
            </Typography>
            <div className={classes.filterContainer}>
              <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="From"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="To"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Report Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={"Subscription"}
                  onChange={handleChange}
                  label="Report Type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"Subscription"}>Subscription</MenuItem>
                  <MenuItem value={"tickets"}>Tickets</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid container item xs={12} spacing={6}>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>
            <span>
              <GroupIcon />
            </span>
            <span>
              <Typography variant="h3">Total</Typography>
              <Typography variant="h6">1200</Typography>
            </span>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>
            <span>
              <PersonAddIcon />
            </span>
            <span>
              <Typography variant="h3">New</Typography>
              <Typography variant="h6">1200</Typography>
            </span>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>
            <span>
              <CloseIcon />
            </span>
            <span>
              <Typography variant="h3">Cancelled</Typography>
              <Typography variant="h6">1200</Typography>
            </span>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>
            <span>
              <LocalLibraryIcon />
            </span>
            <span>
              <Typography variant="h3">Help Haver</Typography>
              <Typography variant="h6">1200</Typography>
            </span>
          </Grid>
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={6}>
        <Grid item xs={12} md={6}>
          <PieChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChart />
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={6}>
        <Grid item xs={12} md={6}>
          <PieChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChart />
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={6}>
        <Grid item xs={12} md={6}>
          <BarChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChart />
        </Grid>
      </Grid>
    </Grid>
  );
}
