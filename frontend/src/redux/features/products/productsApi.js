import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl().replace(/\/$/, '')}/api/products`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery,
    tagTypes: ["Products"],
    endpoints: (builder) => ({
        // ✅ Fetch All Products
        getAllProducts: builder.query({
            query: () => "/",
            providesTags: ["Products"],
        }),

        // ✅ Fetch a Single Product by ID
        getProductById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        // ✅ Search Products by Name or Category
        searchProducts: builder.query({
            query: (searchTerm) => `/search?query=${searchTerm}`,
            providesTags: ["Products"],
        }),

        // ✅ Add a New Product (Including Stock Quantity)
        addProduct: builder.mutation({
            query: (newProduct) => ({
                url: "/create-product",
                method: "POST",
                body: newProduct,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["Products"],
        }),

        // ✅ Update Product (Including Stock)
        updateProduct: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
        }),

        // ✅ Delete a Product
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useGetAllProductsQuery,   // ✅ Corrected Export Name
    useGetProductByIdQuery,
    useSearchProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;

export default productsApi;
