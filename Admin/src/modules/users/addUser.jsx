import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Icon,
  Form,
  Input,
  TextArea,
  Select,
} from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';

const sections = [
  { key: 'Dashboard', content: 'Dashboard', link: true },
  { key: 'User List', content: 'User List', link: true },
  { key: 'Add User', content: 'Add User', active: true },
];

const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
];

function AddUser() {
  const navigate = useNavigate();

  return (
    <div className="fadeIn page-content-wrapper">
      <div className="page-header">
        <div>
          <Breadcrumb icon="right angle" sections={sections} />
          <div className="header-text">New users</div>
          <div className="sub-text">Proceed to create new users here.</div>
        </div>
        <div className="page-header-actions"></div>
      </div>
      <div className="page-body">
        <Form style={{ width: '100%' }}>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-control-first-name"
              control={Input}
              label="First name"
              placeholder="First name"
            />
            <Form.Field
              id="form-input-control-last-name"
              control={Input}
              label="Last name"
              placeholder="Last name"
            />
            <Form.Field
              control={Select}
              options={genderOptions}
              label={{
                children: 'Gender',
                htmlFor: 'form-select-control-gender',
              }}
              placeholder="Gender"
              search
              searchInput={{ id: 'form-select-control-gender' }}
            />
          </Form.Group>
          <Form.Field
            id="form-textarea-control-opinion"
            control={TextArea}
            label="Opinion"
            placeholder="Opinion"
          />
          <Form.Field
            id="form-input-control-error-email"
            control={Input}
            label="Email"
            placeholder="joe@schmoe.com"
            error={{
              content: 'Please enter a valid email address',
              pointing: 'below',
            }}
          />
          <Form.Field
            id="form-button-control-public"
            control={Button}
            content="Confirm"
            label="Label with htmlFor"
          />
        </Form>
      </div>
      <div className="page-footer ">
        <Button
          animated="fade"
          onClick={() => {
            navigate(-1);
          }}>
          <Button.Content visible>Close</Button.Content>
          <Button.Content hidden>
            <Icon name="close" />
          </Button.Content>
        </Button>
        <Button animated="fade" primary onClick={() => {}}>
          <Button.Content visible>Create User</Button.Content>
          <Button.Content hidden>
            <Icon name="save" />
          </Button.Content>
        </Button>
      </div>
    </div>
  );
}

export default AddUser;
