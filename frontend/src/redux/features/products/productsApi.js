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
        getAllProducts: builder.query({
            query: () => "/",
            providesTags: ["Products"],
        }),

        getProductById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        searchProducts: builder.query({
            query: (searchTerm) => `/search?query=${searchTerm}`,
            providesTags: ["Products"],
        }),

        addProduct: builder.mutation({
            query: (newProduct) => ({
                url: "/create-product",
                method: "POST",
                body: newProduct,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["Products"],
        }),

        updateProduct: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/${id}`,
                method: "PUT",
                body: rest,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/${id}`, // ✅ Corrected delete route
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useSearchProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;

export default productsApi;
