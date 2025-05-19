<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Image;
use Illuminate\Http\Request;

use App\Models\Item;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        $categories = Category::all(); // Fetch all categories
        $items = Item::with('category', 'images')->get(); // Get items with their categories and images

        return inertia('Items/Index', [
            'items' => $items,
            'categories' => $categories // Pass categories to the frontend
        ]);
    }

    public function toggleActive(Request $request, Item $item)
    {
        $item->update([
            'is_active' => $request->boolean('is_active'),
        ]);

        // Redirect back to the items page
        return redirect()->back();
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'subname' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $item = Item::create([
            'name' => $validated['name'],
            'subname' => $validated['subname'] ?? '',
            'description' => $validated['description'] ?? '',
            'price' => $validated['price'],
            'category_id' => $validated['category_id'],
            'is_active' => true,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('items', 'public');
                $item->images()->create(['url' => $path]);
            }
        }

        return redirect()->route('items.index');
    }
    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'subname' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $item->update([
            'name' => $validated['name'],
            'subname' => $validated['subname'] ?? '',
            'description' => $validated['description'] ?? '',
            'price' => $validated['price'],
            'category_id' => $validated['category_id'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('items', 'public');
                $item->images()->create(['url' => $path]);
            }
        }

        return redirect()->route('items.index');
    }
    public function deleteImage(Item $item, Image $image)
    {
        // Check ownership if needed
        $image->delete();

        return back();
    }


}
