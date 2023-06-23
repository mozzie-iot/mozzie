'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import * as yup from 'yup';

const validation = yup.object().shape({
  email: yup.string().required().label('e-mail'),
  password: yup.string().required(),
});

const Page: React.FunctionComponent = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validation,
    onSubmit: async (input, { setStatus }) => {
      setStatus({ error: '', loading: true });

      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const json = await response.json();

      if (json.statusCode === 400) {
        setStatus({ error: json.message, loading: false });
        return;
      }

      setStatus({ error: '', loading: false });

      router.push('/');
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          E-mail
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="off"
            className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
        <p className="text-xs leading-5 h-5 text-red-500">
          {formik.touched.email && formik.errors.email}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </div>
        <p className="mt-1 text-xs leading-3 h-3 text-red-500">
          {formik.touched.password && formik.errors.password}
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={formik.status && formik.status.loading}
          className={`flex w-full justify-center rounded-md bg-red-500 px-3 py-2 mt-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
            formik.status && formik.status.loading ? 'disabled:opacity-75' : ''
          }`}
        >
          Sign in
        </button>
      </div>

      {formik.status && formik.status.error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-5 rounded relative"
          role="alert"
        >
          <span className="block sm:inline text-sm">{formik.status.error}</span>
        </div>
      )}
    </form>
  );
};

export default Page;
