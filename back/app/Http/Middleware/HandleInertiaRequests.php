<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'activeUserCount' => User::where('last_seen_at', '>=', now()->subWeek())->count(),
            'grandTotal' => fn() => Cart::where('status', 'paid')->sum('total'),
            'recentWeekSales' => fn() => $this->getRecentWeekSales(),
            'useTopSellingItems' => fn() => Cart::with('items.item')
                ->where('status', 'paid')
                ->get()
                ->flatMap(fn($cart) => $cart->items)
                ->groupBy(fn($item) => $item->item->id ?? 'unknown')
                ->map(fn($group) => [
                    'id' => $group->first()->item->id ?? null,
                    'name' => $group->first()->item->name ?? 'N/A',
                    'total_quantity' => $group->sum('quantity'),
                ])
                ->sortByDesc('total_quantity')
                ->take(6)
                ->values(),
            'recentCarts' => fn() => Cart::with('items.item')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($cart) {
                    return [
                        'id' => $cart->id,
                        'status' => $cart->status,
                        'total' => $cart->total,
                        'created_at' => $cart->created_at,
                        'items' => $cart->items->map(function ($ci) {
                            return [
                                'name' => $ci->item->name ?? 'N/A',
                                'price' => $ci->price,
                                'quantity' => $ci->quantity,
                            ];
                        }),
                    ];
                }),
        ];
    }
    private function getRecentWeekSales()
    {
        $startOfWeek = Carbon::now()->subDays(7);
        $sales = Cart::where('status', 'paid')
            ->where('created_at', '>=', $startOfWeek)
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fill in missing days if there are gaps
        $sales = collect(range(0, 6))->map(function ($dayOffset) use ($sales) {
            $date = Carbon::now()->subDays(6 - $dayOffset)->format('Y-m-d');
            $sale = $sales->firstWhere('date', $date);

            return [
                'date' => $date,
                'total' => $sale ? $sale->total : 0,
            ];
        });

        return $sales;
    }
}
