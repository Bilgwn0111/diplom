<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::rename('cart_item', 'cart_items');
    }

    public function down()
    {
        Schema::rename('cart_items', 'cart_item');
    }

};
