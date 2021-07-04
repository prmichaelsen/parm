import Button from '@material-ui/core/Button';
import React, { useCallback } from 'react';
import { useField } from '@parm/react/use-field';
import { useData } from './firebase';

export const Alias = () => {
  const {
    value: alias,
    field: aliasField,
  } = useField({
    value: '',
    label: 'The name of the alias',
  });
  const {
    value: target,
    field: targetField,
  } = useField({
    value: '',
    label: 'The node to redirect to',
  });
  const { createOption } = useData();
  const submit = useCallback(async () => {
    await createOption({
      parent: null,
      type: 'redirect',
      text: 'Redirecting you in a moment...',
      children: [],
      id: alias,
      data: {
        target,
      },
    });
  }, [alias, target]);
  return (
    <div>
      {aliasField}
      {targetField}
      <Button
        onClick={submit}
      >
        Submit 
      </Button>
    </div>
  );
};