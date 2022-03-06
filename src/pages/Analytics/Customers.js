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
import LineChart from "./Charts/LineChart";
import BarChart from "./Charts/BarChart";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  whiteBackground: {
    backgroundColor: "#fff",
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
          <Grid container justifyContent="space-around" alignItems="center">
            <Typography variant="h4" display="flex" align="center">
              Customer Reports
            </Typography>
            <KeyboardDatePicker
              disableToolbar
              inputVariant="outlined"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
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
              label="Date picker inline"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Age
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={age}
                onChange={handleChange}
                label="Age"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid container item xs={12} spacing={6}>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>Stats 1</Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>Stats 1</Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>Stats 1</Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid className={classes.whiteBackground}>Stats 1</Grid>
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
