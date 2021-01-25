import React from "react";

class OnRouteChangeWorker extends React.Component {
    componentDidUpdate(prevProps) {
      if (this.props.location.pathname !== prevProps.location.pathname) {
        this.props.action();
      }
    }
  
    render() {
      return null
    }
}
export default OnRouteChangeWorker;