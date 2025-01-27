import { Orders } from "./components/orders";
import { getCookieServer } from "@/lib/cookieServer";
import { api } from "@/services/api";
import { toast } from "sonner";
import { OrderProps } from "@/lib/orderType";

export const dynamic = "force-dynamic";

async function getOrders(): Promise<OrderProps[] | []> {
    try {
        const token = await getCookieServer();
        const response = await api.get("/orders",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data || [];

    } catch (error) {
        console.log(error);
        toast.warning("Erro ao recuperar pedidos");
        return [];
    }
}

export default async function Dashboard() {
    const orders = await getOrders();

    return (
        <>
        <Orders orders={orders} />
        </>
    );
}
