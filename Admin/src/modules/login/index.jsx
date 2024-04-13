import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts';
import { Button, Form, Grid, Segment, Image, Message } from 'semantic-ui-react';


function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorstate, setErrorstate] = useState(false);
  let from = location.state?.from?.pathname || '/';
  from = from == '/' ? '/dashboard/all-products' : from;
  useEffect(() => {
    let user = localStorage.getItem('accesstoken');
    if (user) {
      navigate(from, { replace: true });
    }
  }, []);

  const check_validation = (userDetails) => {
    if (!userDetails.email && !userDetails.password) {
      setErrorMessage('Please provide Email and password !');
      setErrorstate(true);
      setLoading(false);
      return false
    } else if (!userDetails.email) {
      setErrorMessage('Please provide Email !');
      setErrorstate(true);
      setLoading(false);
      return (false)
    } else if (!userDetails.password) {
      setErrorMessage('Please Provide password !');
      setErrorstate(true);
      setLoading(false);
      return (false)
    } else {
      return true
    }
  }
  function handleSubmit() {
    setLoading(true);
    let userDetails = {
      email: email,
      password: password,
    };
    const validated = check_validation(userDetails)
    if (validated) {
      auth.signin(userDetails, (type) => {
        type.type == 'success'
          ? navigate(from, { replace: true })
          : setErrorMessage(type.type),
          setErrorstate(true),
          setLoading(false);
      });
    }

  }

  return (
    <div className="fadeIn full-page-container">
      <Segment placeholder style={{ width: 350 }}>
        <Grid.Row>
          <Grid.Column>
            <Image src={"https://www.vowelweb.com/wp-content/uploads/2022/06/vowelweb-logo.png"} size="tiny" centered />
          </Grid.Column>
          <Grid.Column>
            {/* {email} */}
            <Form style={{ paddingTop: 30, paddingBottom: 30 }}>
              <Form.Input
                icon="user"
                iconPosition="left"
                label="Username"
                placeholder="Username"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onFocus={() => {
                  setErrorstate(false);
                }}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                label="Password"
                type="password"

                onFocus={() => {
                  setErrorstate(false);
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              {errorstate ? (
                <div style={{ padding: '10px', width: '70%', margin: 'auto' }}>
                  <Message className="fadeIn" color="red" size="small">
                    <Message.Content>{errorMessage}</Message.Content>
                  </Message>{' '}
                </div>
              ) : (
                ''
              )}
              <Button
                content="Login"
                primary
                loading={loading}
                disabled={loading}
                size="large"
                onClick={handleSubmit}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Segment>
    </div>
  );
}

export default LoginPage;
