import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type CartItem = {
    name: string;
    price: number;
    quantity: number;
};

type Cart = {
    id: number;
    status: string;  // "Paid", "Pending", "Cancelled" etc.
    total: number;
    created_at: string;
    items: CartItem[];
};

type TopSellingItem = {
    id: number;
    name: string;
    total_quantity: number;
};

type PageProps = {
    activeUserCount: number;
    grandTotal: number;
    recentWeekSales: { date: string; total: number }[];
    recentCarts: Cart[];
    useTopSellingItems: TopSellingItem[];
};

export default function Dashboard() {
    const { props } = usePage<PageProps>();
    const activeUserCount = props.activeUserCount ?? 0;
    const grandTotal = props.grandTotal ?? 0;
    const recentWeekSales = props.recentWeekSales ?? [];
    const recentCarts = props.recentCarts ?? [];
    const topSellingItems = props.useTopSellingItems ?? [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCart, setSelectedCart] = useState<Cart | null>(null);

    const openCart = (cart: Cart) => {
        setSelectedCart(cart);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCart(null);
    };

    const formatWeekdays = (date: string) => {
        const weekdays = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];
        const dayOfWeek = new Date(date).getDay();
        return weekdays[dayOfWeek];
    };

    const chartData = recentWeekSales.map((sale) => ({
        date: formatWeekdays(sale.date),
        value: sale.total,
    }));

    const chartConfig = {
        desktop: {
            label: 'Desktop',
            color: 'hsl(var(--chart-2))',
        },
    } satisfies ChartConfig;

    // Prepare data for the top selling items bar chart
    const topSellingChartData = topSellingItems.map((item) => ({
        name: item.name,
        total_quantity: item.total_quantity,
    }));

    // Function to format the cart status
    const formatCartStatus = (status: string) => {
        switch (status) {
            case 'paid':
                return 'Төлөгдсөн';
            case 'pending':
                return 'Хүлээгдэж байна';
            case 'cancelled':
                return 'Цуцлагдсан';
            default:
                return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Идэвхитэй хэрэглэгч</span>
                                <Users className="text-muted-foreground h-5 w-5" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeUserCount}</div>
                            <p className="text-muted-foreground text-sm">Сүүлийн 7 хоногт идэвхитэй</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Нийт борлуулалт</span>₮
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₮{grandTotal.toLocaleString()}</div>
                            <p className="text-muted-foreground text-sm">Нийт борлуулалт</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts - Side by Side */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Top Selling Items Chart */}
                    <Card className="min-h-[300px]">
                        <CardHeader>
                            <CardTitle>Хамгийн их зарагдсан бараанууд</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={topSellingItems}
                                    layout="vertical"
                                    margin={{
                                        left: -20,
                                    }}
                                >
                                    <XAxis type="number" dataKey="total_quantity" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={0}
                                        axisLine={false}
                                        tickFormatter={(value) => value.toString().slice(0, 5)}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="total_quantity" fill="white" radius={5} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Sales Chart */}
                    <Card className="min-h-[300px]">
                        <CardHeader>
                            <CardTitle>Сүүлийн 7 хоногийн борлуулалт</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="value" fill="white" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Carts Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Сүүлийн захиалгууд</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Захиалгын ID</th>
                                    <th className="px-4 py-2 text-left">Төлөв</th>
                                    <th className="px-4 py-2 text-left">Нийт</th>
                                    <th className="px-4 py-2 text-left">Огноо</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCarts.map((cart) => (
                                    <tr key={cart.id} className="hover:bg-muted cursor-pointer" onClick={() => openCart(cart)}>
                                        <td className="px-4 py-2">{cart.id}</td>
                                        <td className="px-4 py-2">{formatCartStatus(cart.status)}</td>
                                        <td className="px-4 py-2">₮{cart.total.toLocaleString()}</td>
                                        <td className="px-4 py-2">{new Date(cart.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* Cart Item Modal */}
            {selectedCart && (
                <Dialog open={isModalOpen} onOpenChange={closeModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Захиалгын дэлгэрэнгүй</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4">
                            <p>
                                <strong>ID:</strong> {selectedCart.id}
                            </p>
                            <p>
                                <strong>Төлөв:</strong> {formatCartStatus(selectedCart.status)}
                            </p>
                            <p>
                                <strong>Нийт:</strong> ₮{selectedCart.total.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-2 font-semibold">Бараанууд:</h4>
                            <table className="w-full table-auto text-sm">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-1 text-left">Нэр</th>
                                        <th className="px-2 py-1 text-left">Үнэ</th>
                                        <th className="px-2 py-1 text-left">Тоо</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCart.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="px-2 py-1">{item.name}</td>
                                            <td className="px-2 py-1">₮{item.price.toLocaleString()}</td>
                                            <td className="px-2 py-1">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
