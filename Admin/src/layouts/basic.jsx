import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import { Button, Icon, Image } from 'semantic-ui-react';

import MenuData from './menu';
import { useState } from 'react';


function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userDetails, setuserDetails] = useState()
  let authContext = useContext(AuthContext);
  const { collapseSidebar, collapsed } = useProSidebar();
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("user"));
    setuserDetails(users)
  }, [])
  return (
    <div className="layout-wrapper">
      <div className="sidebar-wrapper">
        <Sidebar
          backgroundColor="#0f182a"
          width="270px"
          style={{ maxWidth: '270px', borderWidth: 0 }}>
          <div className="sidebar-header">
            <Image src={"https://www.vowelweb.com/wp-content/uploads/2022/06/vowelweb-logo.png"} size="tiny" centered />
           
          </div>
          <Menu
            rootStyles={{
              '.ps-menu-button': {
                color: '#e0e0e0',
              },
              '.ps-menu-button:hover': {
                color: 'white',
                background: '#343a48',
              },
            }}>
            {MenuData.map((aMenu, idx) =>
              aMenu.type == 'label' ? (
                !collapsed ? (
                  <div
                    key={idx}
                    style={{
                      padding: '20px 30px 10px 30px',
                      color: 'rgb(171 171 171)',
                    }}>
                    {aMenu.title}
                  </div>
                ) : null
              ) : aMenu.type == 'menu' ? (
                <MenuItem
                  key={idx}
                  style={{
                    background:
                      location.pathname == aMenu.path ? '#343a48' : '',
                    color:
                      location.pathname == aMenu.path ? '#3098ff' : '#e0e0e0',
                  }}
                  onClick={() => {
                    navigate(aMenu.path);
                  }}>
                  <Icon
                    bordered={false}
                    name={aMenu.icon}
                    style={{ padding: '0 30px 0 10px' }}></Icon>
                  {aMenu.title}
                </MenuItem>
              ) : null
            )}
          </Menu>
        </Sidebar>
      </div>
      <div
        style={{
          width:"100%",
          overflowY:"auto",
          minHeight: '100%',
        }}>
        <div
          className="header-content"
          style={{
            height: 56,
            minHeight: 56,
            borderBottom: '1px solid #efefef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 27,
            boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
          }}>
          <div
            style={{ paddingLeft: 28, cursor: 'pointer' }}
            onClick={() => {
              collapseSidebar();
            }}>
            <Icon name="bars" size="large"></Icon>
          </div>
          <div
            style={{
              display: 'flex',
              marginRight: 0,
              padding: '20px 30px 10px 30px',
              color: 'rgb(171 171 171)',
            }}>
          </div>
          <Button
            animated="fade"
            onClick={() => {
              authContext.signout(() => { });
            }}>
            <Button.Content visible>Logout</Button.Content>
            <Button.Content hidden>
              <Icon name="log out" />
            </Button.Content>
          </Button>
        </div>
        <Outlet
          id="appContent"
          class="appContent"
          style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
}

export default Layout;
