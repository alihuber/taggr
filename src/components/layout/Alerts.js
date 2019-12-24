import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withAlert } from 'react-alert';

const Alerts = ({ alert }) => {
  const message = useSelector(state => state.messages);
  useEffect(() => {
    if (message && message.testMessage) {
      alert.success(message.testMessage);
    }
    if (message && message.errorMessage) {
      alert.error(message.errorMessage);
    }
  }, [message]);
  return <></>;
};

export default withAlert()(Alerts);
