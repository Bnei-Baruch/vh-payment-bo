import React from "react";
import styled from "styled-components";

import {
  Box,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Typography = styled(MuiTypography)(spacing);

const CardContent = styled(MuiCardContent)`
  position: relative;
  display: flex;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;

const Chip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)}px;

  span {
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  align-item: center;
  padding: 15px;
  > div {
    margin: auto 0;
  }

  > div:first-child {
    font-size: 24px;
    font-weight: bold;
  }

  > div:last-child {
    color: #171832;
    opacity: 0.6;
  }
`;

function Stats({ title, amount, image }) {
  return (
    <Card mb={3}>
      <CardContent>
        <img src={image} alt="stats" />
        <StatsContainer>
          <div>{amount}</div>
          <div>{title}</div>
        </StatsContainer>
      </CardContent>
    </Card>
  );
}

export default Stats;
