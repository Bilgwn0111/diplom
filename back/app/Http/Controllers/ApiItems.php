<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ApiItems extends Controller
{

    public function index(Request $request)
    {
        $query = Item::with('firstImage');

        // Filter by category if it's not null
        if (!is_null($request->category)) {
            $query->where('category_id', $request->category);
        }

        // Filter by name if it's not null or empty
        if (!empty($request->name)) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Get the items
        $items = $query->get();

        return response()->json($items);
    }

}
