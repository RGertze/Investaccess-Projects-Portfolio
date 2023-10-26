<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('user_id')->index('user_id');
            $table->text('title');
            $table->text('description')->nullable();
            $table->integer('position');
            $table->dateTime('created_at')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('completed_at')->nullable();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->integer('id', true);
            $table->text('email');
            $table->text('password');
            $table->dateTime('created_at')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->foreign(['user_id'], 'tasks_ibfk_1')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign('tasks_ibfk_1');
        });

        Schema::dropIfExists('users');

        Schema::dropIfExists('tasks');

        Schema::dropIfExists('personal_access_tokens');
    }
};
