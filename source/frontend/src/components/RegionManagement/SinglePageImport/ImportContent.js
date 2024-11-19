import React from 'react';
import {Button, Form, SpaceBetween, Modal, Box, Checkbox, Alert, Link} from '@awsui/components-react';
import RegionProvider from './RegionProvider';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import { ACCOUNTS, IMPORT } from '../../../routes';
import * as R from "ramda";
import {useAccounts, useAddAccounts} from "../../Hooks/useAccounts";
import {useHistory} from "react-router-dom";
import TemplateProvider from "./TemplateProvider";

const ImportContent = () => {
  const history = useHistory();
  const {addAsync: addAccounts, isLoading} = useAddAccounts();
  const {data: accounts=[]} = useAccounts();
  const [regions, setRegions] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [hasConfirmed, setHasConfirmed] = React.useState({
    global: false,
    regional: false,
  });
  const importedRegions = R.reduce(
    (acc, e) =>
      R.concat(
        acc,
        R.chain((region) => {
          return {
            accountId: e.accountId,
            accountName: e.name,
            region: region.name,
          };
        }, e.regions)
      ),
    [],
    accounts
  );
  const byAccount = R.groupBy((e) => e.accountId);
  const importAccounts = async () => {
    const accounts = R.compose(
      R.reduce(
        (acc, val) => {
          acc.push({
            accountId: R.head(val).accountId,
            name: R.head(val).accountName,
            regions: R.map((region) => {
              return { name: region.region };
            }, val),
          });
          return acc;
        },
        [],
      ),
      R.values
    )(R.mergeWith(
      R.concat,
      byAccount(regions),
      byAccount(importedRegions)
    ))
    return addAccounts(accounts)
  };

  const handleSubmit = () => {
    setSubmitting(true);
    importAccounts()
      .then(() => history.push(ACCOUNTS))
      .finally(setSubmitting(false))
  }

  return (
    <Form
      actions={
        <SpaceBetween direction='horizontal' size='xs'>
          <Button disabled={isLoading} variant='link' onClick={() => history.push(ACCOUNTS)}>
            Cancel
          </Button>
          <Button disabled={regions.length === 0} loading={isLoading || submitting} onClick={() => setShowConfirm(true)} variant='primary'>
            Import
          </Button>
        </SpaceBetween>
      }>
      <SpaceBetween size='l'>
        <Breadcrumbs
          items={[
            { text: 'Accounts', href: ACCOUNTS },
            { text: 'Import', href: IMPORT },
          ]}
        />
        <RegionProvider regions={regions} setRegions={setRegions} />
        <Modal
          onDismiss={() => setShowConfirm(false)}
          visible={showConfirm}
          size={"large"}
          closeAriaLabel="Close modal"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setShowConfirm(false)} variant="link">Cancel</Button>
                <Button disabled={Object.values(hasConfirmed).some(i => !i)} onClick={handleSubmit} variant="primary">Import</Button>
              </SpaceBetween>
            </Box>
          }
          header="Import Accounts and Regions"
        >
          <SpaceBetween size={"s"}>
            <TemplateProvider/>
            <Alert header={"Confirm Template Deployment"} type={"info"}>
              <SpaceBetween size={"xs"}>
                <Box>
                  Please confirm the global and regional templates are deployed in the required accounts and
                  regions. For deploying the required CloudFormation templates to multiple accounts and regions, we recommend
                  using{" "}
                  <Link
                    external
                    href='https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html'
                  >
                    AWS CloudFormation StackSets
                  </Link>
                </Box>
                <Checkbox
                  onChange={({ detail }) =>
                    setHasConfirmed(e => ({...e, global: detail.checked}))
                  }
                  checked={hasConfirmed.global}
                >
                  <strong>The global resources template is deployed in each of the accounts being imported</strong>
                </Checkbox>
                <Checkbox
                  onChange={({ detail }) =>
                    setHasConfirmed(e => ({...e, regional: detail.checked}))
                  }
                  checked={hasConfirmed.regional}
                >
                  <strong>The regional resources template is deployed in every region being imported for each of the listed accounts</strong>
                </Checkbox>
              </SpaceBetween>
            </Alert>
          </SpaceBetween>
        </Modal>
      </SpaceBetween>
    </Form>
  );
};

export default ImportContent;