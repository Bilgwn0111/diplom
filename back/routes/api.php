<?php

use App\Http\Controllers\ApiItems;
use App\Http\Controllers\AuthController;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use App\Models\UserFavorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::middleware('auth:sanctum')->group(function () {

    // Get logged-in user
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Update profile
    Route::put('/user', function (Request $request) {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        $user->update($request->only(['name', 'email', 'address', 'phone']));
        $user->save();

        return response()->json($user);
    });

    // Change password
    Route::put('/user/password', function (Request $request) {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $request->user()->password)) {
            return response()->json(['error' => 'Incorrect current password'], 403);
        }

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    });

    // Logout (delete token)
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    });

    //get all products
    Route::get('/items', [ApiItems::class, 'index']);

    //get single product
    Route::get('/items/{id}', function ($id) {
        return Item::with('images')->findOrFail($id);
    });

    // get all categories
    Route::get('/categories', function () {
        return Category::all()->select('name', 'id');
    });

});
//backend login
Route::post('login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        return response()->json([
            'token' => $user->createToken('API Token')->plainTextToken,
        ]);
    }
    return response()->json(['error' => 'Unauthorized'], 401);
});

Route::post('/register', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'address' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:20',
        'password' => 'required|string|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'address' => $request->address,
        'phone' => $request->phone,
    ]);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user,
    ], 201);
});

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
        'address' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:20',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'address' => $request->address,
        'phone' => $request->phone
    ]);

    $token = $user->createToken('API Token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
});

Route::get('/greeting', function () {
    return 'Hello World';
});

// update my favorite
Route::middleware('auth:sanctum')->post('/favorites', function (Request $request) {
    // Validate incoming request data
    $request->validate([
        'item_id' => 'required|exists:items,id',
    ]);

    // Get the currently authenticated user
    $user = Auth::user();

    // Check if the user has already favorited the item
    $existingFavorite = UserFavorite::where('user_id', $user->id)
        ->where('item_id', $request->item_id)
        ->first();

    if ($existingFavorite) {
        return response()->json([
            'message' => 'Item is already in your favorites.'
        ], 400);
    }

    // Create a new favorite
    $favorite = UserFavorite::create([
        'user_id' => $user->id,
        'item_id' => $request->item_id,
    ]);

    return response()->json([
        'message' => 'Item added to favorites successfully.',
        'favorite' => $favorite
    ], 201);
});

// get my favorite
Route::middleware('auth:sanctum')->get('/favorites', function () {
    $user = Auth::user();

    $items = UserFavorite::where('user_id', $user->id)
        ->with(['item.firstImage']) // eager load the item and its first image
        ->get()
        ->pluck('item')
        ->filter(); // remove any null items (e.g. if deleted)

    return response()->json([
        'items' => $items
    ]);
});

// insert order 
Route::middleware('auth:sanctum')->post('/cart', function (Request $request) {
    $user = $request->user();
    $items = $request->all();

    $total = 0;

    // Pre-calculate total
    foreach ($items as $entry) {
        $item = Item::findOrFail($entry['id']);
        $total += $item->price * $entry['qty'];
    }

    // Create the cart with total
    $cart = Cart::create([
        'user_id' => $user->id,
        'total' => $total,
    ]);

    // Create cart items
    foreach ($items as $entry) {
        $item = Item::findOrFail($entry['id']);

        CartItem::create([
            'cart_id' => $cart->id,
            'item_id' => $item->id,
            'quantity' => $entry['qty'],
            'price' => $item->price,
        ]);
    }

    return response()->json([
        'message' => 'Cart created successfully.',
        'cart_id' => $cart->id,
        'total' => $cart->total,
    ]);
});

// get my cart orders
Route::middleware('auth:sanctum')->get('/carts', function (Request $request) {
    $user = $request->user();

    $carts = Cart::with(['items.item.firstImage'])->where('user_id', $user->id)->orderBy('created_at', 'desc')->get();

    return response()->json($carts);
});

// get single order detail
Route::get('/cart/{id}', function (Request $request) {
    $cart = Cart::with(['items.item.firstImage'])->where('id', $request->id)->first();

    return response()->json($cart);
});


Route::middleware('auth:sanctum')->put('/user', function (Request $request) {
    $user = Auth::user();

    $validated = $request->validate([
        'name' => 'string|max:255',
        'email' => 'email|max:255|unique:users,email,' . $user->id,
        'address' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:20',
        'password' => 'nullable|string|min:8|confirmed',
    ]);

    $user->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user,
    ]);
});