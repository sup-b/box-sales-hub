import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Order = Tables<"orders"> & { orderItems: Tables<"order_items">[] };
export type OrderStatus = "pending" | "preparing" | "shipping" | "completed" | "cancelled";

export interface CreateOrderPayload {
  customer_name: string;
  phone: string;
  address: string;
  items: {
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
  }[];
}

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((o) => ({
        ...o,
        status: o.status as OrderStatus,
        orderItems: o.order_items,
      })) as Order[];
    },
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const orderId = `DH${String(Date.now()).slice(-6)}`;
      const total = payload.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const today = new Date().toLocaleDateString("vi-VN");

      const { error: orderErr } = await supabase.from("orders").insert({
        id: orderId,
        customer_name: payload.customer_name,
        phone: payload.phone,
        address: payload.address,
        date: today,
        total,
        items: payload.items.reduce((s, i) => s + i.quantity, 0),
        status: "pending",
      });
      if (orderErr) throw orderErr;

      const orderItems = payload.items.map((i) => ({
        order_id: orderId,
        name: i.name,
        size: i.size,
        color: i.color,
        price: i.price,
        quantity: i.quantity,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      return orderId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};
