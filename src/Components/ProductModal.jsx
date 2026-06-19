import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import supabase from '@/Config/Supabase';
import toast from 'react-hot-toast';

const ProductModal = ({ isModalOpen, closeModal }) => {

    const ProductSchema = Yup.object().shape({
        productName: Yup.string().required('Product name is required'),
        desc: Yup.string().required('Description is required'),
        shortDesc: Yup.string().required('Short description is required'),
        price: Yup.number().positive('Price must be a positive number').required('Price is required'),
        discount: Yup.number().positive("Must be a positive number").nullable()
            .transform((_, value) => (value === "" ? null : value)),
        stockQty: Yup.number().integer('Stock quantity must be an integer').min(0, 'Stock quantity cannot be negative'),
        productImg: Yup.string().nullable()
            .transform((_, value) => (value === "" ? null : value)),
        category: Yup.string().required('Category is required'),
        brand: Yup.string().nullable()
            .transform((_, value) => (value === "" ? null : value)),
    });

    const formik = useFormik({
        initialValues: {
            productName: '',
            desc: '',
            shortDesc: '',
            price: '',
            discount: '',
            stockQty: '',
            productImg: '',
            category: '',
            dealTag: 'none',
            brand: '',
            status: true,
        },
        validationSchema: ProductSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            setSubmitting(true);
            // 1. Separate dealTag from the rest of the data
            const { dealTag, ...restData } = values;

            // 2. Map dealTag to the corresponding boolean columns for Supabase
            const payload = {
                ...restData,
                isNew: dealTag === 'new',
                isBestseller: dealTag === 'best-seller',
            };

            try {
                // 3. Insert into Supabase
                const { error } = await supabase.from('products').insert(payload);

                if (error) throw error;

                // 4. Success handling
                toast.success('Product added successfully!');
                resetForm();
                closeModal();
            } catch (error) {
                // 5. Error handling
                console.error('Error inserting product:', error.message);
                toast.error(`Failed to add product: ${error.message}`);
            } finally {
                setSubmitting(false);
            }
        }

    });

    // Return null if modal is not open to completely unmount it from the DOM
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 bg-opacity-50 backdrop-blur-sm overflow-y-auto font-sans text-gray-900 transition-opacity">
            <div className="bg-gray-50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 sm:p-8">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
                        <button onClick={closeModal} className="text-gray-500 hover:text-red-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Essential Info & Pricing */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Card 1: General Information */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-2">General Information</h2>

                                    <div>
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                        <input
                                            type="text"
                                            id="productName"
                                            {...formik.getFieldProps('productName')}
                                            placeholder="e.g., Organic Green Lettuce"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                        />
                                        {formik.touched.productName && formik.errors.productName && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.productName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                        <textarea
                                            id="desc"
                                            rows={5}
                                            {...formik.getFieldProps('desc')}
                                            placeholder="Provide a detailed description..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                        />
                                        {formik.touched.desc && formik.errors.desc && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.desc}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                                        <textarea
                                            id="shortDesc"
                                            rows={3}
                                            {...formik.getFieldProps('shortDesc')}
                                            placeholder="A brief summary..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                        />
                                        {formik.touched.shortDesc && formik.errors.shortDesc && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.shortDesc}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Card 2: Pricing & Inventory */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-2">Pricing & Stock</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Base Price ($) *</label>
                                            <div className="relative rounded-lg shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="price"
                                                    {...formik.getFieldProps('price')}
                                                    placeholder="14.99"
                                                    className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                                />
                                            </div>
                                            {formik.touched.price && formik.errors.price && (
                                                <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                            <div className="relative rounded-lg shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">%</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="discount"
                                                    {...formik.getFieldProps('discount')}
                                                    placeholder="10"
                                                    className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                                />
                                            </div>
                                            {formik.touched.discount && formik.errors.discount && (
                                                <p className="text-red-500 text-xs mt-1">{formik.errors.discount}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label htmlFor="stockQty" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                            <input
                                                type="number"
                                                id="stockQty"
                                                {...formik.getFieldProps('stockQty')}
                                                placeholder="150"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                            />
                                            {formik.touched.stockQty && formik.errors.stockQty ? (
                                                <p className="text-red-500 text-xs mt-1">{formik.errors.stockQty}</p>
                                            ) : (
                                                <p className="text-gray-500 text-xs mt-1">Current inventory level.</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                                            <input
                                                type="text"
                                                id="brand"
                                                {...formik.getFieldProps('brand')}
                                                placeholder="none"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                            />
                                            {formik.touched.brand && formik.errors.brand && (
                                                <p className="text-red-500 text-xs mt-1">{formik.errors.brand}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Media Upload & Taxonomy */}
                            <div className="space-y-6">
                                {/* Card 3: Product Media */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-2">Product Image</h2>

                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#00B207] transition-colors group cursor-pointer">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#00B207] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h12m16-16v12a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h12m4 4l-4-4m4 4l4-4m-4 4v12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload" className="relative font-medium text-[#00B207] bg-white rounded-md hover:text-[#009906] focus-within:outline-none cursor-pointer">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium bg-gray-100 px-3 py-1.5 rounded-md inline-block">
                                        currently unavailable
                                    </p>
                                    <div className="pt-5 border-t border-gray-200 text-sm text-gray-600">
                                        <label htmlFor="productImg" className="block mb-1 font-medium">or add Image via Link</label>
                                        <input
                                            type="text"
                                            id="productImg"
                                            {...formik.getFieldProps('productImg')}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                        />
                                    </div>
                                </div>

                                {/* Card 4: Organization & Tags */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-50 pb-2">Organization</h2>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                        <select
                                            id="category"
                                            {...formik.getFieldProps('category')}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="vegetables">Vegetables</option>
                                            <option value="fruits">Fruits</option>
                                            <option value="medicine">Medicine</option>
                                            <option value="safe-products">Safe Products</option>
                                        </select>
                                        {formik.touched.category && formik.errors.category && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="dealTag" className="block text-sm font-medium text-gray-700 mb-1">Promotion Tag</label>
                                        <select
                                            id="dealTag"
                                            {...formik.getFieldProps('dealTag')}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#00B207] focus:border-[#00B207]"
                                        >
                                            <option value="none">None</option>
                                            <option value="best-seller">Best Seller</option>
                                            <option value="new">New</option>
                                        </select>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="status"
                                                    type="checkbox"
                                                    {...formik.getFieldProps('status')}
                                                    checked={formik.values.status}
                                                    className="h-4 w-4 text-[#00B207] focus:ring-[#00B207] border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="status" className="font-medium text-gray-700">Visible on Storefront</label>
                                                <p className="text-gray-500">Make this product viewable by customers.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action Group */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={closeModal}
                                type="button"
                                disabled={formik.isSubmitting}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="flex items-center px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-[#00B207] hover:bg-[#009906] shadow-sm transition-colors disabled:opacity-70"
                            >
                                {formik.isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : 'Publish Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductModal