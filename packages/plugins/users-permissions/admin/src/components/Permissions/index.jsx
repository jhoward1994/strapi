import React from 'react';

import { Tabs, Checkbox, Box, Typography } from '@strapi/design-system';
import { styled } from 'styled-components';

import { Accordion, Flex } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { useUsersPermissions } from '../../contexts/UsersPermissionsContext';
import formatPluginName from '../../utils/formatPluginName';

import init from './init';
import PermissionRow from './PermissionRow';
import { initialState, reducer } from './reducer';

const TAB_LABELS = [
  {
    labelId: '🛑',
    defaultMessage: 'Collection Types',
    id: 'collectionTypes',
  },
  {
    labelId: '🛑',
    id: 'singleTypes',
    defaultMessage: 'Single Types',
  },
  {
    labelId: '🛑',
    defaultMessage: 'Plugins',
    id: 'plugins',
  },
];

const BoxWrapper = styled.div`
  display: inline-flex;
  min-width: 100%;
  position: relative;
`;

const Wrapper = styled(Flex)`
  height: 50px;
  border: 1px solid transparent;
`;

// TODO width
const Cell = styled(Flex)`
  width: 10px;
  position: relative;
`;

const Permissions = () => {
  const { modifiedData } = useUsersPermissions();
  const { formatMessage } = useIntl();

  // Sort the data from the API into different tabs
  const separatedData = Object.entries(modifiedData).reduce(
    (acc, [key, { isCollectionType, controllers }]) => {
      const [pluginName] = key.split('::');

      const isPlugin = pluginName === 'plugin';

      if (isPlugin) {
        acc.plugins.push({ key, value: { controllers } });

        return acc;
      }

      if (isCollectionType) {
        acc.collectionTypes.push({ key, value: { controllers } });
      } else {
        acc.singleTypes.push({ key, value: { controllers } });
      }

      return acc;
    },
    {
      collectionTypes: [],
      singleTypes: [],
      plugins: [],
    }
  );

  const rowHeight = 100; // temp

  return (
    <Tabs.Root defaultValue={TAB_LABELS[0].id}>
      <Tabs.List
        aria-label={formatMessage({
          id: 'Settings.permissions.users.tabs.label',
          defaultMessage: 'Tabs Permissions',
        })}
      >
        {TAB_LABELS.map((tabLabel) => (
          <Tabs.Trigger key={tabLabel.id} value={tabLabel.id}>
            {formatMessage({ id: tabLabel.labelId, defaultMessage: tabLabel.defaultMessage })}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content value={TAB_LABELS[0].id}>
        {separatedData.collectionTypes.map(({ value }, index) => {
          const isGrey = index % 2 === 0;

          const checkBoxConfigs = Object.entries(value.controllers)
            .flatMap(([, actions]) =>
              Object.entries(actions).map(([actionKey, actionDetails]) => ({
                name: actionKey,
                checked: actionDetails.enabled,
              }))
            )
            .sort((a, b) => a.name.localeCompare(b.name));

          const name = Object.keys(value.controllers)[0]
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

          // TODO Somewhere we need a stretch flex otuside the fow to align the check boxes
          // <Flex direction="column" display="inline-flex" alignItems="stretch" minWidth="100%">
          return (
            <BoxWrapper>
              <Wrapper
                height={rowHeight}
                flex={1}
                alignItems="center"
                background={isGrey ? 'neutral100' : 'neutral0'}
              >
                <Flex alignItems="center" paddingLeft={6} shrink={0}>
                  <Box paddingRight={2}>
                    <Checkbox
                      name={name}
                      aria-label={formatMessage(
                        {
                          id: `Settings.permissions.select-all-by-permission`,
                          defaultMessage: 'Select all {label} permissions',
                        },
                        { label: name }
                      )}
                      // Keep same signature as packages/core/admin/admin/src/components/Roles/Permissions/index.js l.91
                      onCheckedChange={(value) => {
                        console.log('Changed value', value);
                        // onChange({
                        //   target: {
                        //     name: checkboxName,
                        //     value: !!value,
                        //   },
                        // });
                      }}
                      // TODO
                      checked={true}
                      // checked={someChecked ? 'indeterminate' : value}
                    />
                  </Box>
                  <Typography ellipsis>{name}</Typography>
                </Flex>

                <Flex style={{ flex: 1 }}>
                  {checkBoxConfigs.map(({ name, checked }, index) => {
                    return (
                      <Cell key={`Action-${index}`} justifyContent="center" alignItems="center">
                        <Checkbox
                          name={name}
                          // Keep same signature as packages/core/admin/admin/src/components/Roles/Permissions/index.js l.91
                          onCheckedChange={(value) => {
                            console.log('onChange', value);
                            // onChangeSimpleCheckbox({
                            //   target: {
                            //     name: checkboxName,
                            //     value: !!value,
                            //   },
                            // });
                          }}
                          checked={checked}
                        />
                      </Cell>
                    );
                  })}
                </Flex>
              </Wrapper>
            </BoxWrapper>
          );
        })}
      </Tabs.Content>
      <Tabs.Content value={TAB_LABELS[1].id}>
        {separatedData.singleTypes.map(({ value }, index) => {
          const isGrey = index % 2 === 0;

          const name = Object.keys(value.controllers)[0]
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

          return (
            <BoxWrapper>
              <Wrapper
                height={rowHeight}
                flex={1}
                alignItems="center"
                background={isGrey ? 'neutral100' : 'neutral0'}
              >
                <Flex alignItems="center" paddingLeft={6} shrink={0}>
                  <Box paddingRight={2}>
                    <Checkbox
                      name={name}
                      aria-label={formatMessage(
                        {
                          id: `Settings.permissions.select-all-by-permission`,
                          defaultMessage: 'Select all {label} permissions',
                        },
                        { label: name }
                      )}
                      // Keep same signature as packages/core/admin/admin/src/components/Roles/Permissions/index.js l.91
                      onCheckedChange={(value) => {
                        console.log('Changed value', value);
                        // onChange({
                        //   target: {
                        //     name: checkboxName,
                        //     value: !!value,
                        //   },
                        // });
                      }}
                      // TODO
                      checked={true}
                      // checked={someChecked ? 'indeterminate' : value}
                    />
                  </Box>
                  <Typography ellipsis>{name}</Typography>
                </Flex>

                <Flex style={{ flex: 1 }} />
              </Wrapper>
            </BoxWrapper>
          );
        })}
        {/* <ContentTypes
          layout={layouts.collectionTypes}
          kind="collectionTypes"
          isFormDisabled={isFormDisabled}
        /> */}
      </Tabs.Content>
      <Tabs.Content value={TAB_LABELS[2].id}>
        {separatedData.plugins.map(({ value }, index) => {
          const isGrey = index % 2 === 0;

          const name = Object.keys(value.controllers)[0]
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

          return (
            <BoxWrapper>
              <Wrapper
                height={rowHeight}
                flex={1}
                alignItems="center"
                background={isGrey ? 'neutral100' : 'neutral0'}
              >
                <Flex alignItems="center" paddingLeft={6} shrink={0}>
                  <Box paddingRight={2}>
                    <Checkbox
                      name={name}
                      aria-label={formatMessage(
                        {
                          id: `Settings.permissions.select-all-by-permission`,
                          defaultMessage: 'Select all {label} permissions',
                        },
                        { label: name }
                      )}
                      // Keep same signature as packages/core/admin/admin/src/components/Roles/Permissions/index.js l.91
                      onCheckedChange={(value) => {
                        console.log('Changed value', value);
                        // onChange({
                        //   target: {
                        //     name: checkboxName,
                        //     value: !!value,
                        //   },
                        // });
                      }}
                      // TODO
                      checked={true}
                      // checked={someChecked ? 'indeterminate' : value}
                    />
                  </Box>
                  <Typography ellipsis>{name}</Typography>
                </Flex>

                <Flex style={{ flex: 1 }} />
              </Wrapper>
            </BoxWrapper>
          );
        })}
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default Permissions;
