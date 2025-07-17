<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('date');
            $table->integer('duree');
            $table->unsignedBigInteger('equipe_id');
            $table->unsignedBigInteger('formateur_id');
            $table->timestamps();

            $table->foreign('equipe_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('formateur_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
