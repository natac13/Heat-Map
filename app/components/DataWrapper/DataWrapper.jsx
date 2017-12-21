import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';

import HeatMap from 'Components/HeatMap/';
import style from './style.scss';

export default class DataWrapper extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    console.log(props)
    /** Styling */
    const wrapperClass = classnames({
      [style.wrapper]: true,
      [props.className]: !!props.className,
    });

    /** State Creation */
    this.state = {
      wrapperClass,
      chartData: props.data.chartData || [],
      width: 1500,
      height: 700,
      baseTemp: props.data.baseTemp || 0,
      title: 'Global Temperature &#2103;C',
    };
  }


  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const { chartData, baseTemp } = nextProps.data;
    if (chartData.length !== 0) {
      this.setState({
        chartData,
        baseTemp,
      });
    }
  }


  render() {
    const {
      wrapperClass,
      chartData,
      width,
      height,
      baseTemp,
    } = this.state;

    return (
      <section className={wrapperClass}>
        <HeatMap
          chartData={chartData}
          width={width}
          height={height}
          baseTemp={baseTemp}
        />

      </section>
    );
  }

}
