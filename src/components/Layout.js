import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Divider from '@material-ui/core/Divider';
import AttributesInput from './AttributesInput';
import SongsTable from './SongsTable';
import CoverInput from './CoverInput';

const styles = {
  divider: {
    marginTop: 17,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: 'rgba(128, 128, 128, 0.3)',
  },
};

class Layout extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid fluid>
        <Row center="xs">
          <Col xs={3} sm={3} md={3} lg={3} className={classes.divider}>
            <AttributesInput />
            <Divider />
            <CoverInput />
          </Col>
          <Col xs={9} sm={9} md={9} lg={9}>
            <SongsTable />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withStyles(styles)(Layout);
