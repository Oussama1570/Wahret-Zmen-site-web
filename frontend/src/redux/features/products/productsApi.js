import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/products`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery,
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // ✅ Get all products (Ensuring Colors Exist)
    getAllProducts: builder.query({
      query: () => "/",
      transformResponse: (response) =>
        response.map((product) => ({
          ...product,
          colors: product.colors?.length
            ? product.colors // ✅ Preserve existing colors
            : [{ colorName: "Default", image: product.coverImage }], // ✅ Fallback color
        })),
      providesTags: ["Products"],
    }),

    // ✅ Get a single product by ID (Ensuring Colors Exist)
    getProductById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (product) => ({
        ...product,
        colors: product.colors?.length
          ? product.colors // ✅ Preserve existing colors
          : [{ colorName: "Default", image: product.coverImage }], // ✅ Fallback color
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ✅ Search products
    searchProducts: builder.query({
      query: (searchTerm) => `/search?query=${searchTerm}`,
      providesTags: ["Products"],
    }),

    // ✅ Add a new product (Ensure Colors Are Correctly Stored)
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: {
          ...newProduct,
          colors: newProduct.colors?.length
            ? newProduct.colors // ✅ Store provided colors
            : [{ colorName: "Default", image: newProduct.coverImage }], // ✅ Default color if none selected
        },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ Update an existing product (Ensuring Colors Are Preserved)
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: {
          ...rest,
          colors: rest.colors?.length
            ? rest.colors // ✅ Preserve selected colors
            : [{ colorName: "Default", image: rest.coverImage }], // ✅ Default color fallback
        },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),

    // ✅ Delete a product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ Update product price by percentage (Ensuring Proper Price Updates)
    updateProductPriceByPercentage: builder.mutation({
      query: ({ id, percentage }) => ({
        url: `/update-price/${id}`,
        method: "PUT",
        body: { percentage },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
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
  useUpdateProductPriceByPercentageMutation,
} = productsApi;

export default productsApi;
