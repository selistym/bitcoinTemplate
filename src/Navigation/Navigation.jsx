import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { Layout } from 'antd';
const { Sider } = Layout;

import logo from './main_logo.svg';

const desktop = window.innerWidth > 1000;

export const Navigation = (props) => {
  const username = JSON.parse(localStorage.getItem('user')).email;
  return (
    <Sider style={{ minHeight: '100vh', background: '#252525' }} breakpoint="lg" onBreakpoint={(broken) => { console.log(broken); }} onCollapse={(collapsed, type) => { console.log(collapsed, type); }}>
      <div style={{color:'white', height: 32, marginTop: 16, marginBottom: 50, textAlign: 'center' }}>
        <img src={logo} style={{ width: '70%' }} />
        <p style={{ fontSize: '11px' }}>Market Tool</p>
      </div>
      { desktop && <div style={{color:'white', height: 32, marginBottom: 5, textAlign: 'center' }}>{username}</div> }
      <div style={{color:'white', height: 20, textAlign: 'center' }}>• • •</div>
      <hr style={{ height: 1, color: '#3f3f3f', background: '#3f3f3f', border: 'none' }}/>
      <Menu theme="dark" mode="inline" selectable={false} style={{ background: '#252525' }}>
        <Menu.Item key="1">
          <NavLink to="/">
            <Icon type="home" />
            <span>Home</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/comp">
            <Icon type="search" />
            <span>Comparison</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/weight">
            <Icon type="sliders" />
            <span>Weights</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="4">
          <NavLink to="/subscriptions">
            <Icon type="usergroup-add" />
            <span>Subscriptions</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="5">
          <NavLink to="/exchange">
            <Icon type="area-chart" />
            <span>Exchange</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};