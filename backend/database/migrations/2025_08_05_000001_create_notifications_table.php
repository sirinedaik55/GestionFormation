<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info'); // attendance, formation, user, etc.
            $table->timestamp('read_at')->nullable();
            $table->json('data')->nullable(); // Additional data
            $table->unsignedBigInteger('recipient_id'); // admin_id
            $table->unsignedBigInteger('sender_id')->nullable(); // formateur_id
            $table->unsignedBigInteger('formation_id')->nullable();
            $table->timestamps();

            $table->foreign('recipient_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('formation_id')->references('id')->on('formations')->onDelete('cascade');
            
            $table->index(['recipient_id', 'read_at']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
} 