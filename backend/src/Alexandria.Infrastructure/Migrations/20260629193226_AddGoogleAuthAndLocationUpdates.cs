using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Alexandria.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGoogleAuthAndLocationUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthenticationProvider",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "EmailVerified",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "GoogleId",
                table: "Users",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Heading",
                table: "UserLocations",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Speed",
                table: "UserLocations",
                type: "float",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 19, 32, 24, 496, DateTimeKind.Utc).AddTicks(9987));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("b2c3d4e5-f6a7-8901-bcde-f12345678901"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 19, 32, 24, 496, DateTimeKind.Utc).AddTicks(9991));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("c3d4e5f6-a7b8-9012-cdef-123456789012"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 19, 32, 24, 496, DateTimeKind.Utc).AddTicks(9993));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("d4e5f6a7-b8c9-0123-def1-234567890123"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 19, 32, 24, 496, DateTimeKind.Utc).AddTicks(9995));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("e5f6a7b8-c9d0-1234-ef12-345678901234"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 19, 32, 24, 496, DateTimeKind.Utc).AddTicks(9997));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("f6a7b8c9-d0e1-2345-f123-456789012345"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 19, 32, 24, 496, DateTimeKind.Utc).AddTicks(9999));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), new Guid("00000000-0000-0000-0000-000000000001") },
                column: "AssignedAt",
                value: new DateTime(2026, 6, 29, 19, 32, 24, 690, DateTimeKind.Utc).AddTicks(5966));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "AuthenticationProvider", "CreatedAt", "EmailVerified", "GoogleId", "PasswordHash", "RegistrationDate" },
                values: new object[] { "Local", new DateTime(2026, 6, 29, 19, 32, 24, 690, DateTimeKind.Utc).AddTicks(5329), true, null, "$2a$11$nUW2CZiAsmLRqF4dHYtN6ei5eno0/o6P4hCkWupdaCYZnG16kxQTq", new DateTime(2026, 6, 29, 19, 32, 24, 690, DateTimeKind.Utc).AddTicks(5324) });

            migrationBuilder.CreateIndex(
                name: "IX_Users_GoogleId",
                table: "Users",
                column: "GoogleId",
                unique: true,
                filter: "[GoogleId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_GoogleId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AuthenticationProvider",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EmailVerified",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "GoogleId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Heading",
                table: "UserLocations");

            migrationBuilder.DropColumn(
                name: "Speed",
                table: "UserLocations");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 12, 44, 11, 622, DateTimeKind.Utc).AddTicks(5774));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("b2c3d4e5-f6a7-8901-bcde-f12345678901"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 12, 44, 11, 622, DateTimeKind.Utc).AddTicks(5779));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("c3d4e5f6-a7b8-9012-cdef-123456789012"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 12, 44, 11, 622, DateTimeKind.Utc).AddTicks(5781));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("d4e5f6a7-b8c9-0123-def1-234567890123"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 12, 44, 11, 622, DateTimeKind.Utc).AddTicks(5783));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("e5f6a7b8-c9d0-1234-ef12-345678901234"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 12, 44, 11, 622, DateTimeKind.Utc).AddTicks(5785));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("f6a7b8c9-d0e1-2345-f123-456789012345"),
                column: "CreatedAt",
                value: new DateTime(2026, 6, 29, 12, 44, 11, 622, DateTimeKind.Utc).AddTicks(5787));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), new Guid("00000000-0000-0000-0000-000000000001") },
                column: "AssignedAt",
                value: new DateTime(2026, 6, 29, 12, 44, 11, 785, DateTimeKind.Utc).AddTicks(4895));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "PasswordHash", "RegistrationDate" },
                values: new object[] { new DateTime(2026, 6, 29, 12, 44, 11, 785, DateTimeKind.Utc).AddTicks(4385), "$2a$11$Ie7ck2HINinE15BkqQKwHObJtIijDc1wey5CxGfRqq/BltRUP/Ojm", new DateTime(2026, 6, 29, 12, 44, 11, 785, DateTimeKind.Utc).AddTicks(4381) });
        }
    }
}
