<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendancesTable extends Migration
{
    public function up()
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('formation_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('status', ['present', 'absent', 'late'])->default('absent');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('taken_by'); // formateur_id
            $table->timestamp('taken_at')->useCurrent();
            $table->boolean('sent_to_admin')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->foreign('formation_id')->references('id')->on('formations')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('taken_by')->references('id')->on('users')->onDelete('cascade');
            
            // Un utilisateur ne peut avoir qu'une présence par formation
            $table->unique(['formation_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendances');
    }
} 