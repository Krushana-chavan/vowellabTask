import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Sidebar } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import TableWrapper from '../../utils/tableWrapper';
import AddUser from './addUser';
import { apiGET, apiPOST } from '../../utils/apiHelper';
import moment from 'moment';


function UserList() {
  const navigate = useNavigate();
  let { action } = useParams();
  const [visible, setVisible] = React.useState(action == 'add');
  const [users, setUsers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      let responce = await apiGET(
        `/v1/user/get-All-users/?page=${page}&limit=${limit}`
      );
    
      if (responce.status === 200) {

        setUsers(responce.data.data.data);
        setTotalRows(responce.data.data.totalResults);
      } else if (responce.status === 400) {
        console.log(responce.data.data.message);
      } else {
        console.log(responce.data.data.message)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [page, limit]);

  useEffect(() => {
    if (action == 'add') {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [action]);

  const sections = [
    { key: 'Dashboard', content: 'Dashboard', link: true },
    { key: 'User List', content: 'User List', active: true },
  ];
  const columns = [
    {
      name: 'Profile',
      selector: (row) => <img style={{marginTop:"5px"}} src={row.profilePic} alt="" height={35} width={35} />
    },
    {
      name: 'Name',
      selector: (row) => <div>{row.fName || "-"} {row.lName || "-"}</div>,
    },
    {
      name: 'Phone No.',
      selector: (row) => row.phoneNo || "--",
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
    {
      name: 'createdAt',
      selector: (row) => moment(row.createdAt).format("lll"),
    },
  ];
  return (
    <Sidebar.Pushable>
      <Sidebar
        style={{
          width: 700,
        }}
        as={'div'}
        animation="overlay"
        icon="labeled"
        direction="right"
        onHide={() => setVisible(false)}
        onHidden={() => navigate('/dashboard/users')}
        vertical={'vertical'}
        visible={visible}>
        <AddUser />
      </Sidebar>
      <Sidebar.Pusher dimmed={visible} className="fadeIn">
        <div className="page-header">
          <div>
            <Breadcrumb icon="right angle" sections={sections} />
            <div className="header-text">All Users</div>
            <div className="sub-text">List of all users in application</div>
          </div>
          <div className="page-header-actions">

          </div>
        </div>
        <TableWrapper
          columns={columns}
          data={users}
          progressPending={loading}
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={(newlimit, page) => {
            setLimit(newlimit);
          }}
          paginationRowsPerPageOptions={
            [10, 20, 50, 100]
          }
          paginationPerPage={limit}
          onChangePage={(p) => setPage(p)}
        />
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}
export default UserList;
