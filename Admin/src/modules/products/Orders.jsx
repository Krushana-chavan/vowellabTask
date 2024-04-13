import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { apiGET, objectToQueryParam } from '../../utils/apiHelper';
import { Breadcrumb, Button, Input, Sidebar } from 'semantic-ui-react';
import TableWrapper from '../../utils/tableWrapper';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';


const Orders = () => {
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [orders, setOrders] = useState([])
	const [search, setsearch] = useState('')
	const [TotalRows, setTotalRows] = useState()
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(100)
	const navigate = useNavigate();
	const sections = [
		{ key: 'Orders', content: 'Orders', link: true },
	];

	const getAllOrders = async () => {
		setLoading(true);
		try {
			let filter = {}
			if (search != "") {
				filter.orderNo = search
			}

			let url = `/v1/order/admin-all-orders?page=${page}&limit=${limit}`

			if (Object.keys(filter).length > 0) {
				let payload = { filter: filter }
				const queryParams = objectToQueryParam(payload)
				url = url + `&${queryParams}`
			}
			let response = await apiGET(url)
			if (response.status === 200) {
				setOrders(response?.data?.data?.data)
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
	const columns = [
		{
			name: 'Order',
			selector: (row) => row.orderNo,
			width: '10%'
		},
		{
			name: 'Date',
			selector: (row) => moment(row.createdAt).format('lll'),
			width: '20%'

		},
		{
			name: 'Customer',
			selector: (row) => row?.shippingAdderess?.shippingAddressObj?.firstName +" "+ row?.shippingAdderess?.shippingAddressObj?.lastName,
			width: '15%'
		},
		{
			name: 'Payment',
			selector: (row) => <div
				color={row.paymentStatus === 'unpaid' ? 'orange' : 'twitter'}
				className="fixed-width-button"
			>
				{row.paymentStatus}
			</div>,
			width: '18%'
		},
		{
			name: 'Fullfilment',
			selector: (row) =>
				<div>{row.orderStatus}</div>		
		},
		{
			name: 'Total',
			selector: (row) => `₹ ${row.amountToPay}`

		},
		
	];

	useEffect(() => {
		getAllOrders()
	}, [page, limit,search])
	

	return <>
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
				onHidden={() => navigate('/dashboard/product-orders')}
				vertical={'vertical'}
				 >
			
			</Sidebar>
			<Sidebar.Pusher dimmed={visible} className="fadeIn">
				<div className="page-header" style={{ flexWrap: "wrap", gap: "16px" }}>
					<div>
						<Breadcrumb icon="right angle" sections={sections} />
						<div className="header-text">All Orders</div>
						<div className="" style={{ fontSize: "14px", marginTop: "10px" }}>{TotalRows} Orders</div>
					</div>

				</div>
				<div className="page-header" style={{ flexWrap: "wrap", gap: "16px" }}>
					<div className='page-header-actions' style={{ flexWrap: "wrap", justifyContent: "space-between", width: "100%", gap: "12px" }}>
						
						<div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
						
							<Input icon='search' placeholder='Search names'
								value={search || ''}
								style={{ marginRight: '10px', }}
								onChange={(e) => {
									setsearch(e.target.value)
								}} />	
						</div>
					</div>
				</div>

				<div style={{ overflowX: 'scroll', width: '100%', maxWidth: '100vw', whiteSpace: 'nowrap' }}>

					<TableWrapper
						columns={columns}
						data={orders}
						progressPending={loading}
						paginationServer
						paginationTotalRows={TotalRows}
						onRowClicked={(rowData) => {
							onClickViewDocuments(rowData)
						}}
						onChangeRowsPerPage={(newlimit, page) => {
							setLimit(newlimit);
						}}
						paginationRowsPerPageOptions={
							[10, 20, 50, 100]
						}
						paginationPerPage={limit}
						onChangePage={(p) => setPage(p)}
					/>
				</div>
			</Sidebar.Pusher>
		</Sidebar.Pushable >

	</>
}

export default Orders