import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { useField } from '@parm/react/use-field';

import './date-subtracter.scss';

/* eslint-disable-next-line */
export interface DateSubtracterProps {}

/** regex
 * matching yyyy-md-dd
 */
const yyyymmdd = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const diffDays = (a: string, b: string) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(a);
  const secondDate = new Date(b)
  return Math.round(Math.abs((+secondDate - +firstDate) / oneDay));
}

const validate = value => {
  return yyyymmdd.test(value);
}

const placeholder = 'yyyy-mm-dd';

export const DateSubtracter = (props: DateSubtracterProps) => {
  const {
    value: startValue,
    field: start,
  } = useField({ 
    label: 'Start', value: '',
    validate, placeholder,
  });
  const {
    value: endValue,
    field: end,
  } = useField({ label: 'End', value: formatDate(new Date())});
  return (
    <div>
      {start}
      {end}
      Diff in days: {diffDays(startValue, endValue)}
    </div>
  );
};

export default DateSubtracter;
