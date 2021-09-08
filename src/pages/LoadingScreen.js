import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from "react-i18next";
import {
  CircularProgress,
  Typography,
  Box,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',    
  },
  linear:{
    height: '6px'
  },
  loader: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  central:{
    textAlign: 'center'
  }
}))
function LoadingScreen() {
  const classes = useStyles()
  const { t } = useTranslation('common');
  return (
    <>
    <div className={classes.root}>
      <Box className={classes.loader}>
        <Box className={classes.central}>
          <CircularProgress thickness={5}/>
          <Typography>
            {t('common.loading')}
          </Typography>
        </Box>
          
      </Box>
    </div>
    </>
  )
}

export default LoadingScreen
