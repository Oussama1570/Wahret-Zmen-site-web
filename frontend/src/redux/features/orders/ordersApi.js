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
    // ✅ Create a new order
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Get all orders (Admin only)
    getAllOrders: builder.query({
      query: () => "/",
      providesTags: ["Orders"],
    }),

    // ✅ Get a single order by ID
    getOrderById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: ["Orders"],
    }),

    // ✅ Get orders by customer email
    getOrderByEmail: builder.query({
      query: (email) => ({
        url: `/email/${email}`,
      }),
      providesTags: ["Orders"],
    }),

    // ✅ Update an order (e.g., change status, assign tailor, update tracking details)
    updateOrder: builder.mutation({
      query: ({ orderId, isPaid, isDelivered, completionPercentage, tailorAssignments, trackingNumber, trackingUrl }) => ({
        url: `/${orderId}`,
        method: "PATCH",
        body: { isPaid, isDelivered, completionPercentage, tailorAssignments, trackingNumber, trackingUrl },
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