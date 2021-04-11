import React from "react";
import { withTheme } from "styled-components";
import Helmet from 'react-helmet';
import {
  Grid,
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import LineChart from "./LineChart";
import Stats from "./Stats";
function Default({ theme }) {
  return (
    <React.Fragment>
      <Helmet title="Application Dashboard" />
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Sales Today"
            amount="2.532"
            chip="Today"
            percentageText="+26%"
            percentagecolor={green[500]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Visitors"
            amount="170.212"
            chip="Annual"
            percentageText="-14%"
            percentagecolor={red[500]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Total Earnings"
            amount="$ 24.300"
            chip="Monthly"
            percentageText="+18%"
            percentagecolor={green[500]}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Pending Orders"
            amount="45"
            chip="Yearly"
            percentageText="-9%"
            percentagecolor={red[500]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <LineChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LineChart />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withTheme(Default);
