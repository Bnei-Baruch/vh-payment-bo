import React from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";

import Helmet from 'react-helmet';

import {
  CardContent,
  Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  Divider as MuiDivider,
  Typography,
  Button as MuiButton,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Card = styled(MuiCard)(spacing);
const Button = styled(MuiButton)(spacing);
const ExportButton = styled(Button)`
padding: 4px 10px;
min-width: 0;
background-color : #E84118;
color : #fff;
:hover {
  background-color : #E84118;
}
`;

function EmptyCard() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Reports
        </Typography>
        <Typography variant="body2" gutterBottom>
          Monthly Pailed Payments <ExportButton size="small" mr={2}>Export</ExportButton>
        </Typography>
      </CardContent>
    </Card>
  );
}

function Blank() {
  return (
    <React.Fragment>
      <Helmet title="Reports"/>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <EmptyCard />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Blank;
