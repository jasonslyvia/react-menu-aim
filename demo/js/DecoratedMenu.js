import React from 'react';
import reactMenuAimDecorator from '../../decorator';


@reactMenuAimDecorator({
      submenuDirection: 'right',
      menuSelector: '.menu',
      delay: 300,
      tolerance: 75})
export default class Menu extends React.Component {

  constructor(props) {
    super();

    this.state = {
      activeMenuIndex: 0,
    };
  }

  handleSwitchMenuIndex(index) {
    this.setState({
      activeMenuIndex: index
    });
  }

  render() {
    var containerClassName = 'menu-container ' + this.props.submenuDirection;

    var subMenuStyle = {};
    if (this.props.submenuDirection === 'below') {
      subMenuStyle.left = this.state.activeMenuIndex * 140;
    }

    return (
      <div className={containerClassName}>
        <ul className="menu" onMouseLeave={this.props.handleMouseLeaveMenu}>
          {this.props.menuData.map((menu, index) => {
            var className = 'menu-item';
            if (index === this.state.activeMenuIndex) {
              className += ' active';
            }

            return (
              <li className={className} key={index}
                  onMouseEnter={() =>{
                    this.props.handleMouseEnterRow(index, this.handleSwitchMenuIndex.bind(this));
                  }}>
                {menu.name}
              </li>
            );
          })}
        </ul>
        <ul className="sub-menu" style={subMenuStyle}>
          {this.props.menuData[this.state.activeMenuIndex].subMenu.map(((subMenu, index) => {
            return (
              <li className="sub-menu-item" key={index}>{subMenu}</li>
            );
          }))}
        </ul>
      </div>
    );
  }
}

Menu.defaultProps = {
  submenuDirection: 'right',
};

