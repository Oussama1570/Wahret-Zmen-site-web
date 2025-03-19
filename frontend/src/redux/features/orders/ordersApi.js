import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/orders`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // ✅ Create a new order (Ensuring Color is Correctly Included)
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: {
          ...newOrder,
          products: newOrder.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            color: product.color?.colorName
              ? product.color // ✅ User-selected color
              : { colorName: "Default", image: product.productId?.coverImage || "/assets/default-image.png" }, // ✅ Fallback to default
          })),
        },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Get all orders (Ensuring Cover Image & Color are Displayed)
    getAllOrders: builder.query({
      query: () => "/",
      transformResponse: (response) =>
        response.map((order) => ({
          ...order,
          products: order.products.map((product) => ({
            ...product,
            coverImage: product.productId?.coverImage || "/assets/default-image.png", // ✅ Ensure coverImage exists
            color: product.color?.colorName
              ? product.color // ✅ Preserve selected color
              : { colorName: "Default", image: product.productId?.coverImage || "/assets/default-image.png" }, // ✅ Fallback color
          })),
        })),
      providesTags: ["Orders"],
    }),

    // ✅ Get a single order by ID (Ensuring Cover Image & Color are Displayed)
    getOrderById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      transformResponse: (order) => ({
        ...order,
        products: order.products.map((product) => ({
          ...product,
          coverImage: product.productId?.coverImage || "/assets/default-image.png", // ✅ Ensure coverImage exists
          color: product.color?.colorName
            ? product.color // ✅ Preserve selected color
            : { colorName: "Default", image: product.productId?.coverImage || "/assets/default-image.png" }, // ✅ Fallback color
        })),
      }),
      providesTags: ["Orders"],
    }),

    // ✅ Get orders by customer email (Ensuring Cover Image & Color are Displayed)
    getOrderByEmail: builder.query({
      query: (email) => ({
        url: `/email/${email}`,
      }),
      transformResponse: (response) =>
        response.map((order) => ({
          ...order,
          products: order.products.map((product) => ({
            ...product,
            coverImage: product.productId?.coverImage || "/assets/default-image.png", // ✅ Ensure coverImage exists
            color: product.color?.colorName
              ? product.color // ✅ Preserve selected color
              : { colorName: "Default", image: product.productId?.coverImage || "/assets/default-image.png" }, // ✅ Fallback color
          })),
        })),
      providesTags: ["Orders"],
    }),

    // ✅ Update an order (Ensuring Color is Not Lost)
    updateOrder: builder.mutation({
      query: ({ orderId, isPaid, isDelivered, completionPercentage, tailorAssignments }) => ({
        url: `/${orderId}`,
        method: "PATCH",
        body: {
          isPaid,
          isDelivered,
          completionPercentage,
          tailorAssignments, // ✅ Send tailor assignments per color
        },
      }),
      invalidatesTags: ["Orders"],
    }),
    
    

    // ✅ Delete an order
    deleteOrder: builder.mutation({
      query: ({ orderId }) => ({
        url: `/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Send email notification about order status
    sendOrderNotification: builder.mutation({
      query: ({ orderId, email, completionPercentage }) => ({
        url: `/notify`,
        method: "POST",
        body: { orderId, email, completionPercentage },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByEmailQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useSendOrderNotificationMutation,
} = ordersApi;

export default ordersApi;