/**
 * Script para asignar roles a usuarios existentes
 *
 * Uso:
 *   bun run scripts/seedRoles.ts
 *
 * Este script:
 * 1. Asigna rol 'candidate' a todos los usuarios sin rol
 * 2. Muestra instrucciones para asignar manualmente rol 'recruiter'
 */

import { AppDataSource } from "@/database/data-source";
import { User } from "@/modules/users/entities/User";
import { UserRole, RoleType } from "@/modules/roles/entities/UserRole";

async function seedRoles() {
  try {
    console.log("🔌 Conectando a la base de datos...");
    await AppDataSource.initialize();
    console.log("✅ Conexión establecida");

    const userRepository = AppDataSource.getRepository(User);
    const userRoleRepository = AppDataSource.getRepository(UserRole);

    // 1. Obtener todos los usuarios
    const allUsers = await userRepository.find();
    console.log(`\n📊 Total de usuarios en el sistema: ${allUsers.length}`);

    if (allUsers.length === 0) {
      console.log("⚠️  No hay usuarios en el sistema. Crea usuarios primero.");
      return;
    }

    // 2. Obtener usuarios que ya tienen rol
    const usersWithRoles = await userRoleRepository.find();
    const userIdsWithRoles = new Set(usersWithRoles.map(ur => ur.userId));
    console.log(`✅ Usuarios con roles asignados: ${usersWithRoles.length}`);

    // 3. Encontrar usuarios sin rol
    const usersWithoutRoles = allUsers.filter(user => !userIdsWithRoles.has(user.id));
    console.log(`⚠️  Usuarios sin rol: ${usersWithoutRoles.length}\n`);

    if (usersWithoutRoles.length === 0) {
      console.log("✅ Todos los usuarios ya tienen roles asignados");
    } else {
      // 4. Asignar rol 'candidate' a usuarios sin rol
      console.log("📝 Asignando rol 'candidate' a usuarios sin rol...\n");

      for (const user of usersWithoutRoles) {
        const userRole = userRoleRepository.create({
          userId: user.id,
          role: RoleType.CANDIDATE
        });
        await userRoleRepository.save(userRole);
        console.log(`   ✓ ${user.name} (${user.email}) → candidate`);
      }

      console.log(`\n✅ ${usersWithoutRoles.length} usuarios ahora tienen rol 'candidate'`);
    }

    // 5. Mostrar resumen de roles
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMEN DE ROLES EN EL SISTEMA");
    console.log("=".repeat(60));

    const candidates = await userRoleRepository.count({ where: { role: RoleType.CANDIDATE } });
    const recruiters = await userRoleRepository.count({ where: { role: RoleType.RECRUITER } });

    console.log(`   👥 Candidates: ${candidates}`);
    console.log(`   🎯 Recruiters: ${recruiters}`);
    console.log("=".repeat(60));

    // 6. Listar todos los usuarios con sus roles actuales
    console.log("\n📋 LISTADO DE USUARIOS Y SUS ROLES:");
    console.log("-".repeat(60));

    const allUserRoles = await userRoleRepository.find({ relations: ['user'] });

    for (const userRole of allUserRoles) {
      const icon = userRole.role === RoleType.RECRUITER ? "🎯" : "👤";
      console.log(`${icon} ${userRole.user.name.padEnd(20)} | ${userRole.user.email.padEnd(30)} | ${userRole.role}`);
    }
    console.log("-".repeat(60));

    // 7. Instrucciones para crear recruiter
    console.log("\n💡 PARA ASIGNAR ROL DE RECRUITER A UN USUARIO:");
    console.log("-".repeat(60));
    console.log("\n1️⃣  Opción 1: Actualizar usuario existente (SQL)");
    console.log("   Conecta a la base de datos (DBeaver/pgAdmin) y ejecuta:\n");
    console.log("   UPDATE user_roles");
    console.log("   SET role = 'recruiter'");
    console.log("   WHERE user_id = 'CLERK_USER_ID_AQUI';\n");

    console.log("2️⃣  Opción 2: Insertar nuevo rol (SQL)");
    console.log("   Si el usuario no tiene rol asignado:\n");
    console.log("   INSERT INTO user_roles (user_id, role)");
    console.log("   VALUES ('CLERK_USER_ID_AQUI', 'recruiter');\n");

    console.log("3️⃣  Opción 3: Desde código TypeScript");
    console.log("   Descomenta y modifica el código al final de este script\n");
    console.log("-".repeat(60));

    // 8. Código comentado para asignar recruiter programáticamente
    /*
    // DESCOMENTAR Y MODIFICAR PARA ASIGNAR RECRUITER:
    const recruiterUserId = 'CLERK_USER_ID_AQUI'; // Cambiar por el ID real

    const existingRole = await userRoleRepository.findOne({
      where: { userId: recruiterUserId }
    });

    if (existingRole) {
      existingRole.role = RoleType.RECRUITER;
      await userRoleRepository.save(existingRole);
      console.log(`\n✅ Usuario actualizado a recruiter`);
    } else {
      const newRecruiterRole = userRoleRepository.create({
        userId: recruiterUserId,
        role: RoleType.RECRUITER
      });
      await userRoleRepository.save(newRecruiterRole);
      console.log(`\n✅ Nuevo recruiter creado`);
    }
    */

    console.log("\n✅ Seed completado exitosamente");

  } catch (error) {
    console.error("\n❌ Error durante el seed:", error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log("\n🔌 Conexión cerrada\n");
  }
}

// Ejecutar seed
seedRoles();
