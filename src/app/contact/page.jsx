"use client"
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Contact() {
  const [status, setStatus] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      message: Yup.string()
        .min(10, 'Message must be at least 10 characters')
        .required('Message is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setStatus('Sending...');
      try {
        // Replace YOUR_FORM_ID_HERE with your Formspree/Web3Forms key
        const response = await fetch('https://formspree.io/f/xbdeybpj', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setStatus('Message sent successfully!');
          resetForm();
        } else {
          setStatus('Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error(error);
        setStatus('Failed to send message.');
      }
    },
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-lg mx-auto bg-background rounded-2xl shadow-sm border border-blue-100 p-8 md:p-10">
        <h2 className="text-3xl font-extrabold text-green-600 mb-2">
          Get in Touch
        </h2>
        <p className="text-muted mb-8">
          Have a question about this project or want to collaborate? Send me a message.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
{/* Name Field */}
<div>
  <label htmlFor="name" className="block text-sm font-medium text-muted"> Name </label>
  <input
    type="text"
    id="name"
    {...formik.getFieldProps('name')}
    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm px-4 py-2 border bg-gray-50 text-gray-900 transition-colors
      ${formik.touched.name && formik.errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
    placeholder="Your Name"
  />
  {formik.touched.name && formik.errors.name ? (
    <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
  ) : null}
</div>

{/* Email Field */}
<div>
  <label htmlFor="email" className="block text-sm font-medium text-muted"> Email Address </label>
  <input
    type="email"
    id="email"
    {...formik.getFieldProps('email')}
    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm px-4 py-2 border bg-gray-50 text-gray-900 transition-colors
      ${formik.touched.email && formik.errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
    placeholder="you@example.com"
  />
  {formik.touched.email && formik.errors.email ? (
    <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
  ) : null}
</div>

{/* Message Field */}
<div>
  <label htmlFor="message" className="block text-sm font-medium text-muted"> Message </label>
  <textarea
    id="message"
    rows={4}
    {...formik.getFieldProps('message')}
    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm px-4 py-2 border bg-gray-50 text-gray-900 transition-colors
      ${formik.touched.message && formik.errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
    placeholder="How can I help you?"
  />
  {formik.touched.message && formik.errors.message ? (
    <p className="mt-1 text-xs text-red-500">{formik.errors.message}</p>
  ) : null}
</div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
          >
            {formik.isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {/* Status Message */}
          {status && (
            <p className={`text-sm text-center mt-4 ${status.includes('successfully') ? 'text-green-600 font-medium' : 'text-blue-600'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}