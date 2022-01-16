import React, { forwardRef } from 'react';
import tw from 'tailwind-styled-components';
import { classNames } from './classNames';

const Input: any = forwardRef<any>((props: any, ref) => {
  const { className = '' } = props;
  return (
    <input
      ref={ref}
      {...props}
      className={classNames(
        `block w-full shadow-sm 
        focus:ring-indigo-500 focus:border-indigo-500 
        sm:text-sm 
        border-gray-300 dark:border-gray-500 rounded-md 
        dark:bg-gray-700`,
        className
      )}
    />
  );
});

Input.Select = forwardRef<any>((props: any, ref) => {
  const { className = '', options } = props;
  return (
    <select
      ref={ref}
      {...props}
      className={classNames(
        `block w-full shadow-sm 
        focus:ring-indigo-500 focus:border-indigo-500 
        sm:text-sm 
        border-gray-300 dark:border-gray-500 rounded-md 
        dark:bg-gray-700`,
        className
      )}
    >
      {options.map((value, i) => (
        <option key={i} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
});

Input.Textarea = forwardRef<any>((props, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`block w-full shadow-sm 
      focus:ring-indigo-500 focus:border-indigo-500 
      sm:text-sm 
      border-gray-300 dark:border-gray-500 rounded-md 
      dark:bg-gray-700`}
    />
  );
});

Input.WithIcon = tw.div`relative rounded-md shadow-sm`;
Input.Icon = tw.div`absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none`;

export default Input;
