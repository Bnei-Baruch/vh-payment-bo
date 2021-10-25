import React from "react";
import styled from "styled-components";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  position: relative;
  display: flex;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
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
