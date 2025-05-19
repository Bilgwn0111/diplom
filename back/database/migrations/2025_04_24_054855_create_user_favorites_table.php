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
        Schema::create('user_favorites', function (Blueprint $table) {
            $table->id(); // primary key
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // foreign key to the users table
            $table->foreignId('item_id')->constrained()->onDelete('cascade'); // foreign key to the items table
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_favorites');
    }
};
