import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions';
import Display from '../../components/Display/';
import Main from 'Components/Main/';

class App extends PureComponent {
  constructor(props) {
    super(props);
    props.actions.getData();

  }
  render() {
    const { actions, error } = this.props;
    return (
      <div>
        <Display error={error} actions={actions} />
        <Main {...this.props} />
      </div>
    );
  }
}

App.propTypes = {
  error: PropTypes.object,
  actions: PropTypes.object.isRequired,
  appName: PropTypes.string.isRequired,
};

//  Redux Connection
function mapStateToProps(state) {
  return {
    appName: `Natac's Scatterplot`,
    error: state.error,
    data: state.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ActionCreators, dispatch),
    dispatch,
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
