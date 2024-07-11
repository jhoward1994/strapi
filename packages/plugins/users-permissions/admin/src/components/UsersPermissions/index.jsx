import React, { forwardRef, memo, useImperativeHandle, useReducer } from 'react';

import { Grid } from '@strapi/design-system';
import PropTypes from 'prop-types';

import { UsersPermissionsProvider } from '../../contexts/UsersPermissionsContext';
import Permissions from '../Permissions';

import init from './init';
import reducer, { initialState } from './reducer';

const UsersPermissions = forwardRef(({ permissions, routes }, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState, (state) =>
    init(state, permissions, routes)
  );

  useImperativeHandle(ref, () => ({
    getPermissions() {
      return {
        permissions: state.modifiedData,
      };
    },
    resetForm() {
      dispatch({ type: 'ON_RESET' });
    },
    setFormAfterSubmit() {
      dispatch({ type: 'ON_SUBMIT_SUCCEEDED' });
    },
  }));

  const handleChange = ({ target: { name, value } }) =>
    dispatch({
      type: 'ON_CHANGE',
      keys: name.split('.'),
      value: value === 'empty__string_value' ? '' : value,
    });

  const handleChangeSelectAll = ({ target: { name, value } }) =>
    dispatch({
      type: 'ON_CHANGE_SELECT_ALL',
      keys: name.split('.'),
      value,
    });

  const handleSelectedAction = (actionToSelect) =>
    dispatch({
      type: 'SELECT_ACTION',
      actionToSelect,
    });

  const providerValue = {
    ...state,
    onChange: handleChange,
    onChangeSelectAll: handleChangeSelectAll,
    onSelectedAction: handleSelectedAction,
  };

  return (
    <UsersPermissionsProvider value={providerValue}>
      {/* TODO fix styling padding etc */}
      <Grid.Root shadow="filterShadow" hasRadius background="neutral0">
        <Grid.Item col={12}>
          <Permissions />
        </Grid.Item>
      </Grid.Root>
    </UsersPermissionsProvider>
  );
});

UsersPermissions.propTypes = {
  permissions: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
};

export default memo(UsersPermissions);
