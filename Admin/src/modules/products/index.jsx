import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Dropdown, Icon, Input, Sidebar } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import TableWrapper from '../../utils/tableWrapper';
import { apiGET, apiPOST, objectToQueryParam } from '../../utils/apiHelper';
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import AddProduct from './addProduct';
import { Radio, Segment } from 'semantic-ui-react'
import { Menu } from 'semantic-ui-react'
// import CollectionActionButtons from '../../../components/avatar/collectionActionButtons';
import AvatarSeriesActionButtons from '../../components/avatar/avatarSeriesActionButtons';
const transactionUrl = import.meta.env.VITE_TRANSACTION_DEVEOPLEMENT_URL_HASH;

function Products() {
  let { action } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [TotalRows, setTotalRows] = useState()
  const [product, setproduct] = useState([])
  const [loading, setLoading] = useState()
  const [search, setsearch] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [visible, setVisible] = React.useState(action === 'add')
  const sections = [
    { key: 'Products', content: 'Products', link: true },
  ];


  const getAllproducts = async () => {
    setLoading(true);
    try {
      const payload = {
        filter: {
          name: search,
          isFeatured: isFeatured
        }
      }
      let url
      const queryParams = objectToQueryParam(payload)
      if (search || isFeatured) {

        url = `/v1/products/admin-get-all-products?${queryParams}`
      } else {
        url = `/v1/products/admin-get-all-products?page=${page}&limit=${limit}`
      }

      let response = await apiGET(url)

      if (response.status === 200) {

        setproduct(response?.data?.data?.data);
        setTotalRows(response?.data?.data?.totalResults);
        setPage(response?.data?.data?.page)
        setLimit(response?.data?.data?.limit)
      } else if (response.status === 400) {
        Swal.fire({
          title: "Error!",
          text: response?.data?.data,
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response?.data?.data,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllproducts()

  }, [page, limit, search, isFeatured])

  useEffect(() => {
    if (action == 'add' || action == 'edit') {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [action]);

  const onClickEditButton = (id) => {
    navigate(`/dashboard/all-products/edit/${id}`);
  };

  const checkStatus = async (id) => {

    try {
      let result = await apiPOST(`/v1//products/featureToggle/${id}`)
      if (result?.status) {
        getAllproducts()
        Swal.fire({
          title: "Success!",
          text: "Feature status changed",
          icon: "success",
        })
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
      })
    }
  }
  const checkVisibal = async (id) => {

    try {
      let result = await apiPOST(`/v1//products/visibleToggle/${id}`)
      if (result?.status) {
        getAllproducts()
      
        if(result?.data?.data?.visible){
          Swal.fire({
            title: "Success!",
            text: "Shown in online store",
            icon: "success",
          })
        }
        else{
          Swal.fire({
            title: "Success!",
            text: "Hidden in online store",
            icon: "success",
          })
        }
      
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
      })
    }
  }

  const dropDownOptions = [
    { key: 1, text: 'All Products', value: false },
    { key: 2, text: 'Featured Products', value: true },

  ]

  const handleIsfeatured = (e, d) => {
    setIsFeatured(d?.value)
  }

  const columns = [

    {
      name: 'Name',
      selector: (row) => row.name,
      width: '22%'

    },
    {
      name: 'Cost',
      selector: (row) => row.cost,
      width: '8%'

    },
    {
      name: 'Price',
      selector: (row) => `₹${row.price}`,
      width: '7%'

    },
    // {
    //   name: 'DiscountMode',
    //   selector: (row) => row.discountMode,
    // },
    {
      name: 'Image',
      selector: (row) =>
        <img src={row.productImageUrl} alt="" height={100} width={100} />,
      width: '15%'

    },
    {
      name: 'Inventory',
      selector: (row) => row.inventory,
      width: '10%'
    },
    {
      name: 'Is-Featured',
      selector: (row) => (<div>
        <Radio
          toggle
          onChange={() => checkStatus(row?._id)}
          checked={row?.isFeatured}
        />
      </div>)
    },
   
    {
      name: 'Created On',
      selector: (row) => moment(row.createdAt).format("lll"),
      width:"20%"
    },
    {
      name: 'Action',
      selector: (row) => (
        <div>
        
          <button className="ui blue icon button basic" onClick={() => { setVisible(true); onClickEditButton(row._id) }}>
            <i className="edit icon"></i>
          </button>
        </div>
      ),
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
        onHide={() => {
          setVisible(false)
          navigate(-1)
        }}
        onHidden={() => navigate('/dashboard/all-products')}
        vertical={'vertical'}
        visible={visible}>
        <AddProduct visible={visible} setVisible={setVisible} getAllproducts={getAllproducts} />
      </Sidebar>

      <Sidebar.Pusher dimmed={visible} className="fadeIn">
        <div className="page-header">
          <div>
            <Breadcrumb icon="right angle" sections={sections} />
            <div className="header-text">All Products</div>
            <div className="sub-text">List of all products in application</div>
          </div>


          <div className='page-header-actions'>

            <div>

              <div style={{ marginBottom: '20px' }}>
                <Button
                  primary
                  onClick={() => {
                    setVisible(true)
                    navigate('/dashboard/all-products/add');
                  }}>
                  Add Product
                </Button>
              </div>
              <div>

              </div>
            </div>

          </div>
        </div>

        <div className='page-header'>

          <Dropdown placeholder='Products' search selection options={dropDownOptions}
            onChange={(e, d) => handleIsfeatured(e, d)} />

          <Input icon='search' placeholder='Search names'
            value={search || ''}
            style={{ marginRight: '10px' }}
            onChange={(e) => {
              setsearch(e.target.value)
            }}
          />
        </div>

        <div style={{ overflowX: 'scroll', minWidth: '100%', maxWidth: '100vw', whiteSpace: 'nowrap' }}>

          <TableWrapper
            columns={columns}
            data={product}
            progressPending={loading}
            paginationServer
            paginationTotalRows={TotalRows}
            onChangeRowsPerPage={(newlimit, page) => {
              setLimit(newlimit);
            }}
            paginationRowsPerPageOptions={
              [10, 20, 50, 100]
            }
            width={"100%"}
            paginationPerPage={limit}
            onChangePage={(p) => setPage(p)}
          />
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable >
  );
}

export default Products;
