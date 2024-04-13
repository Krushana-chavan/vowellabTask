import React, { useEffect, useState } from 'react';
import {
    Breadcrumb,
    Button,
    Icon,
    Form,
    Input,
    TextArea,
    Select,
    Dropdown,
    Sidebar,
    Card,
    CardContent
} from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiGET, apiPOST, apiPUT } from '../../utils/apiHelper';
import DocDropzone from '../../components/avatar/docDropzone';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import moment from 'moment';
import { HiDotsHorizontal } from 'react-icons/hi';
import { BsChevronDown, BsPencil } from 'react-icons/bs';
import { BiMessageMinus } from 'react-icons/bi';


function addProduct(props) {

    const navigate = useNavigate();
    const { id } = useParams();
    const { action } = useParams();

    const sections = [
        { key: 'Dashboard', content: 'Dashboard', link: true },
        { key: 'Product List', content: 'Product List', link: true },
        { key: (action === 'View') ? "View Product" : id ? 'Edit Product' : 'Add Product', content: (action === 'View') ? "View User" : id ? 'Edit Product' : 'Add Product', active: true },
    ];



    const [loading, setloading] = useState(false)
    const [galleryImages, setGalleryImages] = useState('')
    const [brande, setbrande] = useState([])
    const [description, setDescription] = useState('')
    const [visible, setVisible] = useState([])

    const [addProduct, setAddProduct] = useState({
        name: '',
        inventory: '',
        description: '',
        price: '',
        productImageUrl: '',
        cost: '',
        brand: '',
        // brand: '',
        originalPrice: "",
        discountByRupees: "",
        discountPercentage: ""
    })


    const handleInputDropdownChange = (event, data) => {
        const dropdownValue = data.value;
        setAddProduct({ ...addProduct, brand: dropdownValue });


    };


    const clearFields = () => {

        setAddProduct({
            name: '',
            inventory: '',
            price: '',
            productImageUrl: '',
            cost: '',
            brand: '',
            flavor: '',
            weight: 0,
            originalPrice: '',
            discountByRupees: "",
            discountPercentage: ""

        })
        setDescription('')

        setGalleryImages('')


    }



    const getAllbrandes = async () => {
        try {
            let url
            // const queryParams = objectToQueryParam(payload)
            // if (Accepted || Mode || name) {
            url = `/v1/products/getproductBrand-name`
            // } else {
            //   url = `/v1/transaction/getAllTransaction?page=${page}&limit=${limit}`
            // }

            let response = await apiGET(url)

            if (response.status === 200) {

                // setbrande(response?.data?.data);
                let list = response?.data?.data

                if (list && list.length) {
                    list = list.map((item) => {

                        return {
                            key: item,
                            text: item?.brand || "",
                            value: item?.brand,
                        };
                    });
                }
                setbrande(list)

            } else if (response.status === 400) {
                setbrande([])
                Swal.fire({
                    title: "Error!",
                    text: response?.data?.data,
                    icon: "error",
                });
            } else {
                setbrande([])
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

        }
    };

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const onClickaddProduct = async () => {
        try {
            let payload = {
                name: addProduct?.name,
                inventory: addProduct?.inventory,
                description: description,
                price: addProduct?.price,
                productImageUrl: addProduct?.productImageUrl,
                cost: addProduct?.cost,
                brand: addProduct?.brand,
                originalPrice: addProduct?.originalPrice,
                flavor: addProduct?.flavor,
                weight: addProduct?.weight,
                discountByRupees: addProduct?.discountByRupees,
                discountPercentage: addProduct?.discountPercentage,

            };
            setloading(true);
        
            const response = await apiPOST('/v1/products/add-product', payload);
            console.log(response)
            if (response.status === 200) {


                Toast.fire('Success!', "Product added Successfully", 'success');
                navigate(-1)
                props.setVisible(false)

                props.getAllproducts();
            } else {
                props.setVisible(false)

                Toast.fire('Error!', response?.data?.data || "Something went wrong!", 'error');
            }
            // }
        } catch (error) {
            props.setVisible(false)

            Toast.fire({
                title: 'Error',
                text: error,
                icon: 'error',
            });
        } finally {
            setloading(false);
        }
    };

    const getPoductDetailByID = async () => {
        try {
            const response = await apiGET(`/v1/products/get-productbyId/${id}`)
            console.log(response);
            if (response?.status == 200) {
                const result = response?.data?.data

                setAddProduct({
                    name: result?.name,
                    inventory: result?.inventory,
                    price: result?.price,
                    productImageUrl: result?.productImageUrl,
                    cost: result?.cost,
                    brand: result?.brand,
                    flavor: result?.flavor,
                    weight: result?.weight,
                    originalPrice: result?.originalPrice,
                    discountByRupees: result?.discountByRupees,
                    discountPercentage: result?.discountPercentage,

                })
                setDescription(result?.description)

                setGalleryImages(result?.productImageUrl);
            }

            else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something Went Wrong',
                    icon: 'error',
                });
            }
        } catch (error) {

            Swal.fire({
                title: 'Error!',
                text: 'Something Went Wrong',
                icon: 'error',
            })
        }
    }


    const UpdateProduct = async () => {

        try {
            let payload = {
                name: addProduct?.name,
                inventory: addProduct?.inventory,
                description: description,

                price: addProduct?.price,
                productImageUrl: addProduct?.productImageUrl,
                cost: addProduct?.cost,
                brand: addProduct?.brand,
                flavor: addProduct?.flavor,
                weight: addProduct?.weight,
                originalPrice: addProduct?.originalPrice,
                discountByRupees: addProduct?.discountByRupees,
                discountPercentage: addProduct?.discountPercentage,

            };

            setloading(true);
            const response = await apiPUT(`/v1/products/update-product/${id}`, payload);
            if (response.status === 200) {
                props.setVisible(false)
                Swal.fire({
                    title: 'Success!',
                    text: 'Product Updated Successfully !',
                    icon: 'success',
                });
                clearFields()
                props.getAllproducts();
            } else {
                props.setVisible(false)
                Swal.fire({
                    title: 'Error!',
                    text: response?.data?.data || 'Something went wrong !',
                    icon: 'error',
                });

            }

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error',
            });
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getPoductDetailByID();
        }
    }, [id])

    function calculateProfit(costPrice, sellingPrice) {
        return sellingPrice - costPrice;
    }
    function calculateProfitMargin(costPrice, sellingPrice) {
        const profit = calculateProfit(costPrice, sellingPrice);
        return ((profit / sellingPrice) * 100);
    }



    const handleDiscountByRupeesChange = (e) => {
        const discountedPrice = (e.target.value);
        const originalPrice = addProduct.originalPrice;
        const price = (originalPrice - discountedPrice).toFixed(2);
        const discountPercentage = ((discountedPrice / originalPrice) * 100).toFixed(2);

        setAddProduct({
            ...addProduct,
            discountByRupees: discountedPrice,
            price,
            discountPercentage,
        });
    };

    const handleDiscountPercentageChange = (e) => {
        const discountPercentage = (e.target.value);
        const originalPrice = addProduct.originalPrice;
        const discountByRupees = ((originalPrice * discountPercentage) / 100).toFixed(2);
        const price = (originalPrice - discountByRupees).toFixed(2);
        setAddProduct({
            ...addProduct,
            discountPercentage: discountPercentage,
            discountByRupees,
            price
        });
    };



    const profit = calculateProfit(addProduct?.cost, addProduct?.price || addProduct?.originalPrice);

    const profitMargin = calculateProfitMargin(addProduct?.cost, addProduct?.price || addProduct?.originalPrice);

    useEffect(() => {
        if (props.visible == false) {
            clearFields();
        }
    }, [props.visible == false])

    useEffect(() => {
        getAllbrandes();

    }, []);





    return (<>

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
                onHidden={() => navigate('/dashboard/all-products')}
                vertical={'vertical'}
                visible={visible}>
            </Sidebar>

            <Sidebar.Pusher dimmed={visible} className="fadeIn" >
                <div style={{ backgroundColor: "#eceff3" }}>
                    <div className="page-header2" style={{ flexWrap: "wrap", gap: "16px", padding: "0 45px" }}>
                        <div>
                            <div className='#232323' style={{ display: "flex", margin: "15px 0" }}>
                                <div >
                                    <Breadcrumb icon="right angle" sections={sections} />
                                </div>
                                <div style={{ margin: "0 10px" }}>
                                    &#62;
                                </div>

                            </div>

                            <div className="" style={{ margin: "15px 0", fontSize: "18px" }}>New Product</div>
                        </div>
                    </div>

                    <div className='bg-[]' style={{ padding: "0 45px ", display: "flex" }}>
                        <div className='' style={{ padding: "20px 0", width: "100%" }}>
                            <Card style={{ width: "100%", margin: "0 50px 0 0" }}>
                                <Card.Content style={{ padding: "20px" }}>
                                    <Card.Header style={{ fontWeight: "medium" }}>Items</Card.Header>
                                </Card.Content>
                                <Card.Content style={{ backgroundColor: '#d6e6fe', borderTop: '1px solid #95b3ff', borderBottom: '1px solid #95b3ff', display: "flex", justifyContent: 'space-between' }}>
                                    <Form>
                                        <Form.Group widths="equal" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Form.Field
                                                id="form-input-control-first-name"
                                                control={Input}
                                                label="Product Name"
                                                placeholder="Product Name"
                                                value={addProduct?.name}
                                                onChange={(e) => setAddProduct({ ...addProduct, name: e.target.value })}
                                            />

                                            <Form.Field
                                                id="form-input-control-Inventory"
                                                control={Input}
                                                label="Inventory"
                                                placeholder="Inventory"
                                                value={addProduct?.inventory}
                                                onChange={(e) => setAddProduct({ ...addProduct, inventory: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Field
                                                id="form-input-control-Inventoryl"
                                                control={Input}
                                                label="Image"
                                                placeholder="Product Image"
                                                value={addProduct?.productImageUrl}
                                                onChange={(e) => setAddProduct({ ...addProduct, productImageUrl: e.target.value })}

                                            // onChange={handleProductImageChange}
                                            />
                                        </Form.Group>

                                    </Form>

                                </Card.Content>

                            </Card>
                            <Card style={{ width: "100%", margin: "50px 50px 0 0", }}>
                                <Card.Content style={{ padding: "20px" }}>
                                    <Card.Header style={{ fontWeight: "medium", display: "flex", alignItems: "center" }}>
                                        Description

                                    </Card.Header>
                                    <Card.Content style={{ padding: '13px 0 0 0px', borderTop: "1px solid #9f9f9f", margin: "15px  0", borderBottom: "1px solid #9f9f9f", }}>


                                        <ReactQuill theme="snow" value={description} onChange={(value) => setDescription(value)} />


                                    </Card.Content>

                                </Card.Content>
                            </Card>
                            <Card style={{ width: "100%", margin: "50px 50px 0 0", }}>
                                <Card.Content style={{ padding: "20px" }}>
                                    <Card.Header style={{ fontWeight: "tiny", display: "flex", alignItems: "center" }}>Pricing</Card.Header>
                                    <Card.Content style={{ padding: '10px 0 0 0px', borderTop: "1px solid #9f9f9f", margin: "10px  0" }}>
                                        <Form>
                                            <Form.Group widths="equal" style={{ display: 'flex' }}>
                                                <Form.Field
                                                    id="form-input-control-price"
                                                    control={Input}
                                                    label="Price"
                                                    placeholder="price"
                                                    value={addProduct?.originalPrice}
                                                    onChange={(e) => setAddProduct({ ...addProduct, originalPrice: e.target.value })}
                                                />

                                                <Form.Field
                                                    id="form-input-control-Inventory"
                                                    control={Input}
                                                    label="Cost of Goods"
                                                    placeholder="₹ 0"
                                                    value={addProduct?.cost}
                                                    onChange={(e) => setAddProduct({ ...addProduct, cost: e.target.value })}
                                                />


                                            </Form.Group>
                                            <Form.Group widths="equal" style={{ display: 'flex' }}>
                                                <Form.Field
                                                    id="form-input-control-profit"
                                                    control={Input}
                                                    value={Number((profit)?.toFixed(2)) || ""}
                                                    label="Profit"
                                                    placeholder="₹ 0"
                                                />

                                                <Form.Field
                                                    id="form-input-control-Margin"
                                                    control={Input}
                                                    value={Number((profitMargin)?.toFixed(2)) || ""}
                                                    label="Margin %"

                                                />


                                            </Form.Group>
                                            <Form.Group widths={"equal"}>
                                                <Form.Field
                                                    id="form-input-control"
                                                    control={Input}
                                                    label="Discounted Price"
                                                    placeholder="price"
                                                    value={addProduct?.discountByRupees || ""}
                                                    onChange={handleDiscountByRupeesChange} />
                                                <Form.Field
                                                    id="form-input-control"
                                                    control={Input}
                                                    label="Discount in Percentage %"
                                                    placeholder="price"
                                                    value={addProduct?.discountPercentage || ""}
                                                    onChange={handleDiscountPercentageChange}
                                                />
                                            </Form.Group>
                                            <Form.Group widths={"equal"}>

                                                <Form.Field
                                                    id="form-input-control"
                                                    control={Input}
                                                    label="Updated new price"
                                                    placeholder="price"
                                                    value={addProduct?.price || ""}
                                                    onChange={handleDiscountByRupeesChange} />

                                            </Form.Group>

                                        </Form>

                                    </Card.Content>



                                </Card.Content>

                                {/* </Card.Content> */}
                            </Card>


                            {/* <Card style={{ width: "100%", margin: "50px 50px 0 0", }}>
                                <Card.Content style={{ padding: "20px" }}>
                                    <Card.Header style={{ fontWeight: "tiny" }}>Upload Image</Card.Header>

                                    <Card.Content style={{ padding: '10px 0 0 0px', borderTop: "1px solid #9f9f9f", margin: "10px  0" }}>

                                        <Form.Field
                                            width={4}
                                            style={{ marginTop: '18px' }}
                                            id="form-input-control-token-tracker"
                                            label="Upload Gallery Image"
                                        ></Form.Field>
                                        <div style={{ border: "1px solid gray", width: "120px", height: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                                            <div style={{ height: '80px', width: '80px' }}>
                                                <DocDropzone
                                                    name='download'
                                                    fileItem={galleryImages}
                                                    setFile={setGalleryImages}
                                                /></div>
                                        </div>


                                    </Card.Content>

                                </Card.Content>
                            </Card> */}
                            <div className="page-footer ">
                                <Button
                                    onClick={() => {
                                        clearFields(),
                                            navigate(-1)
                                    }}
                                    animated="fade"
                                    disabled={loading}

                                >
                                    <Button.Content visible>
                                        Close
                                    </Button.Content>
                                    <Button.Content hidden>
                                        <Icon name="close" />
                                    </Button.Content>
                                </Button>
                                <Button animated="fade" primary
                                    onClick={id ? UpdateProduct : onClickaddProduct}>


                                    <Button.Content visible>
                                        {id ? "update product" : "Add product"}
                                    </Button.Content>
                                    <Button.Content hidden>
                                        <Icon name="save" />
                                    </Button.Content>
                                </Button>
                            </div>
                        </div>



                    </div>


                </div>
            </Sidebar.Pusher >
        </Sidebar.Pushable >

    </>
    );
}

export default addProduct;
