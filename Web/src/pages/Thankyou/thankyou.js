import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiGET, apiPUT } from '../../utilities/apiHelpers';

const Thankyou = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); 


  const updateOrder = async() => {
    let updateData = await apiPUT(`/v1/order/sucessRoute/${orderId}`)
    console.log(updateData)
  }
  const continueShopping = () => {
    
    navigate('/');
  };

  useEffect(() => {
    updateOrder()
  }, [])

  return (
    <Container className="mt-5 mb-5">
      <div className="text-center">
        <h1>Thank you for shopping with us.!</h1>
        <p>We appreciate your business and hope to see you again soon.</p>
        <Button variant="primary" onClick={continueShopping}>
          Click here to continue shopping
        </Button>
      </div>
    </Container>
  );
};

export default Thankyou;
