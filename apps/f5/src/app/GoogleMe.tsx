import Button from '@material-ui/core/Button';
import React, { useCallback } from 'react';
import { useField } from '@parm/react/use-field';

export const GoogleMe = () => {
  const {
    value: search,
    field: searchField,
  } = useField({
    value: '',
    label: 'Text to search for',
  });
  const submit = useCallback(async () => {
    const uri = new URL('https://us-central1-parm-app.cloudfunctions.net/functionGoogleMe');
    uri.searchParams.append('q', search);
    window.open(uri.href);
  }, [search]);
  return (
    <div>
      {searchField}
      <Button
        onClick={submit}
      >
        Submit 
      </Button>
    </div>
  );
};