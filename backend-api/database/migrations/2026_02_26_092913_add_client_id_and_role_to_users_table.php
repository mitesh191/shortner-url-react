<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\UserRole;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
	Schema::table ( 'users', function (Blueprint $table) {
		$table->foreignId ( 'client_id' )->nullable ()->constrained ()->nullOnDelete ();
		$table->enum ( 'role', [ 
				UserRole::SUPERADMIN,
				UserRole::ADMIN,
				UserRole::MEMBER 
		] )->default(UserRole::MEMBER);
	});
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
