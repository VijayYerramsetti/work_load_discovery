import React from 'react';
import { HelpPanel } from '@awsui/components-react';
import {matchPath, useLocation} from "react-router-dom";
import {EDIT_VIEW} from "../../../../routes";

const ViewFormHelper = () => {
  const location = useLocation();
  const isEdit = matchPath(location.pathname, {
    path: EDIT_VIEW,
    exact: true
  });

  return (
    <HelpPanel header={<h2>{isEdit ? "Edit" : "Create"} a View</h2>}>
      <p>Build a View of specific AWS Resources.</p>
      <dl>
        <dd>
          <ol>
            <li>
              Select <strong>AWS Accounts</strong>.
            </li>
            <li>
              Select <strong>AWS Regions (optional)</strong>.
            </li>
            <li>
              Select <strong>AWS Resource types</strong>.
            </li>
            <li>
              Choose <strong>Save</strong>.
            </li>
          </ol>
        </dd>
      </dl>
    </HelpPanel>
  );
};

export default ViewFormHelper;
