"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const orders = [
  { id: "ORD001", customer: "Alice Johnson", product: "Radiant Desire EDP 50ML", date: "2023-10-26", status: "Delivered", total: "Rs. 1899.00" },
  { id: "ORD002", customer: "Bob Williams", product: "Dark Secrets EDP 50ML", date: "2023-10-27", status: "Processing", total: "Rs. 2750.00" },
  { id: "ORD003", customer: "Charlie Brown", product: "Make My Day EDP 50ML", date: "2023-10-27", status: "Cancelled", total: "Rs. 1550.00" },
];

const OrdersPageComponent = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Order Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold mt-1">3</h2>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Delivered</p>
          <h2 className="text-2xl font-bold mt-1">1</h2>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Processing</p>
          <h2 className="text-2xl font-bold mt-1">1</h2>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold mt-1">Rs. 6199</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>PRODUCT</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default OrdersPageComponent;