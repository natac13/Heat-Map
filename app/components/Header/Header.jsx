import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './style.scss';

function Header(props) {
  const { className } = props;
  const wrapperClass = classnames({
    [style.header]: true,
    [className]: !!props.className,
  });


  return (
    <header className={wrapperClass}>
      <h1 className={style.title}>Global Temperature &deg;C</h1>
      <h3 className={style.year}>1753 - 2015</h3>
      <h5 className={style.note}>Note: This does <strong>NOT</strong> prove man-made global warming.</h5>
      <h5 className={style.note}>Correlation is <strong>NOT</strong> Causation!</h5>
      <a
        className={style.creator}
        href="https://seancampbellnatac.com/"
        target="_blank"
      >
        Created by: Sean Campbell
      </a>

    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Header;

