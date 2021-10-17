import React from 'react'
import styled from "styled-components";
import { Grid } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import NameImage from '../../../asset/img/name.svg';
import EmailImage from '../../../asset/img/email.svg';
import CountryImage from '../../../asset/img/country.svg';
import NumberImage from '../../../asset/img/number.svg';

const IconsContainer = styled(Grid)`
  text-align: right;
`;

const DetailContainer = styled.div`
  padding-left : 10px;
  color: #6C6F79;
  >div:first-child {
    font-weight: 600;
    color: #000;
  }
`;

const AccordinContainer = styled(Grid)`
  margin: 7.5px 0px;
`;

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    }
}));
export default function AccountsComponent() {
    const classes = useStyles();
    return (
        <AccordinContainer item xs={12}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}> Account Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container>
                                    <IconsContainer item xs={3}>
                                        <img src={NameImage} />
                                    </IconsContainer>
                                    <Grid item xs={9}>
                                        <DetailContainer>
                                            <div>Full Name</div>
                                            <div>Albert</div>
                                        </DetailContainer>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container>
                                    <IconsContainer item xs={3}>
                                        <img src={EmailImage} />
                                    </IconsContainer>
                                    <Grid item xs={9}>
                                        <DetailContainer>
                                            <div>Email</div>
                                            <div>test@abc.com</div>
                                        </DetailContainer>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container>
                                    <IconsContainer item xs={3}>
                                        <img src={NumberImage} />
                                    </IconsContainer>
                                    <Grid item xs={9}>
                                        <DetailContainer>
                                            <div>Phone Number</div>
                                            <div>+9999999999</div>
                                        </DetailContainer>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container>
                                    <IconsContainer item xs={3}>
                                        <img src={CountryImage} />
                                    </IconsContainer>
                                    <Grid item xs={9}>
                                        <DetailContainer>
                                            <div>Country</div>
                                            <div>USA</div>
                                        </DetailContainer>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </AccordinContainer>
    )
}
